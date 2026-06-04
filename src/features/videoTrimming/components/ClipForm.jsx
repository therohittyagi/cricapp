import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setClipName, setSelectedTag,
  selectClipName, selectSelectedTag, selectInPoint, selectOutPoint, selectDuration,
} from '../videoSlice';
import { TAG_OPTIONS, TAG_COLORS } from '../../../shared/constants/tags';
import { formatTime } from '../../../shared/utils/formatTime/timeFormat';

const ChevronIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

export default function ClipForm() {
  const dispatch    = useDispatch();
  const clipName    = useSelector(selectClipName);
  const selectedTag = useSelector(selectSelectedTag);
  const inPoint     = useSelector(selectInPoint);
  const outPoint    = useSelector(selectOutPoint);
  const duration    = useSelector(selectDuration);

  const [tagOpen, setTagOpen] = useState(false);

  const inputCls = "w-full bg-[#1a1f2e] border border-[#2d3748] rounded-[7px] text-[#d1d5db] text-xs py-[7px] px-[9px] outline-none transition-colors duration-150 focus:border-indigo-500 font-inherit";

  return (
    <div className="py-[13px] px-[18px] border-b border-[#1f2937]">

      <div className="flex gap-2 mb-[10px]">

        {/* Clip name */}
        <div className="flex-1 min-w-0">
          <label className="block text-[10px] font-semibold text-[#6b7280] mb-1 tracking-[0.5px] uppercase">
            Clip Name
          </label>
          <input
            value={clipName}
            onChange={(e) => dispatch(setClipName(e.target.value))}
            placeholder="clip.mp4"
            className={inputCls}
          />
        </div>

        {/* Tags dropdown */}
        <div className="flex-1 min-w-0 relative">
          <label className="block text-[10px] font-semibold text-[#6b7280] mb-1 tracking-[0.5px] uppercase">
            Tags
          </label>
          <div
            onClick={() => setTagOpen((o) => !o)}
            className="w-full bg-[#1a1f2e] border border-[#2d3748] rounded-[7px] text-[#d1d5db] text-xs py-[7px] px-[9px] flex items-center justify-between cursor-pointer select-none"
          >
            <span>{selectedTag}</span>
            <ChevronIcon />
          </div>

          {tagOpen && (
            <div className="absolute top-[calc(100%+3px)] left-0 right-0 z-[100] bg-[#1a1f2e] border border-[#2d3748] rounded-lg overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
              {TAG_OPTIONS.map((tag) => {
                const c = TAG_COLORS[tag];
                return (
                  <div
                    key={tag}
                    onClick={() => { dispatch(setSelectedTag(tag)); setTagOpen(false); }}
                    className={`py-2 px-3 cursor-pointer hover:bg-white/[0.06] ${selectedTag === tag ? 'bg-indigo-500/15' : ''}`}
                  >
                    <span
                      className="inline-block py-[2px] px-[10px] rounded-full text-[11px] font-bold"
                      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                    >
                      {tag}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Range preview */}
      <div className="py-[6px] px-[9px] bg-[#1a1f2e] rounded-[7px] flex items-center justify-between border border-[#2d3748]">
        <span className="text-[10px] text-[#6b7280] flex items-center gap-[5px]">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
          </svg>
          Range
        </span>
        <span className="text-[11px] font-semibold text-blue-300 tabular-nums">
          {formatTime(inPoint * duration)} → {formatTime(outPoint * duration)}
        </span>
      </div>
    </div>
  );
}
