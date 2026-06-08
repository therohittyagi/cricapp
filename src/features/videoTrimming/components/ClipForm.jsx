import { useState, useRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setClipName,
  toggleTag,
  selectClipName,
  selectSelectedTags,
  selectInPoint,
  selectOutPoint,
  selectDuration,
  selectClips,
} from "../videoSlice";
import { formatTime } from "../../../shared/utils/formatTime/timeFormat";

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

const CheckIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
  >
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

export default function ClipForm() {
  const dispatch = useDispatch();

  const clipName = useSelector(selectClipName);
  const selectedTags = useSelector(selectSelectedTags);
  const inPoint = useSelector(selectInPoint);
  const outPoint = useSelector(selectOutPoint);
  const duration = useSelector(selectDuration);
  const clips = useSelector(selectClips);

  const [tagOpen, setTagOpen] = useState(false);
  const dropdownRef = useRef(null);

  /** 🔹 Build tag list dynamically */
  const tagOptions = useMemo(() => {
    const set = new Set(selectedTags);
    clips.forEach((c) => {
      if (Array.isArray(c.tags)) {
        c.tags.forEach((t) => set.add(t));
      } else if (c.tag) {
        set.add(c.tag);
      }
    });
    return Array.from(set);
  }, [clips, selectedTags]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!tagOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setTagOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [tagOpen]);

  const fieldCls =
    "w-full bg-[#1a1f2e] border border-[#2d3748] rounded-[7px] text-[#d1d5db] text-sm py-3 px-4";

  return (
    <div className="py-[13px] px-[18px] border-b border-[#1f2937]">
      <div className="flex gap-2 mb-[10px]">
        {/* Clip name */}
        <div className="flex-1 min-w-0">
          <label className="block text-sm font-semibold text-[#6b7280] mb-1 tracking-[0.5px] uppercase">
            Clip Name
          </label>
          <input
            value={clipName}
            onChange={(e) => dispatch(setClipName(e.target.value))}
            placeholder="clip.mp4"
            className={`${fieldCls} outline-none focus:border-indigo-500`}
          />
        </div>

        {/* Tags */}
        <div className="flex-1 min-w-0 relative" ref={dropdownRef}>
          <label className="block text-sm font-semibold text-[#6b7280] mb-1 tracking-[0.5px] uppercase">
            Tags
          </label>

          {/* Trigger */}
          <div
            onClick={() => setTagOpen((o) => !o)}
            className={`${fieldCls} min-h-[46px] flex items-center justify-between gap-2 cursor-pointer`}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedTags.length === 0 ? (
                <span className="text-[#6b7280]">Select tags…</span>
              ) : (
                selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-2 py-[2px] rounded-full text-xs font-semibold bg-[#0f172a] border border-[#334155] text-[#e5e7eb]"
                  >
                    {tag}
                  </span>
                ))
              )}
            </div>

            <span
              className={`transition-transform ${tagOpen ? "rotate-180" : ""}`}
            >
              <ChevronIcon />
            </span>
          </div>

          {/* Dropdown */}
          {tagOpen && (
            <div className="absolute top-[calc(100%+3px)] left-0 right-0 z-[999] bg-[#1a1f2e] border border-[#2d3748] rounded-lg overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.7)]">
              {tagOptions.length === 0 ? (
                <div className="py-2 px-3 text-sm text-[#6b7280]">
                  No tags available
                </div>
              ) : (
                tagOptions.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <div
                      key={tag}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => dispatch(toggleTag(tag))}
                      className={`flex items-center justify-between py-2 px-3 cursor-pointer hover:bg-white/[0.06]
                        ${isSelected ? "bg-indigo-500/10" : ""}`}
                    >
                      <span className="text-sm font-medium text-[#e5e7eb]">
                        {tag}
                      </span>
                      {isSelected && (
                        <span className="text-indigo-400">
                          <CheckIcon />
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Range preview */}
      <div className="py-[6px] px-[9px] bg-[#1a1f2e] rounded-[7px] flex items-center justify-between border border-[#2d3748]">
        <span className="text-sm text-[#6b7280] flex items-center gap-[5px]">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
          Range
        </span>
        <span className="text-sm font-semibold text-blue-300 tabular-nums">
          {formatTime(inPoint * duration)} → {formatTime(outPoint * duration)}
        </span>
      </div>
    </div>
  );
}
