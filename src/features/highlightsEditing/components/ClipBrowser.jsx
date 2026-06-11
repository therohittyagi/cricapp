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
    <div className="w-[25%]"> 
      <div className="flex items-center gap-6 px-6 py-2 border-b border-slate-800 bg-[#13151e] shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`text-sm font-medium pb-1 transition-colors relative ${
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
      <div className="w-full border-r border-slate-800 flex flex-col bg-[#13151e] shrink-0">
        {/* Filter tags */}
        <div className="flex flex-wrap gap-1.5 p-2 border-b border-slate-800">
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
        <div className="flex-1 overflow-y-auto p-2 w-full">
          <div className="grid grid-cols-2 gap-1.5">
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
      className={`px-2 py-0.5 rounded-full text-[11px] font-medium border transition-colors ${
        active
          ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
          : "bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200"
      }`}
    >
      {label}
    </button>
  );
}

export default ClipBrowser;
