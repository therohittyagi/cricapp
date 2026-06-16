import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectClips,
  selectClipsTotal,
  selectMatchId,
  selectLoading,
  selectSaveCounter,
  selectMp4ClipSaveCounter,
} from "../videoSlice";
import { fetchClipsListThunk } from "../videoThunk";
import ClipCard from "./ClipCard";

const PENDING_STATUSES = new Set(['pending', 'processing']);

export default function ClipsList({ activeClip, setActiveClip, className = 'flex-[7]' }) {
  const dispatch    = useDispatch();
  const clips       = useSelector(selectClips);
  const total       = useSelector(selectClipsTotal);
  const matchId     = useSelector(selectMatchId);
  const loading     = useSelector(selectLoading);
  const saveCounter     = useSelector(selectSaveCounter);
  const mp4SaveCounter  = useSelector(selectMp4ClipSaveCounter);

  const [filterTags,  setFilterTags]  = useState(new Set());

  const hasPendingClips = useMemo(() =>
    clips.some(c => PENDING_STATUSES.has(c.status?.toLowerCase())),
    [clips]
  );

  // Immediate fetch when a clip is saved
  useEffect(() => {
    if (!matchId) return;
    dispatch(fetchClipsListThunk(matchId));
  }, [matchId, saveCounter, mp4SaveCounter, dispatch]);

  // Smart polling: 3s while any clip is pending/processing, 10s otherwise.
  // When hasPendingClips flips false (status → success), the interval restarts
  // and triggers an immediate refresh so the grid and ClipPlayer update right away.
  useEffect(() => {
    if (!matchId) return;
    const interval = hasPendingClips ? 3_000 : 10_000;
    const id = setInterval(() => dispatch(fetchClipsListThunk(matchId)), interval);
    return () => clearInterval(id);
  }, [matchId, hasPendingClips, dispatch]);

  // Keep activeClip in sync with fresh list data after re-fetch
  useEffect(() => {
    if (!activeClip) return;
    const fresh = clips.find((c) => c.id === activeClip.id);
    if (fresh) setActiveClip(fresh);
  }, [clips]);

  const allTags = useMemo(() => {
    const set = new Set();
    clips.forEach((c) => c.tags?.forEach((t) => set.add(t)));
    return [...set];
  }, [clips]);

  const filteredClips = useMemo(() =>
    filterTags.size === 0
      ? clips
      : clips.filter((c) => c.tags?.some((t) => filterTags.has(t))),
    [clips, filterTags]
  );

  const toggleFilter = (tag) => {
    setFilterTags((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  };

  return (
    <div className={`${className} min-w-0 flex flex-col overflow-hidden bg-[#111318] rounded-[20px] @container`}>

      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-[#1f2937] flex items-center justify-between shrink-0">
        <h2 className="text-[14px] font-semibold text-[#f9fafb] tracking-[-0.3px]">
          Clips
          <span className="text-[#6b7280] font-normal ml-1">({total})</span>
        </h2>
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

      {/* Filter tag bar */}
      {allTags.length > 0 && (
        <div className="px-4 py-2 border-b border-[#1f2937] flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {filterTags.size > 0 && (
            <button
              onClick={() => setFilterTags(new Set())}
              className="text-[10px] text-[#6b7280] hover:text-white whitespace-nowrap shrink-0 transition-colors"
            >
              Clear
            </button>
          )}
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleFilter(tag)}
              className={[
                "px-[10px] py-[4px] rounded-full text-[10px] font-semibold border whitespace-nowrap shrink-0 cursor-pointer transition-all duration-150",
                filterTags.has(tag)
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-transparent border-[#374151] text-[#9ca3af] hover:border-[#6b7280] hover:text-white",
              ].join(" ")}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading && clips.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-[#374151]">
            <RefreshIcon spinning />
            <span className="text-sm">Loading clips…</span>
          </div>
        ) : filteredClips.length === 0 ? (
          <div className="py-16 text-center text-[#374151] text-sm">
            {clips.length === 0 ? "No clips yet" : "No clips match the selected filters"}
          </div>
        ) : (
          <div className="grid grid-cols-2 @md:grid-cols-3 @3xl:grid-cols-4 @4xl:grid-cols-5 gap-x-4 gap-y-6">
            {filteredClips.map((clip) => (
              <ClipCard
                key={clip.id}
                clip={clip}
                isActive={activeClip?.id === clip.id}
                onSelect={() => setActiveClip(activeClip?.id === clip.id ? null : clip)}
              />
            ))}
          </div>
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
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <polyline points="23,4 23,10 17,10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  );
}
