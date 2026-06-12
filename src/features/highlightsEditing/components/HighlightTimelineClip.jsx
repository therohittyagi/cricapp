export default function HighlightTimelineClip({
  clip,
  trackType,
  totalDuration,
  selected,
  onClick,
  onMoveStart,
  onTrimStart,
}) {
  const left = (clip.startTime / totalDuration) * 100;
  const width = Math.max((clip.duration / totalDuration) * 100, 0.5);

  const baseColor =
    trackType === "logo"
      ? selected
        ? "bg-violet-500"
        : "bg-violet-600/80 hover:bg-violet-500/80"
      : selected
      ? "bg-blue-500"
      : "bg-blue-700/80 hover:bg-blue-600/80";

  return (
    <div
      className={`absolute top-2 bottom-2 rounded flex items-center select-none
        cursor-grab active:cursor-grabbing transition-colors
        ${baseColor}
        ${selected ? "ring-1 ring-white/40 shadow-lg" : ""}
      `}
      style={{ left: `${left}%`, width: `${width}%`, minWidth: 36 }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(clip.instanceId);
      }}
      onMouseDown={(e) => {
        // Only move if clicking the body (not a handle)
        if (e.target.dataset.handle) return;
        onMoveStart(e, clip);
      }}
    >
      {/* Left trim handle */}
      <div
        data-handle="left"
        className="absolute left-0 top-0 bottom-0 w-2 rounded-l cursor-ew-resize
          bg-white/10 hover:bg-white/30 transition-colors flex items-center justify-center shrink-0"
        onMouseDown={(e) => {
          e.stopPropagation();
          onTrimStart(e, clip, "left");
        }}
      >
        <div className="w-px h-3 bg-white/50 rounded-full" />
      </div>

      {/* Label */}
      <span className="flex-1 truncate text-[10px] text-white font-medium px-3 pointer-events-none">
        {clip.label || clip.tag || "Clip"}
      </span>

      {/* Right trim handle */}
      <div
        data-handle="right"
        className="absolute right-0 top-0 bottom-0 w-2 rounded-r cursor-ew-resize
          bg-white/10 hover:bg-white/30 transition-colors flex items-center justify-center shrink-0"
        onMouseDown={(e) => {
          e.stopPropagation();
          onTrimStart(e, clip, "right");
        }}
      >
        <div className="w-px h-3 bg-white/50 rounded-full" />
      </div>
    </div>
  );
}
