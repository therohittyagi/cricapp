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
  match:     'Match',
};

const CATEGORIES = ['runs', 'extras', 'wicket', 'milestone', 'match'];

export default function ClipForm({ onCancel, onSave, loading }) {
  const dispatch     = useDispatch();
  const clipName     = useSelector(selectClipName);
  const selectedTags = useSelector(selectSelectedTags);
  const inPoint      = useSelector(selectInPoint);
  const outPoint     = useSelector(selectOutPoint);
  const matchConfig  = useSelector(selectMatchConfig);
  const defaultName  = matchConfig?.standard_file_name || "clip.mp4";

  return (
    <div className="px-3 pt-2 pb-0 flex flex-col gap-[7px] min-h-0 flex-1">

      {/* Clip Name */}
      <div>
        <label className="block text-[9px] font-bold text-[#6b7280] uppercase tracking-widest mb-[4px]">
          Clip Name
        </label>
        <input
          value={clipName}
          onChange={(e) => dispatch(setClipName(e.target.value))}
          placeholder={defaultName}
          className="w-full bg-[#0d1117] border border-[#2d3748] rounded-[6px] text-[#d1d5db] text-[11px] py-[5px] px-2.5 outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Tags — inline category labels to save vertical space */}
      <div className="flex flex-col gap-[5px] @lg:gap-[6px] @2xl:gap-[8px]">
        {selectedTags.length > 0 && (
          <div className="flex justify-end -mt-[3px]">
            <button
              type="button"
              onClick={() => selectedTags.forEach((t) => dispatch(toggleTag(t)))}
              className="text-[9px] @lg:text-[10px] text-[#6b7280] hover:text-white transition-colors"
            >
              Clear ({selectedTags.length})
            </button>
          </div>
        )}

        {CATEGORIES.map((cat) => {
          const tags   = CRICKET_TAGS.filter((t) => t.category === cat);
          if (!tags.length) return null;
          const styles = TAG_CATEGORY_STYLES[cat];
          return (
            <div key={cat} className="flex justify-between gap-[6px] @lg:gap-[8px] @2xl:gap-[10px]">
              <span className="text-[8px] @lg:text-[9px] @2xl:text-[10px] font-bold text-[#4b5563] uppercase tracking-wider min-w-[42px] @lg:min-w-[48px] @2xl:min-w-[54px] pt-[3px] shrink-0 leading-tight">
                {CATEGORY_LABELS[cat]}
              </span>
              <div className="flex flex-wrap gap-[4px] @lg:gap-[5px] @2xl:gap-[7px] flex-1">
                {tags.map(({ label }) => {
                  const isSelected = selectedTags.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => dispatch(toggleTag(label))}
                      className={[
                        'px-[7px] py-[2px] @lg:px-[8px] @lg:py-[3px] @2xl:px-[10px] @2xl:py-[4px] rounded-full text-[9px] @lg:text-[10px] @2xl:text-[11px] font-semibold border transition-all duration-150 cursor-pointer whitespace-nowrap',
                        isSelected
                          ? styles.active
                          : `bg-transparent ${styles.base} hover:opacity-90`,
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

      {/* Bottom — Range + Buttons */}
      <div className="border-t border-[#1f2937] py-[7px] flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-[5px] text-[10px]">
          <span className="text-[#4b5563] flex items-center gap-[3px]">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
            </svg>
            Range
          </span>
          <span className="text-blue-300 font-semibold tabular-nums">
            {formatTime(inPoint ?? 0)} → {formatTime(outPoint ?? 0)}
          </span>
        </div>

        <div className="flex items-center gap-[6px]">
          <button
            type="button"
            onClick={onCancel}
            className="bg-transparent border border-[#374151] text-[#9ca3af] hover:text-white hover:border-[#6b7280] rounded-[6px] py-[5px] px-3 text-[10px] font-semibold cursor-pointer transition-all duration-150"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={loading || selectedTags.length === 0}
            title={selectedTags.length === 0 ? 'Select at least one tag' : undefined}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed text-white border-none rounded-[6px] py-[5px] px-4 text-[10px] font-bold cursor-pointer tracking-[0.3px] shadow-[0_4px_14px_rgba(16,185,129,0.3)] transition-all duration-150"
          >
            {loading ? 'Saving…' : 'Save Clip'}
          </button>
        </div>
      </div>
    </div>
  );
}
