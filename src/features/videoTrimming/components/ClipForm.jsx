import { useDispatch, useSelector } from "react-redux";
import {
  setClipName,
  toggleTag,
  selectClipName,
  selectSelectedTags,
  selectInPoint,
  selectOutPoint,
  selectMatchConfig,
} from "../videoSlice";
import { formatTime } from "../../../shared/utils/formatTime/timeFormat";
import { CRICKET_TAGS, TAG_CATEGORY_STYLES } from "../../../shared/constants/events";

const CATEGORY_LABELS = {
  runs:      'Runs',
  extras:    'Extras',
  wicket:    'Wickets',
  milestone: 'Milestones',
  match:     'Match Events',
};

const CATEGORIES = ['runs', 'extras', 'wicket', 'milestone', 'match'];

export default function ClipForm() {
  const dispatch = useDispatch();

  const clipName      = useSelector(selectClipName);
  const selectedTags  = useSelector(selectSelectedTags);
  const inPoint       = useSelector(selectInPoint);
  const outPoint      = useSelector(selectOutPoint);
  const matchConfig   = useSelector(selectMatchConfig);
  const defaultName   = matchConfig?.standard_file_name || "clip.mp4";

  const fieldCls =
    "w-full bg-[#1a1f2e] border border-[#2d3748] rounded-[7px] text-[#d1d5db] text-sm py-3 px-4";

  return (
    <div className="py-[13px] px-[18px] border-b border-[#1f2937]">
      {/* Clip name */}
      <div className="mb-[12px]">
        <label className="block text-sm font-semibold text-[#6b7280] mb-1 tracking-[0.5px] uppercase">
          Clip Name
        </label>
        <input
          value={clipName}
          onChange={(e) => dispatch(setClipName(e.target.value))}
          placeholder={defaultName}
          className={`${fieldCls} outline-none focus:border-indigo-500`}
        />
      </div>

      {/* Tags */}
      <div className="mb-[12px]">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-[#6b7280] tracking-[0.5px] uppercase">
            Tags
          </label>
          {selectedTags.length > 0 && (
            <button
              type="button"
              onClick={() => selectedTags.forEach((t) => dispatch(toggleTag(t)))}
              className="text-xs text-[#6b7280] hover:text-[#e5e7eb] transition-colors"
            >
              Clear all ({selectedTags.length})
            </button>
          )}
        </div>

        <div className="bg-[#1a1f2e] border border-[#2d3748] rounded-[7px] p-3 flex flex-col gap-3">
          {CATEGORIES.map((cat) => {
            const tags = CRICKET_TAGS.filter((t) => t.category === cat);
            const styles = TAG_CATEGORY_STYLES[cat];
            return (
              <div key={cat}>
                <span className="block text-[10px] font-bold text-[#4b5563] uppercase tracking-widest mb-[6px]">
                  {CATEGORY_LABELS[cat]}
                </span>
                <div className="flex flex-wrap gap-[6px]">
                  {tags.map(({ label }) => {
                    const isSelected = selectedTags.includes(label);
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => dispatch(toggleTag(label))}
                        className={[
                          'px-[10px] py-[3px] rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer',
                          isSelected
                            ? styles.active
                            : `bg-transparent ${styles.base} hover:opacity-80`,
                        ].join(' ')}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
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
          {formatTime(inPoint ?? 0)} → {formatTime(outPoint ?? 0)}
        </span>
      </div>
    </div>
  );
}
