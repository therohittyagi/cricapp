import { formatTime } from "../../../shared/utils/formatTime/timeFormat";

export default function PlaybackControls({
  isPlaying,
  playhead,
  totalDuration,
  selectedTimelineClip,
  onPlayPause,
  onRewind,
  onSkipBackward,
  onSkipForward,
  onAddClip,
  onDelete,
  onSplit,
  onDuplicate,
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[#13151e] border-t border-slate-800 shrink-0">
      {/* Transport buttons */}
      <div className="flex items-center gap-1">
        {/* Rewind to start */}
        <button
          onClick={onRewind}
          className="p-1.5 text-slate-400 hover:text-white transition-colors"
          title="Rewind to start"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
          </svg>
        </button>

        {/* Skip backward 5s */}
        <button
          onClick={onSkipBackward}
          className="p-1.5 text-slate-400 hover:text-white transition-colors"
          title="Back 5s"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ transform: "scale(-1,1)" }}>
            <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
          </svg>
        </button>

        {/* Play / Pause */}
        <button
          onClick={onPlayPause}
          className="p-1.5 text-white hover:text-blue-400 transition-colors"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        {/* Skip forward 5s */}
        <button
          onClick={onSkipForward}
          className="p-1.5 text-slate-400 hover:text-white transition-colors"
          title="Forward 5s"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
          </svg>
        </button>

        {/* Fast forward (skip to end placeholder) */}
        <button
          onClick={() => onSkipForward?.()}
          className="p-1.5 text-slate-400 hover:text-white transition-colors"
          title="Fast forward"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
          </svg>
        </button>
      </div>

      {/* Add / Delete clip buttons */}
      <button
        onClick={onAddClip}
        className="px-3 py-1.5 bg-slate-200 text-slate-900 text-sm font-semibold rounded hover:bg-white transition-colors"
      >
        Add Clip
      </button>
      <button
        onClick={onDelete}
        disabled={!selectedTimelineClip}
        className="px-3 py-1.5 bg-slate-700 text-white text-sm font-semibold rounded hover:bg-slate-600 disabled:opacity-40 transition-colors"
      >
        Delete
      </button>

      {/* Time display */}
      <div className="flex-1 flex items-center justify-center gap-2 text-sm font-mono">
        <span className="text-white">{formatTime(playhead)}</span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400">{formatTime(totalDuration)}</span>
      </div>

      {/* Right-side edit actions */}
      <div className="flex items-center gap-1 text-slate-400">
        <button
          onClick={onSplit}
          disabled={!selectedTimelineClip}
          className="px-2 py-1 hover:text-white disabled:opacity-40 text-xs font-medium hover:bg-slate-800 rounded transition-colors"
          title="Split at playhead"
        >
          Split
        </button>
        <button
          onClick={onDuplicate}
          disabled={!selectedTimelineClip}
          className="px-2 py-1 hover:text-white disabled:opacity-40 text-xs font-medium hover:bg-slate-800 rounded transition-colors"
          title="Duplicate clip"
        >
          Duplicate
        </button>
        <button
          onClick={onDelete}
          disabled={!selectedTimelineClip}
          className="p-1.5 hover:text-red-400 disabled:opacity-40 transition-colors"
          title="Delete clip"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
