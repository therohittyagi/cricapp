import React from "react";
import HighlightClipCard from "./HighlightClipCard";

const ClipBrowser = ({
  activeTab,
  onTabChange,
  clips,
  activeFilter,
  selectedClip,
  onFilterChange,
  onClipSelect,
  onDragStart,
}) => {
  const TABS = ["Events", "Clips", "Browse"];
  const filteredClips =
    activeFilter === "All"
      ? clips
      : clips.filter((c) =>
          Array.isArray(c.tags) ? c.tags.includes(activeFilter) : c.tag === activeFilter
        );

  const FILTER_TAGS = ["All", "Four", "Six", "Wicket", "No Ball", "Wide"];
  return (
    <div className="w-[25%] flex flex-col border-r border-slate-800 bg-[#13151e]">
      {/* Tabs */}
      <div className="flex items-center justify-center gap-8 px-6 py-3 border-b border-slate-800 shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`text-sm font-semibold pb-1.5 transition-colors relative ${
              activeTab === tab
                ? "text-white"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="w-full flex flex-col flex-1 min-h-0">
        {/* Filter tags */}
        <div className="flex gap-2 px-3 py-2.5 border-b border-slate-800 overflow-x-auto scrollbar-none shrink-0">
          {FILTER_TAGS.map((tag) => (
            <FilterTag
              key={tag}
              label={tag}
              active={activeFilter === tag}
              onClick={() => onFilterChange(tag)}
            />
          ))}
        </div>

        {/* Clip grid */}
        <div className="flex-1 overflow-y-auto px-2 pt-2 pb-2 w-full min-h-0">
          <div className="grid grid-cols-2 gap-2">
            {filteredClips.map((clip) => (
              <HighlightClipCard
                key={clip.id}
                clip={clip}
                selected={selectedClip?.id === clip.id}
                onClick={onClipSelect}
                onDragStart={onDragStart}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function FilterTag({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap transition-colors shrink-0 ${
        active
          ? "text-blue-400 border-blue-400/60 bg-blue-500/10"
          : "bg-[#1e2130] text-slate-300 border-slate-700 hover:text-white hover:border-slate-500"
      }`}
    >
      {label}
    </button>
  );
}

export default ClipBrowser;
