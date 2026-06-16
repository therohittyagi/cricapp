import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatTime, clamp } from "../../../shared/utils/formatTime/timeFormat";
import {
  CRICKET_TAGS,
  TAG_CATEGORY_STYLES,
} from "../../../shared/constants/events";
import { saveMp4ClipThunk } from "../videoThunk";
import { selectMp4ClipLoading, selectMatchId } from "../videoSlice";
import Toast, { useToast } from "../../../shared/components/Toast";

import ForwardIcon from "../../../assets/Icon/forwardIcon.svg";
import RewindIcon from "../../../assets/Icon/rewindIcon.svg";
import PauseIcon from "../../../assets/Icon/pauseIcon.svg";
import PlayIcon from "../../../assets/Icon/playIcon.svg";
import DownloadIcon from "../../../assets/Icon/downloadIcon.svg";
import CutIcon from "../../../assets/Icon/cutIcon.svg";
import FullscreenIcon from "../../../assets/Icon/fullscreenIcon.svg";

const MAJOR_TICKS = 13;
const MINOR_PER_SEGMENT = 4;

const CATEGORY_LABELS = {
  runs: "Runs",
  extras: "Extras",
  wicket: "Wickets",
  milestone: "Milestones",
  match: "Match",
};
const CATEGORIES = ["runs", "extras", "wicket", "milestone", "match"];

