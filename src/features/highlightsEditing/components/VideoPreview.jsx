import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

const VideoPreview = forwardRef(function VideoPreview(
  { tracks, clipMap, selectedBrowserClip },
  ref
) {
  const videoEl = useRef(null);

  // Keep latest prop values accessible inside imperative methods (avoids stale closures)
  const tracksRef = useRef(tracks);
  const clipMapRef = useRef(clipMap);
  const selectedBrowserClipRef = useRef(selectedBrowserClip);
  const loadedRef = useRef(null);   // { instanceId, url } of the currently loaded clip
  const isPlayingRef = useRef(false);

  const [title, setTitle] = useState("Select a clip to preview");
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => { tracksRef.current = tracks; }, [tracks]);
  useEffect(() => { clipMapRef.current = clipMap; }, [clipMap]);
  useEffect(() => { selectedBrowserClipRef.current = selectedBrowserClip; }, [selectedBrowserClip]);

  // ─── helpers ──────────────────────────────────────────────────────────────

  const findClipAt = (t) => {
    const clips = tracksRef.current?.video || [];
    return clips
      .slice()
      .sort((a, b) => a.startTime - b.startTime)
      .find((c) => t >= c.startTime && t < c.startTime + c.duration) ?? null;
  };

  const findNextClip = (current) => {
    const clips = tracksRef.current?.video || [];
    const end = current.startTime + current.duration;
    return clips
      .slice()
      .sort((a, b) => a.startTime - b.startTime)
      .find((c) => c.startTime >= end) ?? null;
  };

  const loadClip = (tc, url, offsetSec, play) => {
    const vid = videoEl.current;
    if (!vid) return;
    vid.src = url;
    vid.currentTime = Math.max(0, offsetSec);
    loadedRef.current = { instanceId: tc?.instanceId ?? null, url };
    setHasContent(true);
    const full = tc ? clipMapRef.current?.[tc.clipId] : null;
    setTitle(full?.title || tc?.label || "Clip");
    if (play) vid.play().catch(() => {});
  };

  // ─── imperative API (driven by HighlightsEditing) ─────────────────────────

  useImperativeHandle(ref, () => ({

    /** Called from RAF loop every frame (forceSeek=false) and on user scrub (forceSeek=true). */
    seekToTime(globalTime, forceSeek = false) {
      const vid = videoEl.current;
      if (!vid) return;

      const videoTracks = tracksRef.current?.video || [];

      // No timeline clips → preview selected browser clip
      if (!videoTracks.length) {
        const bc = selectedBrowserClipRef.current;
        if (bc?.url && loadedRef.current?.url !== bc.url) {
          vid.src = bc.url;
          vid.currentTime = 0;
          loadedRef.current = { instanceId: `browser-${bc.id}`, url: bc.url };
          setHasContent(true);
          setTitle(bc.title || "Preview");
        }
        return;
      }

      const tc = findClipAt(globalTime);
      const full = tc ? clipMapRef.current?.[tc.clipId] : null;
      const url = full?.url ?? null;

      if (!tc || !url) {
        // Playhead is in a gap — pause but keep last frame visible
        if (loadedRef.current !== null) {
          vid.pause();
          loadedRef.current = null;
        }
        return;
      }

      if (tc.instanceId !== loadedRef.current?.instanceId) {
        // Different clip — switch source
        loadClip(tc, url, globalTime - tc.startTime, isPlayingRef.current);
      } else if (forceSeek) {
        // Same clip, user scrubbed — jump to new offset
        vid.currentTime = Math.max(0, Math.min(globalTime - tc.startTime, tc.duration));
      }
      // else: same clip, playing normally — don't interfere
    },

    play() {
      isPlayingRef.current = true;
      videoEl.current?.play().catch(() => {});
    },

    pause() {
      isPlayingRef.current = false;
      videoEl.current?.pause();
    },

    /** Called when the Play button is pressed — loads the right clip then starts. */
    startPlayback(globalTime) {
      isPlayingRef.current = true;
      const vid = videoEl.current;
      if (!vid) return;

      const videoTracks = tracksRef.current?.video || [];

      if (!videoTracks.length) {
        const bc = selectedBrowserClipRef.current;
        if (bc?.url) {
          if (loadedRef.current?.url !== bc.url) {
            vid.src = bc.url;
            loadedRef.current = { instanceId: `browser-${bc.id}`, url: bc.url };
            setHasContent(true);
            setTitle(bc.title || "Preview");
          }
          vid.play().catch(() => {});
        }
        return;
      }

      const tc = findClipAt(globalTime);
      const full = tc ? clipMapRef.current?.[tc.clipId] : null;

      if (tc && full?.url) {
        const offset = globalTime - tc.startTime;
        if (loadedRef.current?.instanceId !== tc.instanceId) {
          loadClip(tc, full.url, offset, true);
        } else {
          vid.currentTime = Math.max(0, offset);
          vid.play().catch(() => {});
        }
      } else {
        // Playhead in a gap — find and schedule the next clip
        const sorted = videoTracks.slice().sort((a, b) => a.startTime - b.startTime);
        const next = sorted.find((c) => c.startTime > globalTime);
        if (next) {
          const nextFull = clipMapRef.current?.[next.clipId];
          if (nextFull?.url) {
            const delay = (next.startTime - globalTime) * 1000;
            setTimeout(() => {
              if (isPlayingRef.current) loadClip(next, nextFull.url, 0, true);
            }, delay);
          }
        }
      }
    },

  }), []); // empty deps — all live values accessed through refs

  // ─── video event handlers ──────────────────────────────────────────────────

  const handleEnded = () => {
    if (!isPlayingRef.current || !loadedRef.current) return;
    const videoTracks = tracksRef.current?.video || [];
    const current = videoTracks.find((c) => c.instanceId === loadedRef.current?.instanceId);
    if (!current) return;

    const next = findNextClip(current);
    if (!next) { isPlayingRef.current = false; return; }

    const nextFull = clipMapRef.current?.[next.clipId];
    if (!nextFull?.url) return;

    const gap = next.startTime - (current.startTime + current.duration);
    if (gap > 0) {
      setTimeout(() => {
        if (isPlayingRef.current) loadClip(next, nextFull.url, 0, true);
      }, gap * 1000);
    } else {
      loadClip(next, nextFull.url, 0, true);
    }
  };

  // When the selected browser clip changes (no timeline clips) → update preview
  useEffect(() => {
    const hasTimeline = (tracks?.video?.length || 0) > 0;
    if (hasTimeline || !selectedBrowserClip?.url) return;
    const vid = videoEl.current;
    if (!vid || loadedRef.current?.url === selectedBrowserClip.url) return;
    vid.src = selectedBrowserClip.url;
    vid.currentTime = 0;
    loadedRef.current = { instanceId: `browser-${selectedBrowserClip.id}`, url: selectedBrowserClip.url };
    setHasContent(true);
    setTitle(selectedBrowserClip.title || "Preview");
  }, [selectedBrowserClip?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── render ───────────────────────────────────────────────────────────────

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">

      {/* ── Video ── the container is mathematically exact 16:9, so object-contain fills it perfectly */}
      <video
        ref={videoEl}
        className="absolute inset-0 w-full h-full object-contain"
        onEnded={handleEnded}
        playsInline
      />

      {/* ── Empty state ── shown before any clip is loaded */}
      {!hasContent && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center">
            <svg className="w-7 h-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14
                   M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-slate-500 text-sm">Select a clip or drag to timeline</p>
        </div>
      )}

      {/* ── Top gradient overlay — fades into video ── */}
      <div
        className="absolute inset-x-0 top-0 h-16 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)" }}
      />

      {/* ── Title (top-left) ── */}
      <p className="absolute top-2.5 left-4 z-20 text-sm font-medium text-white drop-shadow
                    max-w-[55%] truncate pointer-events-none">
        {title}
      </p>

      {/* ── Resolution badge (top-right) ── */}
      <span className="absolute top-2.5 right-11 z-20 text-xs text-white/50 pointer-events-none select-none">
        1080P · 24 FPS
      </span>

      {/* ── Fullscreen button (top-right corner) ── */}
      <button
        className="absolute top-2 right-3 z-20 p-1 text-white/50 hover:text-white transition-colors"
        title="Fullscreen"
        onClick={() => videoEl.current?.requestFullscreen?.()}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5
               M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>

    </div>
  );
});

export default VideoPreview;
