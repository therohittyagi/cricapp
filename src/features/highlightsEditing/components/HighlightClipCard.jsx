import React from "react";
import { formatTime } from "../../../shared/utils/formatTime/timeFormat";

const HighlightClipCard = ({ clip, selected, onClick, onDragStart }) => {
  
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, clip)}
      onClick={() => onClick(clip)}
      className={`cursor-pointer rounded overflow-hidden border transition-all ${
        selected
          ? "border-blue-500"
          : "border-transparent hover:border-slate-600"
      }`}
    >
      <div className="relative bg-slate-700 w-full h-16">
        {clip.thumbnail ? (
          <img
            src={clip.thumbnail}
            alt={clip.title}
            className="w-full h-16 object-cover"
          />
        ) : (
          <div className="w-full h-16 flex items-center justify-center text-slate-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
            </svg>
          </div>
        )}
        <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 rounded">
          {formatTime(clip.duration)}
        </span>
        {clip.tag && (
          <span className="absolute top-1 left-1 bg-blue-600/80 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            {clip.tag}
          </span>
        )}
      </div>
      <div className="px-1 py-1 bg-slate-800">
        <p className="text-[10px] text-slate-300 leading-tight truncate">
          {clip.title}
        </p>
        <p className="text-[10px] text-slate-500">{clip.date}</p>
      </div>
    </div>
  );
};

export default HighlightClipCard;
