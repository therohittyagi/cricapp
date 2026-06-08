import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectClips, selectFilterTag, setFilterTag } from "../videoSlice";
import { filterClips } from "../services/clipService";
import ClipCard from "./ClipCard";
import MiniPlayer from "./MiniPlayer";

const ChevronIcon = () => (
  <svg
    width="9"
    height="9"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

export default function ClipsList() {
  const dispatch = useDispatch();
  const clips = useSelector(selectClips);
  const filterTag = useSelector(selectFilterTag);

  const [filterOpen, setFilterOpen] = useState(false);
  const [activeClip, setActiveClip] = useState(null);

  /** 🔹 Build unique tag list from clips */
  const tagOptions = useMemo(() => {
    const set = new Set();
    clips.forEach((c) => {
      if (Array.isArray(c.tags)) {
        c.tags.forEach((t) => set.add(t));
      } else if (c.tag) {
        set.add(c.tag);
      }
    });
    return Array.from(set);
  }, [clips]);

  const filtered = filterClips(clips, filterTag);

  return (
    <div className="w-[20%] shrink-0 bg-[#111318] flex flex-col overflow-hidden rounded-[10px]">
      {/* Header */}
      <div className="px-[18px] pt-4 pb-3 border-b border-[#1f2937] flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#f9fafb] tracking-[-0.3px]">
          Clips List{" "}
          <span className="text-[#6b7280] font-normal">({clips.length})</span>
        </h2>

        {/* Filter dropdown */}
        <div className="relative">
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className="bg-[#1f2937] border border-[#374151] rounded-md text-[#9ca3af] text-sm font-semibold py-1 px-[10px] flex items-center gap-1"
          >
            {filterTag === "all" ? "All tags" : filterTag}
            <ChevronIcon />
          </button>

          {filterOpen && (
            <div className="absolute top-[calc(100%+4px)] right-0 z-[100] bg-[#1a1f2e] border border-[#2d3748] rounded-lg overflow-hidden min-w-[120px] shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
              {/* All */}
              <div
                onClick={() => {
                  dispatch(setFilterTag("all"));
                  setFilterOpen(false);
                }}
                className={`py-2 px-3 cursor-pointer hover:bg-white/[0.06] ${
                  filterTag === "all" ? "bg-indigo-500/15" : ""
                }`}
              >
                <span className="text-xs text-[#9ca3af]">All tags</span>
              </div>

              {/* Dynamic tags */}
              {tagOptions.map((tag) => (
                <div
                  key={tag}
                  onClick={() => {
                    dispatch(setFilterTag(tag));
                    setFilterOpen(false);
                  }}
                  className={`py-2 px-3 cursor-pointer hover:bg-white/[0.06] ${
                    filterTag === tag ? "bg-indigo-500/15" : ""
                  }`}
                >
                  <span className="text-xs font-semibold text-[#e5e7eb]">
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mini player */}
      {activeClip && (
        <MiniPlayer clip={activeClip} onClose={() => setActiveClip(null)} />
      )}

      {/* Clips */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-10 px-5 text-center text-[#374151] text-sm">
            No clips
            {filterTag !== "all" ? ` tagged "${filterTag}"` : ""}
          </div>
        ) : (
          filtered.map((clip) => (
            <ClipCard
              key={clip.id}
              clip={clip}
              isActive={activeClip?.id === clip.id}
              onSelect={() =>
                setActiveClip(activeClip?.id === clip.id ? null : clip)
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
