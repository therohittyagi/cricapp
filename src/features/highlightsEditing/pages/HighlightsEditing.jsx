import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ClipBrowser from "../components/ClipBrowser";
import { selectClips, selectMatchId } from "../../videoTrimming/videoSlice";
import {
  fetchMatchConfigThunk,
  fetchClipsListThunk,
} from "../../videoTrimming/videoThunk";
import VideoPreview from "../components/VideoPreview";
import PlaybackControls from "../components/Playbackcontrols";
import HighlightTimeline from "../components/HighlightTimeline";
import HighlightsPanel from "../components/HighlightsPanel";

const DEFAULT_MATCH_ID = "CNO-20260608-ODI-INDPAK-U7UABG";
const BASE_DURATION = 5 * 60 + 12; // minimum timeline length (seconds)

function mapClip(clip) {
  return {
    id: clip.id,
    title: clip.output_name || "clip.mp4",
    date: clip.created_at
      ? new Date(clip.created_at).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : "",
    tags: clip.tags || [],
    tag: clip.tags?.[0] || "",
    thumbnail: clip.thumbnail_url || null,
    duration:
      clip.end_time != null && clip.start_time != null
        ? clip.end_time - clip.start_time
        : 0,
    url: clip.url || "",
    status: clip.status || "",
  };
}

