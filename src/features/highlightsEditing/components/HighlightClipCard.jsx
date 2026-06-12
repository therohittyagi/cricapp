import React from "react";
import { formatTime } from "../../../shared/utils/formatTime/timeFormat";

const HighlightClipCard = ({ clip, selected, onClick, onDragStart }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, clip)}
      onClick={() => onClick(clip)}
      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
        selected ? "border-blue-500" : "border-transparent"
      }`}
    >
      <div className="relative bg-slate-800 w-full aspect-video">
        {clip.thumbnail ? (
          <img
            src={clip.thumbnail}
            alt={clip.title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
            </svg>
          </div>
        )}
        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
          {formatTime(clip.duration)}
        </span>
      </div>
      <div className="px-1.5 py-1.5">
        <p className="text-xs text-white font-medium leading-snug line-clamp-2">
          {clip.title}
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5 truncate">{clip.date}</p>
      </div>
    </div>
  );
};

export default HighlightClipCard;