export default function ClipPlayer({ clip, onClose }) {
  const dispatch = useDispatch();
  const matchId = useSelector(selectMatchId);
  const mp4Loading = useSelector(selectMp4ClipLoading);
  const { toast, showToast, hideToast } = useToast();

  const videoRef = useRef(null);
  const seekBarRef = useRef(null);

  /* playback */
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  /* in/out */
  const [inPoint, setInPoint] = useState(null);
  const [outPoint, setOutPoint] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [hoverFrac, setHoverFrac] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  /* form */
  const [showForm, setShowForm] = useState(false);

  const videoUrl =
    clip.url || clip.output_url || clip.mp4_url || clip.file_url || null;
  const name = clip.output_name || "clip.mp4";

  /* ── video events ── */
  // videoUrl in deps: when a pending clip transitions to success its URL arrives,
  // mounting the <video> element for the first time — we need to re-attach here.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => setCurrentTime(v.currentTime);
    const onMeta = () => setDuration(v.duration || 0);
    const onEnded = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("ended", onEnded);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("ended", onEnded);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [videoUrl]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = isMuted ? 0 : volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setInPoint(null);
    setOutPoint(null);
    setActiveMarker(null);
    setShowEdit(false);
    setShowForm(false);
  }, [clip.id]);

  /* ── drag playhead ── */
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const frac = getFrac(e.clientX);
      const t = frac * duration;
      if (videoRef.current) videoRef.current.currentTime = t;
      setCurrentTime(t);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging, duration]);

  /* ── keyboard (only when hovering this panel) ── */
  useEffect(() => {
    if (!showEdit || !isHovered) return;
    const onKey = (e) => {
      if (e.target.tagName === "INPUT") return;
      const t = hoverFrac != null ? hoverFrac * duration : currentTime;

      if (e.key === "i" || e.key === "I") {
        const clamped = Math.min(
          t,
          outPoint != null ? outPoint - 0.1 : duration,
        );
        setInPoint(clamped);
        setCurrentTime(clamped);
        setActiveMarker("in");
        if (videoRef.current) {
          videoRef.current.currentTime = clamped;
          videoRef.current.play().catch(() => {});
        }
        setIsPlaying(true);
        if (outPoint != null && clamped >= outPoint)
          setOutPoint(Math.min(clamped + 1, duration));
      } else if (e.key === "o" || e.key === "O") {
        const clamped = Math.max(t, inPoint != null ? inPoint + 0.1 : 0);
        setOutPoint(clamped);
        setCurrentTime(clamped);
        setActiveMarker("out");
        if (videoRef.current) {
          videoRef.current.currentTime = clamped;
          videoRef.current.pause();
        }
        setIsPlaying(false);
        if (inPoint != null && clamped <= inPoint)
          setInPoint(Math.max(clamped - 1, 0));
      } else if (e.key === "Enter" && inPoint != null && outPoint != null) {
        setShowForm(true);
      } else if (
        (e.key === "ArrowLeft" || e.key === "ArrowRight") &&
        activeMarker
      ) {
        e.preventDefault();
        const delta = e.key === "ArrowRight" ? 1 : -1;
        if (activeMarker === "in" && inPoint != null) {
          const newT = clamp(
            inPoint + delta,
            0,
            outPoint != null ? outPoint - 0.1 : duration,
          );
          setInPoint(newT);
          setCurrentTime(newT);
          if (videoRef.current) videoRef.current.currentTime = newT;
        } else if (activeMarker === "out" && outPoint != null) {
          const newT = clamp(
            outPoint + delta,
            inPoint != null ? inPoint + 0.1 : 0,
            duration,
          );
          setOutPoint(newT);
          setCurrentTime(newT);
          if (videoRef.current) videoRef.current.currentTime = newT;
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    showEdit,
    isHovered,
    hoverFrac,
    duration,
    currentTime,
    inPoint,
    outPoint,
    activeMarker,
  ]);

  /* ── helpers ── */
  const getFrac = (clientX) => {
    const rect = seekBarRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    isPlaying ? v.pause() : v.play().catch(() => {});
  };

  const seek = (delta) => {
    const v = videoRef.current;
    if (!v) return;
    const t = clamp(currentTime + delta, 0, duration);
    v.currentTime = t;
    setCurrentTime(t);
  };

  const handleSeekClick = (e) => {
    const frac = getFrac(e.clientX);
    const t = frac * duration;
    if (videoRef.current) videoRef.current.currentTime = t;
    setCurrentTime(t);
    if (showEdit) {
      const clamped = Math.min(t, outPoint != null ? outPoint - 0.1 : duration);
      setInPoint(clamped);
      setIsPlaying(true);
      if (videoRef.current) videoRef.current.play().catch(() => {});
      if (outPoint != null && clamped >= outPoint)
        setOutPoint(Math.min(clamped + 1, duration));
    }
  };

  const handleSeekContext = (e) => {
    if (!showEdit) return;
    e.preventDefault();
    const t = getFrac(e.clientX) * duration;
    setOutPoint(t);
    setCurrentTime(t);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = t;
      videoRef.current.pause();
    }
    if (inPoint != null && t <= inPoint) setInPoint(Math.max(t - 1, 0));
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolumeState(val);
    setIsMuted(val === 0);
  };

  const toggleEdit = () => {
    setShowEdit((o) => !o);
    if (showEdit) {
      setInPoint(null);
      setOutPoint(null);
      setActiveMarker(null);
      setShowForm(false);
    }
  };

  /* ── derived ── */
  const playPct = duration ? (currentTime / duration) * 100 : 0;
  const inPct = inPoint != null && duration ? (inPoint / duration) * 100 : null;
  const outPct =
    outPoint != null && duration ? (outPoint / duration) * 100 : null;
  const rangePct = inPct != null && outPct != null ? outPct - inPct : 0;
  const displayVol = isMuted ? 0 : volume;

  return (
    <div
      className="flex flex-col h-full overflow-hidden @container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Header ── */}
      <div className="flex items-center gap-2 px-3 py-[7px] bg-[#0d1117] border-b border-[#1f2937] shrink-0">
        <p className="text-[11px] font-medium text-[#d1d5db] truncate flex-1">
          {name}
        </p>
        <button
          onClick={onClose}
          className="w-5 h-5 shrink-0 flex items-center justify-center rounded text-[#6b7280] hover:text-white hover:bg-white/[0.08] transition-colors text-[11px] leading-none"
        >
          ✕
        </button>
      </div>

      {/* ── Video ── */}
      <div
        className={`relative bg-black w-full overflow-hidden ${showForm ? "h-[24vh]" : ""}`}
        style={showForm ? {} : { aspectRatio: "16/9" }}
        onClick={togglePlay}
      >
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain cursor-pointer"
          />
        ) : (
          <div className="w-full h-full bg-[#0d1117] flex items-center justify-center cursor-pointer">
            <span className="text-[#4b5563] text-[11px]">No video URL</span>
          </div>
        )}
      </div>

      {/* ── Controls bar (exact same as left editor) ── */}
      <div
        className={`bg-[#111318] border-t border-[#1f2937] px-2 @lg:px-3 @2xl:px-[14px] flex items-center justify-between gap-1 @2xl:gap-2 shrink-0 ${showForm ? "h-[44px]" : "h-[50px] @lg:h-[60px] @2xl:h-[70px]"}`}
      >
        {/* Left: time + volume */}
        <div className="flex items-center gap-1">
          <div className="text-[10px] @lg:text-[11px] @2xl:text-[13px] font-semibold tabular-nums text-[#d1d5db] @lg:min-w-[80px] @2xl:min-w-[112px]">
            {formatTime(currentTime)} <span className="text-[#4b5563]">/</span>{" "}
            {formatTime(duration)}
          </div>

          {/* Volume — same as VolumeControl.jsx */}
          <div className="flex items-center gap-1 @2xl:gap-[6px]">
            <button
              onClick={() => setIsMuted((m) => !m)}
              title={isMuted ? "Unmute" : "Mute"}
              className={`bg-transparent border-none cursor-pointer w-5 h-5 @lg:w-6 @lg:h-6 @2xl:w-7 @2xl:h-7 flex items-center justify-center rounded ${isMuted ? "text-[#6b7280]" : "text-[#9ca3af]"}`}
            >
              {isMuted ? <MutedIcon /> : <MuteIcon />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={displayVol}
              onChange={handleVolumeChange}
              className="w-[40px] @lg:w-[52px] @2xl:w-[72px]"
              style={{
                background: `linear-gradient(to right, #6366f1 ${displayVol * 100}%, #374151 0)`,
              }}
            />
          </div>
        </div>

        {/* Centre: playback — same as PlaybackControls.jsx */}
        <div className="flex items-center justify-around gap-[3px] border border-[#374151] bg-[#1f2937] rounded-full w-[140px] @lg:w-[162px] @2xl:w-[200px]">
          <button
            className="bg-transparent border-none text-[#9ca3af] hover:text-white cursor-pointer w-7 h-7 @lg:w-8 @lg:h-8 @2xl:w-10 @2xl:h-10 rounded-md flex items-center justify-center transition-all duration-150"
            onClick={() => seek(-10)}
            title="Rewind 10s"
          >
            <img
              src={RewindIcon}
              alt="Rewind"
              loading="lazy"
              className="w-[13px] h-[13px] @lg:w-4 @lg:h-4 @2xl:w-5 @2xl:h-5"
            />
          </button>
          <button
            onClick={togglePlay}
            className="text-white cursor-pointer w-7 h-7 @lg:w-8 @lg:h-8 @2xl:w-10 @2xl:h-10 flex items-center justify-center transition-all duration-150 hover:bg-[#374151]"
          >
            {isPlaying ? (
              <img
                src={PauseIcon}
                alt="Pause"
                loading="lazy"
                className="w-[13px] h-[13px] @lg:w-4 @lg:h-4 @2xl:w-5 @2xl:h-5"
              />
            ) : (
              <img
                src={PlayIcon}
                alt="Play"
                loading="lazy"
                className="w-[13px] h-[13px] @lg:w-4 @lg:h-4 @2xl:w-5 @2xl:h-5"
              />
            )}
          </button>
          <button
            className="bg-transparent border-none text-[#9ca3af] hover:text-white cursor-pointer w-7 h-7 @lg:w-8 @lg:h-8 @2xl:w-10 @2xl:h-10 rounded-md flex items-center justify-center transition-all duration-150"
            onClick={() => seek(30)}
            title="Forward 30s"
          >
            <img
              src={ForwardIcon}
              alt="Forward"
              loading="lazy"
              className="w-[13px] h-[13px] @lg:w-4 @lg:h-4 @2xl:w-5 @2xl:h-5"
            />
          </button>
        </div>

        {/* Right: action buttons — same as VideoTrimming.jsx */}
        <div className="flex items-center gap-[3px] @2xl:gap-[5px]">
          <ActionBtn
            title="Download"
            onClick={() => videoUrl && window.open(videoUrl, "_blank")}
          >
            <img
              src={DownloadIcon}
              alt="Download"
              loading="lazy"
              className="w-[13px] h-[13px] @lg:w-[15px] @lg:h-[15px] @2xl:w-[18px] @2xl:h-[18px]"
            />
          </ActionBtn>
          <ActionBtn title="Edit IN/OUT" onClick={toggleEdit} active={showEdit}>
            <img
              src={CutIcon}
              alt="Cut"
              loading="lazy"
              className="w-[13px] h-[13px] @lg:w-[15px] @lg:h-[15px] @2xl:w-[18px] @2xl:h-[18px]"
            />
          </ActionBtn>
          <ActionBtn
            title="Fullscreen"
            onClick={() => videoRef.current?.requestFullscreen?.()}
          >
            <img
              src={FullscreenIcon}
              alt="Fullscreen"
              loading="lazy"
              className="w-[13px] h-[13px] @lg:w-[15px] @lg:h-[15px] @2xl:w-[18px] @2xl:h-[18px]"
            />
          </ActionBtn>
        </div>
      </div>

      {/* ── Timeline (exact same as Timeline.jsx) ── */}
      <div
        className={`bg-[#111318] border-t border-[#1f2937] shrink-0 ${showForm ? "px-2 pt-1" : "px-[14px] pt-2"} ${showEdit && !showForm ? "pb-9" : showEdit && showForm ? "pb-7" : showForm ? "pb-1" : "pb-3"}`}
      >
        {showEdit && (
          <div className="flex justify-end gap-4 mb-1 text-[10px] text-[#4b5563] select-none">
            <span>
              <span className="text-blue-400 font-semibold">
                Left click / I
              </span>{" "}
              → Set IN
            </span>
            <span>
              <span className="text-blue-400 font-semibold">
                Right click / O
              </span>{" "}
              → Set OUT
            </span>
          </div>
        )}

        {/* Time ruler */}
        <div className="relative h-[22px] mb-1 overflow-visible">
          {Array.from({ length: MAJOR_TICKS }, (_, i) => {
            const frac = i / (MAJOR_TICKS - 1);
            return (
              <div
                key={i}
                className="absolute flex flex-col items-center"
                style={{ left: `${frac * 100}%` }}
              >
                <span className="text-[9px] text-[#4b5563] tabular-nums select-none whitespace-nowrap -translate-x-1/2 block leading-tight">
                  {formatTime(frac * duration)}
                </span>
                <div className="w-px h-[5px] bg-[#374151]" />
              </div>
            );
          })}
          {Array.from(
            { length: (MAJOR_TICKS - 1) * MINOR_PER_SEGMENT + 1 },
            (_, i) => {
              if (i % MINOR_PER_SEGMENT === 0) return null;
              const frac = i / ((MAJOR_TICKS - 1) * MINOR_PER_SEGMENT);
              return (
                <div
                  key={`m${i}`}
                  className="absolute bottom-0 w-px h-[3px] bg-[#2d3748]"
                  style={{ left: `${frac * 100}%` }}
                />
              );
            },
          )}
        </div>

        {/* Seekbar */}
        <div
          ref={seekBarRef}
          onClick={handleSeekClick}
          onContextMenu={handleSeekContext}
          onMouseMove={(e) => showEdit && setHoverFrac(getFrac(e.clientX))}
          onMouseLeave={() => setHoverFrac(null)}
          className="relative h-[6px] bg-[#1f2937] rounded-[3px] cursor-crosshair select-none"
        >
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#4f46e5] to-[#6366f1] rounded-[3px] pointer-events-none"
            style={{ width: `${playPct}%` }}
          />

          {showEdit && inPct != null && outPct != null && rangePct > 0 && (
            <div
              className="absolute inset-y-0 bg-blue-500/25 border-x border-blue-500 pointer-events-none"
              style={{ left: `${inPct}%`, width: `${rangePct}%` }}
            />
          )}

          {/* IN marker */}
          {showEdit && inPct != null && (
            <div
              className="absolute -translate-x-1/2 flex flex-col items-center cursor-pointer z-10"
              style={{ left: `${inPct}%`, top: "calc(100% + 3px)" }}
              onClick={(e) => {
                e.stopPropagation();
                if (videoRef.current) videoRef.current.currentTime = inPoint;
                setCurrentTime(inPoint);
                setActiveMarker("in");
              }}
            >
              <div
                className={`w-0 h-0 border-l-[5px] border-r-[5px] border-b-[7px] border-l-transparent border-r-transparent transition-colors ${activeMarker === "in" ? "border-b-white" : "border-b-blue-400"}`}
              />
              <span
                className={`text-[8px] font-bold uppercase tracking-wider leading-tight mt-[2px] transition-colors ${activeMarker === "in" ? "text-white" : "text-blue-400"}`}
              >
                IN
              </span>
              <span
                className={`text-[9px] font-mono font-semibold whitespace-nowrap leading-tight mt-[1px] transition-colors ${activeMarker === "in" ? "text-white" : "text-blue-300"}`}
              >
                {formatTime(inPoint)}
              </span>
            </div>
          )}

          {/* OUT marker */}
          {showEdit && outPct != null && (
            <div
              className="absolute -translate-x-1/2 flex flex-col items-center cursor-pointer z-10"
              style={{ left: `${outPct}%`, top: "calc(100% + 3px)" }}
              onClick={(e) => {
                e.stopPropagation();
                if (videoRef.current) videoRef.current.currentTime = outPoint;
                setCurrentTime(outPoint);
                setActiveMarker("out");
              }}
            >
              <div
                className={`w-0 h-0 border-l-[5px] border-r-[5px] border-b-[7px] border-l-transparent border-r-transparent transition-colors ${activeMarker === "out" ? "border-b-white" : "border-b-blue-400"}`}
              />
              <span
                className={`text-[8px] font-bold uppercase tracking-wider leading-tight mt-[2px] transition-colors ${activeMarker === "out" ? "text-white" : "text-blue-400"}`}
              >
                OUT
              </span>
              <span
                className={`text-[9px] font-mono font-semibold whitespace-nowrap leading-tight mt-[1px] transition-colors ${activeMarker === "out" ? "text-white" : "text-blue-300"}`}
              >
                {formatTime(outPoint)}
              </span>
            </div>
          )}

          {/* Hover tooltip */}
          {hoverFrac != null && (
            <div
              className="absolute -top-7 -translate-x-1/2 pointer-events-none bg-[#1f2937] text-white text-[10px] font-mono px-[6px] py-[2px] rounded whitespace-nowrap z-20 flex items-center gap-[6px]"
              style={{ left: `${hoverFrac * 100}%` }}
            >
              {formatTime(hoverFrac * duration)}
              {showEdit && (
                <span className="text-[#6b7280]">
                  <span className="text-blue-400">I</span> in ·{" "}
                  <span className="text-blue-400">O</span> out
                </span>
              )}
            </div>
          )}

          {/* Playhead */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[12px] h-[12px] rounded-full bg-white shadow cursor-grab z-10"
            style={{ left: `${playPct}%` }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragging(true);
            }}
          />
        </div>
      </div>

      <Toast toast={toast} onClose={hideToast} />

      {/* ── Inline Save Form (Enter key when IN+OUT set) ── */}
      {showForm && (
        <div className="border-t border-[#1f2937] flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-3 pt-2 pb-1">
            <h3 className="text-white font-semibold text-[13px] tracking-[-0.2px]">
              Save Clip
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-[#6b7280] hover:text-white w-5 h-5 flex items-center justify-center rounded hover:bg-white/[0.08] transition-colors text-xs"
            >
              ✕
            </button>
          </div>
          <LocalClipForm
            initialName={clip.output_name ? clip.output_name : ""}
            initialTags={clip.tags || []}
            inPoint={inPoint}
            outPoint={outPoint}
            loading={mp4Loading}
            onCancel={() => setShowForm(false)}
            onSave={async ({ clipName, selectedTags }) => {
              const result = await dispatch(
                saveMp4ClipThunk({
                  job_id: clip.id,
                  match_id: matchId || clip.match_id,
                  tags: selectedTags,
                  start_time: Math.floor(inPoint ?? 0),
                  end_time: Math.floor(outPoint ?? 0),
                  output_name: clipName,
                  logo_path: clip.logo_path || "",
                }),
              );
              setShowForm(false);
              const payload = result?.payload;
              if (payload) {
                showToast({
                  message: payload.msg || "Clip saved successfully",
                  type: payload.status === "success" ? "success" : "error",
                });
                if (payload.status === "success") {
                  setTimeout(onClose, 1800);
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ── Local ClipForm (prefilled, no Redux) ── */
function LocalClipForm({
  initialName,
  initialTags,
  inPoint,
  outPoint,
  onCancel,
  onSave,
  loading,
}) {
  const [clipName, setClipName] = useState(initialName);
  const [selectedTags, setSelectedTags] = useState([...initialTags]);

  const toggleLocalTag = (label) => {
    setSelectedTags((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label],
    );
  };

  return (
    <div className="px-3 pt-2 pb-0 flex flex-col gap-[7px] min-h-0 flex-1 overflow-y-auto">
      {/* Clip Name */}
      <div>
        <label className="block text-[9px] font-bold text-[#6b7280] uppercase tracking-widest mb-[4px]">
          Clip Name
        </label>
        <input
          value={clipName}
          onChange={(e) => setClipName(e.target.value)}
          className="w-full bg-[#0d1117] border border-[#2d3748] rounded-[6px] text-[#d1d5db] text-[11px] py-[5px] px-2.5 outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Tags — inline category labels to save vertical space */}
      <div className="flex flex-col gap-[5px] @lg:gap-[6px] @2xl:gap-[8px]">
        {CATEGORIES.map((cat) => {
          const tags = CRICKET_TAGS.filter((t) => t.category === cat);
          if (!tags.length) return null;
          const styles = TAG_CATEGORY_STYLES[cat];
          return (
            <div key={cat} className="flex items-start gap-[6px] @lg:gap-[8px] @2xl:gap-[10px]">
              <span className="text-[8px] @lg:text-[9px] @2xl:text-[10px] font-bold text-[#4b5563] uppercase tracking-wider min-w-[42px] @lg:min-w-[48px] @2xl:min-w-[54px] pt-[3px] shrink-0 leading-tight">
                {CATEGORY_LABELS[cat]}
              </span>
              <div className="flex flex-wrap gap-[4px] @lg:gap-[5px] @2xl:gap-[7px] flex-1">
                {tags.map(({ label }) => {
                  const isSelected = selectedTags.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleLocalTag(label)}
                      className={[
                        "px-[7px] py-[2px] @lg:px-[8px] @lg:py-[3px] @2xl:px-[10px] @2xl:py-[4px] rounded-full text-[9px] @lg:text-[10px] @2xl:text-[11px] font-semibold border transition-all duration-150 cursor-pointer whitespace-nowrap",
                        isSelected
                          ? styles.active
                          : `bg-transparent ${styles.base} hover:opacity-90`,
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom row */}
      <div className="border-t border-[#1f2937] py-[7px] flex items-center justify-between gap-2 mt-auto sticky bottom-0 bg-[#111318]">
        <div className="flex items-center gap-[5px] text-[10px]">
          <span className="text-[#4b5563] flex items-center gap-[3px]">
            <svg
              width="9"
              height="9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            Range
          </span>
          <span className="text-blue-300 font-semibold tabular-nums">
            {formatTime(inPoint ?? 0)} → {formatTime(outPoint ?? 0)}
          </span>
        </div>
        <div className="flex items-center gap-[6px]">
          <button
            type="button"
            onClick={onCancel}
            className="bg-transparent border border-[#374151] text-[#9ca3af] hover:text-white hover:border-[#6b7280] rounded-[6px] py-[5px] px-3 text-[10px] font-semibold cursor-pointer transition-all duration-150"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave({ clipName, selectedTags })}
            disabled={loading || selectedTags.length === 0}
            title={selectedTags.length === 0 ? 'Select at least one tag' : undefined}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed text-white border-none rounded-[6px] py-[5px] px-4 text-[10px] font-bold cursor-pointer tracking-[0.3px] shadow-[0_4px_14px_rgba(16,185,129,0.3)] transition-all duration-150"
          >
            {loading ? "Saving…" : "Save Clip"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Icon helpers ── */
function ActionBtn({ children, title, onClick, active = false }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={[
        "bg-transparent border-none cursor-pointer w-5 h-5 @lg:w-[26px] @lg:h-[26px] @2xl:w-8 @2xl:h-8 rounded-md flex items-center justify-center transition-all duration-150 hover:bg-white/[0.08] hover:text-white",
        active ? "bg-white/[0.1] text-white" : "text-[#9ca3af]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

const MuteIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const MutedIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <line x1="23" y1="9" x2="17" y2="15" />
    <line x1="17" y1="9" x2="23" y2="15" />
  </svg>
);
