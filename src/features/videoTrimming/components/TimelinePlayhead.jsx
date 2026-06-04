export default function TimelinePlayhead({ percent, onMouseDown }) {
  return (
    <div
      onMouseDown={onMouseDown}
      title="Drag to seek"
      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full bg-red-500 border-2 border-white cursor-grab z-10 shadow-[0_0_8px_rgba(239,68,68,0.7)] shrink-0"
      style={{ left: `${percent}%` }}
    />
  );
}
