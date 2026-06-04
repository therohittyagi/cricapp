import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectClips, selectFilterTag, selectLoading,
  setFilterTag,
} from '../videoSlice';
import { saveClipThunk } from '../videoThunk';
import { filterClips }   from '../services/clipService';
import { TAG_OPTIONS, TAG_COLORS } from '../../../shared/constants/tags';
import ClipForm from './ClipForm';
import ClipCard from './ClipCard';

const ChevronIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="6,9 12,15 18,9" />
  </svg>
);

export default function ClipsList() {
  const dispatch  = useDispatch();
  const clips     = useSelector(selectClips);
  const filterTag = useSelector(selectFilterTag);
  const loading   = useSelector(selectLoading);

  const [filterOpen, setFilterOpen] = useState(false);

  const filtered  = filterClips(clips, filterTag);
  const handleSave = () => dispatch(saveClipThunk());

  return (
    <div className="w-80 shrink-0 bg-[#111318] border-l border-[#1f2937] flex flex-col overflow-hidden">

      {/* Header */}
      <div className="px-[18px] pt-4 pb-3 border-b border-[#1f2937] flex items-center justify-between">
        <h2 className="text-base font-bold text-[#f9fafb] tracking-[-0.3px]">Clips List</h2>

        {/* Filter dropdown */}
        <div className="relative">
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className="bg-[#1f2937] border border-[#374151] rounded-md text-[#9ca3af] text-[11px] font-semibold py-1 px-[10px] cursor-pointer flex items-center gap-1"
          >
            {filterTag === 'all' ? 'All tags' : filterTag}
            <ChevronIcon />
          </button>

          {filterOpen && (
            <div className="absolute top-[calc(100%+4px)] right-0 z-[100] bg-[#1a1f2e] border border-[#2d3748] rounded-lg overflow-hidden min-w-[110px] shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
              {['all', ...TAG_OPTIONS].map((t) => {
                const isAll = t === 'all';
                const c     = isAll ? null : TAG_COLORS[t];
                return (
                  <div
                    key={t}
                    onClick={() => { dispatch(setFilterTag(t)); setFilterOpen(false); }}
                    className={`py-2 px-3 cursor-pointer hover:bg-white/[0.06] ${filterTag === t ? 'bg-indigo-500/15' : ''}`}
                  >
                    {isAll ? (
                      <span className="text-xs text-[#6b7280]">All tags</span>
                    ) : (
                      <span
                        className="inline-block py-[2px] px-[10px] rounded-full text-[11px] font-bold"
                        style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                      >
                        {t}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <ClipForm />

      {/* Clips */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-10 px-5 text-center text-[#374151] text-xs">
            No clips{filterTag !== 'all' ? ` tagged "${filterTag}"` : ''}
          </div>
        ) : (
          filtered.map((clip) => <ClipCard key={clip.id} clip={clip} />)
        )}
      </div>

      {/* Save */}
      <div className="p-[14px] px-[18px] border-t border-[#1f2937]">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-[#312e81] disabled:cursor-not-allowed text-white border-none rounded-[10px] py-[11px] text-sm font-bold cursor-pointer tracking-[0.3px] shadow-[0_4px_14px_rgba(79,70,229,0.4)] transition-all duration-150"
        >
          {loading ? 'Saving…' : 'Save Clip'}
        </button>
      </div>
    </div>
  );
}
