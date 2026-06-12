import { formatTime } from "../../../shared/utils/formatTime/timeFormat";


export default function HighlightsPanel({
  highlights,
  selectedTimelineClip,
  onAddHighlight,
  onRemoveHighlight,
}) {
  return (
    <div className="w-[25%] border-l border-slate-800 flex flex-col bg-[#13151e]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-800">
        <span className="text-sm font-semibold text-white">Highlights</span>
        {selectedTimelineClip && (
          <button
            onClick={onAddHighlight}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            + Add
          </button>
        )}
      </div>

      {/* Empty state */}
      {highlights.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center px-4">
          <svg
            className="w-10 h-10 text-slate-700"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0
              5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243zm0 0L9.879
              17M21 3l-6 6m-6 6L3 21" />
          </svg>
          <p className="text-slate-500 text-xs">No highlights yet</p>
          <p className="text-slate-600 text-[11px]">
            Select a timeline clip and click + Add
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-0">
          {highlights.map((h, i) => (
            <div
              key={h.highlightId}
              className="bg-slate-800 rounded p-2 flex items-center gap-2"
            >
              <span className="w-5 h-5 bg-blue-600 rounded-full text-[10px] flex items-center justify-center font-bold shrink-0">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="text-xs text-slate-200 truncate">{h.label}</p>
                <p className="text-[10px] text-slate-500">{formatTime(h.duration)}</p>
              </div>
              <button
                onClick={() => onRemoveHighlight(h.highlightId)}
                className="ml-auto text-slate-600 hover:text-red-400 transition-colors shrink-0"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}