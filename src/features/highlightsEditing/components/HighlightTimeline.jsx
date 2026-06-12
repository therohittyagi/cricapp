import { useRef } from "react";
import HighlightTimelineClip from "./HighlightTimelineClip";
import { formatTime } from "../../../shared/utils/formatTime/timeFormat";

const generateTicks = (totalDuration) => {
  // Pick a sensible tick interval based on duration
  const interval = totalDuration <= 120 ? 10 : totalDuration <= 600 ? 30 : 60;
  const ticks = [];
  for (let s = 0; s <= totalDuration; s += interval) ticks.push(s);
  return ticks;
};

export default function HighlightTimeline({
  tracks,
  playhead,
  totalDuration,
  selectedTimelineClip,
  onSeek,
  onClipSelect,
  onTrackDrop,
  onClipMove,
  onClipTrim,
}) {
  const rulerRef = useRef(null);
  // Reference to any track area element — all tracks share the same width
  const trackAreaRef = useRef(null);

  const ticks = generateTicks(totalDuration);
  const playheadPct = `${(playhead / totalDuration) * 100}%`;

  // Convert a pixel delta to a seconds delta using the track width
  const pxToTime = (deltaPx) => {
    const el = trackAreaRef.current;
    if (!el) return 0;
    return (deltaPx / el.getBoundingClientRect().width) * totalDuration;
  };

  // ── ruler click → seek ────────────────────────────────────────────────────

  const handleRulerClick = (e) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(ratio * totalDuration);
  };

  // ── drag-to-move: called by HighlightTimelineClip onMoveStart ─────────────

  const handleMoveStart = (e, clip) => {
    e.preventDefault();
    const startX = e.clientX;
    const origStart = clip.startTime;

    const onMouseMove = (me) => {
      const deltaT = pxToTime(me.clientX - startX);
      onClipMove(clip.instanceId, origStart + deltaT);
    };

    const cleanup = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", cleanup);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", cleanup);
  };

  // ── trim handles: called by HighlightTimelineClip onTrimStart ────────────

  const handleTrimStart = (e, clip, side) => {
    e.preventDefault();
    const startX = e.clientX;
    const origStart = clip.startTime;
    const origDuration = clip.duration;

    const onMouseMove = (me) => {
      const deltaT = pxToTime(me.clientX - startX);
      if (side === "right") {
        // Right handle: extend/shrink duration
        onClipTrim(clip.instanceId, origStart, origDuration + deltaT);
      } else {
        // Left handle: move start, shrink/extend duration inversely
        onClipTrim(clip.instanceId, origStart + deltaT, origDuration - deltaT);
      }
    };

    const cleanup = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", cleanup);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", cleanup);
  };

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="bg-[#0f1117] border-t border-slate-800 shrink-0" style={{ height: 180 }}>
      {/* Time ruler */}
      <div
        ref={rulerRef}
        className="relative h-7 bg-[#13151e] border-b border-slate-800 cursor-pointer select-none"
        onClick={handleRulerClick}
      >
        {/* Left label offset for the track-label column */}
        <div className="absolute left-12 right-0 top-0 bottom-0 overflow-hidden">
          {ticks.map((t) => (
            <div
              key={t}
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `${(t / totalDuration) * 100}%` }}
            >
              <div className="w-px h-2 bg-slate-600" />
              <span className="text-[9px] text-slate-500 mt-0.5 -translate-x-1/2 whitespace-nowrap">
                {formatTime(t)}
              </span>
            </div>
          ))}

          {/* Playhead needle on ruler */}
          <div
            className="absolute top-0 bottom-0 w-px bg-blue-400 pointer-events-none z-10"
            style={{ left: playheadPct }}
          >
            <div className="w-2.5 h-2.5 bg-blue-400 rounded-full -translate-x-[4px] -translate-y-0.5" />
          </div>
        </div>
      </div>

      {/* Tracks */}
      {[
        { key: "video", label: "Video", color: "bg-blue-600/70" },
        { key: "logo", label: "Logo", color: "bg-violet-600/70" },
      ].map(({ key, label, color }, trackIdx) => (
        <div key={key} className="flex h-[72px] border-b border-slate-800">
          {/* Track label */}
          <div className="w-12 flex flex-col items-center justify-center shrink-0 border-r border-slate-800 gap-0.5">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-[10px] text-slate-500">{label}</span>
          </div>

          {/* Drop zone */}
          <div
            ref={trackIdx === 0 ? trackAreaRef : null}
            className="relative flex-1 overflow-hidden bg-[#0f1117] hover:bg-slate-900/30 transition-colors"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onTrackDrop(e, key)}
          >
            {/* Subtle lane stripe */}
            <div className="absolute inset-y-2 left-0 right-0 border border-slate-800/50 rounded" />

            {tracks[key].map((clip) => (
              <HighlightTimelineClip
                key={clip.instanceId}
                clip={clip}
                trackType={key}
                totalDuration={totalDuration}
                selected={selectedTimelineClip === clip.instanceId}
                onClick={onClipSelect}
                onMoveStart={handleMoveStart}
                onTrimStart={handleTrimStart}
              />
            ))}

            {/* Playhead line across track */}
            <div
              className="absolute top-0 bottom-0 w-px bg-blue-400/70 pointer-events-none z-20"
              style={{ left: playheadPct }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
