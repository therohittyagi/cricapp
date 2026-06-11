import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectClips,
  selectClipsTotal,
  selectMatchId,
  selectLoading,
  selectSaveCounter,
} from "../videoSlice";
import { fetchClipsListThunk } from "../videoThunk";
import ClipCard from "./ClipCard";
import MiniPlayer from "./MiniPlayer";

export default function ClipsList() {
  const dispatch     = useDispatch();
  const clips        = useSelector(selectClips);
  const total        = useSelector(selectClipsTotal);
  const matchId      = useSelector(selectMatchId);
  const loading      = useSelector(selectLoading);
  const saveCounter  = useSelector(selectSaveCounter);

  const [activeClip, setActiveClip] = useState(null);

  // Fetch on mount + after every successful save + poll every 10s
  useEffect(() => {
    if (!matchId) return;
    dispatch(fetchClipsListThunk(matchId));
    const id = setInterval(() => dispatch(fetchClipsListThunk(matchId)), 10_000);
    return () => clearInterval(id);
  }, [matchId, saveCounter, dispatch]);

  return (
    <div className="w-[30%] shrink-0 bg-[#111318] flex flex-col overflow-hidden rounded-[10px] mr-8 mb-4">
      {/* Header */}
      <div className="px-[18px] pt-4 pb-3 border-b border-[#1f2937] flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#f9fafb] tracking-[-0.3px]">
          Clips List{" "}
          <span className="text-[#6b7280] font-normal">({total})</span>
        </h2>

        {/* Refresh button */}
        <button
          type="button"
          onClick={() => matchId && dispatch(fetchClipsListThunk(matchId))}
          disabled={loading}
          title="Refresh"
          className="w-7 h-7 flex items-center justify-center rounded-md text-[#6b7280] hover:text-white hover:bg-white/[0.08] transition-colors disabled:opacity-40"
        >
          <RefreshIcon spinning={loading} />
        </button>
      </div>

      {/* Mini player */}
      {activeClip && (
        <MiniPlayer clip={activeClip} onClose={() => setActiveClip(null)} />
      )}

      {/* Clips */}
      <div className="flex-1 overflow-y-auto">
        {loading && clips.length === 0 ? (
          <div className="py-10 px-5 flex flex-col items-center gap-3 text-[#374151]">
            <RefreshIcon spinning />
            <span className="text-sm">Loading clips…</span>
          </div>
        ) : clips.length === 0 ? (
          <div className="py-10 px-5 text-center text-[#374151] text-sm">
            No clips yet
          </div>
        ) : (
          clips.map((clip) => (
            <ClipCard
              key={clip.id}
              clip={clip}
              isActive={activeClip?.id === clip.id}
              onSelect={() => setActiveClip(activeClip?.id === clip.id ? null : clip)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function RefreshIcon({ spinning }) {
  return (
    <svg
      width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      style={spinning ? { animation: "spin 1s linear infinite" } : {}}
    >
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <polyline points="23,4 23,10 17,10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}