export default function HighlightsEditing() {
  const dispatch = useDispatch();
  const matchId = useSelector(selectMatchId);
  const rawClips = useSelector(selectClips);

  const draggingClip = useRef(null);
  const videoPreviewRef = useRef(null);

  const [activeTab, setActiveTab] = useState("Clips");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedClip, setSelectedClip] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [selectedTimelineClip, setSelectedTimelineClip] = useState(null);
  const [tracks, setTracks] = useState({ video: [], logo: [] });
  const [highlights, setHighlights] = useState([]);

  // Playback refs (avoid re-renders during RAF loop)
  const playheadRef = useRef(0);
  const rafRef = useRef(null);
  const lastTsRef = useRef(null);

  useEffect(() => {
    dispatch(fetchMatchConfigThunk(DEFAULT_MATCH_ID));
  }, [dispatch]);

  useEffect(() => {
    if (!matchId) return;
    dispatch(fetchClipsListThunk(matchId));
  }, [matchId, dispatch]);

  const clips = useMemo(() => rawClips.map(mapClip), [rawClips]);

  // clipId → full clip object (for video URL lookups in VideoPreview)
  const clipMap = useMemo(() => {
    const m = {};
    clips.forEach((c) => { m[c.id] = c; });
    return m;
  }, [clips]);

  // Dynamic timeline duration — grows to fit all clips, with padding
  const totalDuration = useMemo(() => {
    if (tracks.video.length === 0) return BASE_DURATION;
    const maxEnd = Math.max(...tracks.video.map((c) => c.startTime + c.duration));
    return Math.max(maxEnd + 10, BASE_DURATION);
  }, [tracks.video]);

  // ── RAF playback loop ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
      return;
    }

    const tick = (ts) => {
      if (lastTsRef.current != null) {
        const delta = (ts - lastTsRef.current) / 1000;
        const newTime = Math.min(playheadRef.current + delta, totalDuration);
        playheadRef.current = newTime;
        setPlayhead(newTime);

        // Imperative video sync — only switches clip when active clip changes
        videoPreviewRef.current?.seekToTime(newTime, false);

        if (newTime >= totalDuration) {
          videoPreviewRef.current?.pause();
          setIsPlaying(false);
          return;
        }
      }
      lastTsRef.current = ts;
      rafRef.current = requestAnimationFrame(tick);
    };

    lastTsRef.current = null;
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [isPlaying, totalDuration]);

  // Keep playheadRef in sync when state is updated externally (seek, stop)
  useEffect(() => {
    if (!isPlaying) playheadRef.current = playhead;
  }, [playhead, isPlaying]);

  // When tracks change while paused, refresh the preview frame
  useEffect(() => {
    if (!isPlaying) {
      videoPreviewRef.current?.seekToTime(playheadRef.current, true);
    }
  }, [tracks]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── playback controls ─────────────────────────────────────────────────────

  const handlePlayPause = () => {
    if (isPlaying) {
      videoPreviewRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoPreviewRef.current?.startPlayback(playheadRef.current);
      setIsPlaying(true);
    }
  };

  const handleSeek = (time) => {
    const clamped = Math.max(0, Math.min(time, totalDuration));
    playheadRef.current = clamped;
    setPlayhead(clamped);
    videoPreviewRef.current?.seekToTime(clamped, true);
  };

  const handleRewind = () => handleSeek(0);
  const handleSkipBackward = () => handleSeek(playheadRef.current - 5);
  const handleSkipForward = () => handleSeek(playheadRef.current + 5);

  // ── clip browser actions ──────────────────────────────────────────────────

  const handleDragStart = (e, clip) => {
    draggingClip.current = clip;
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleAddClip = () => {
    if (!selectedClip) return;
    setTracks((prev) => ({
      ...prev,
      video: [
        ...prev.video,
        {
          instanceId: `video-${Date.now()}`,
          clipId: selectedClip.id,
          tag: selectedClip.tag,
          label: selectedClip.title || selectedClip.tag || "Clip",
          startTime: Math.floor(playheadRef.current),
          duration: selectedClip.duration || 10,
        },
      ],
    }));
  };

  // ── timeline editing actions ──────────────────────────────────────────────

  const handleDelete = () => {
    if (!selectedTimelineClip) return;
    setTracks((prev) => ({
      video: prev.video.filter((c) => c.instanceId !== selectedTimelineClip),
      logo: prev.logo.filter((c) => c.instanceId !== selectedTimelineClip),
    }));
    setSelectedTimelineClip(null);
  };

  const handleSplit = () => {
    if (!selectedTimelineClip) return;
    setTracks((prev) => {
      const updated = {};
      for (const [key, clips] of Object.entries(prev)) {
        const idx = clips.findIndex((c) => c.instanceId === selectedTimelineClip);
        if (idx === -1) { updated[key] = clips; continue; }
        const clip = clips[idx];
        const splitPoint = playheadRef.current - clip.startTime;
        if (splitPoint <= 0 || splitPoint >= clip.duration) { updated[key] = clips; continue; }
        updated[key] = [
          ...clips.slice(0, idx),
          { ...clip, duration: splitPoint },
          {
            ...clip,
            instanceId: `${clip.instanceId}-b`,
            startTime: clip.startTime + splitPoint,
            duration: clip.duration - splitPoint,
          },
          ...clips.slice(idx + 1),
        ];
      }
      return updated;
    });
  };

  const handleDuplicate = () => {
    if (!selectedTimelineClip) return;
    setTracks((prev) => {
      const updated = {};
      for (const [key, clips] of Object.entries(prev)) {
        const clip = clips.find((c) => c.instanceId === selectedTimelineClip);
        if (!clip) { updated[key] = clips; continue; }
        updated[key] = [
          ...clips,
          {
            ...clip,
            instanceId: `${clip.instanceId}-dup-${Date.now()}`,
            startTime: clip.startTime + clip.duration + 1,
          },
        ];
      }
      return updated;
    });
  };

  // Drag-and-drop from clip browser onto a track
  const handleTrackDrop = (e, trackKey) => {
    e.preventDefault();
    if (!draggingClip.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const clip = draggingClip.current;
    setTracks((prev) => ({
      ...prev,
      [trackKey]: [
        ...prev[trackKey],
        {
          instanceId: `${trackKey}-${Date.now()}`,
          clipId: clip.id,
          tag: clip.tag,
          label: clip.title || clip.tag || "Clip",
          startTime: ratio * totalDuration,
          duration: clip.duration || 10,
        },
      ],
    }));
    draggingClip.current = null;
  };

  // Move a clip on the timeline (drag body)
  const handleClipMove = (instanceId, newStartTime) => {
    setTracks((prev) => {
      const updated = {};
      for (const [key, clips] of Object.entries(prev)) {
        updated[key] = clips.map((c) =>
          c.instanceId === instanceId
            ? { ...c, startTime: Math.max(0, newStartTime) }
            : c
        );
      }
      return updated;
    });
  };

  // Resize (trim) a clip on the timeline
  const handleClipTrim = (instanceId, newStart, newDuration) => {
    setTracks((prev) => {
      const updated = {};
      for (const [key, clips] of Object.entries(prev)) {
        updated[key] = clips.map((c) =>
          c.instanceId === instanceId
            ? { ...c, startTime: Math.max(0, newStart), duration: Math.max(0.5, newDuration) }
            : c
        );
      }
      return updated;
    });
  };

  // ── highlights panel ──────────────────────────────────────────────────────

  const handleAddToHighlights = () => {
    const allClips = [...tracks.video, ...tracks.logo];
    const clip = allClips.find((c) => c.instanceId === selectedTimelineClip);
    if (!clip) return;
    setHighlights((prev) => [...prev, { ...clip, highlightId: Date.now() }]);
  };

  const handleRemoveHighlight = (highlightId) => {
    setHighlights((prev) => prev.filter((h) => h.highlightId !== highlightId));
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen bg-[#0f1117] text-white font-sans select-none overflow-hidden">
      {/*
        Top row — height is locked to exactly (video-width × 9/16).
        ClipBrowser = 25 vw, HighlightsPanel = 25 vw → video = 50 vw
        So row height = 50vw × 9/16 = 28.125 vw → guaranteed 16:9 container.
      */}
      <div
        className="flex w-full shrink-0 overflow-hidden"
        style={{ height: "calc(50vw * 9 / 16)" }}
      >
        <ClipBrowser
          activeTab={activeTab}
          onTabChange={setActiveTab}
          clips={clips}
          activeFilter={activeFilter}
          selectedClip={selectedClip}
          onFilterChange={setActiveFilter}
          onClipSelect={setSelectedClip}
          onDragStart={handleDragStart}
        />

        {/* Video column — fills the exact 16:9 height set on the row */}
        <div className="flex-1 h-full min-w-0">
          <VideoPreview
            ref={videoPreviewRef}
            tracks={tracks}
            clipMap={clipMap}
            selectedBrowserClip={selectedClip}
          />
        </div>

        <HighlightsPanel
          highlights={highlights}
          selectedTimelineClip={selectedTimelineClip}
          onAddHighlight={handleAddToHighlights}
          onRemoveHighlight={handleRemoveHighlight}
        />
      </div>

      {/* Bottom: controls + timeline sit directly below the video */}
      <div className="flex flex-col shrink-0">
        <PlaybackControls
          isPlaying={isPlaying}
          playhead={playhead}
          totalDuration={totalDuration}
          selectedTimelineClip={selectedTimelineClip}
          onPlayPause={handlePlayPause}
          onRewind={handleRewind}
          onSkipBackward={handleSkipBackward}
          onSkipForward={handleSkipForward}
          onAddClip={handleAddClip}
          onDelete={handleDelete}
          onSplit={handleSplit}
          onDuplicate={handleDuplicate}
        />
        <HighlightTimeline
          tracks={tracks}
          playhead={playhead}
          totalDuration={totalDuration}
          selectedTimelineClip={selectedTimelineClip}
          onSeek={handleSeek}
          onClipSelect={setSelectedTimelineClip}
          onTrackDrop={handleTrackDrop}
          onClipMove={handleClipMove}
          onClipTrim={handleClipTrim}
        />
      </div>
    </div>
  );
}
