import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectLoading } from '../videoSlice';
import { saveClipThunk } from '../videoThunk';
import ClipForm from './ClipForm';

export default function ClipModal({ onClose, onSaved }) {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSave = async () => {
    await dispatch(saveClipThunk());
    onSaved();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#111318] border border-[#1f2937] rounded-[16px] w-[560px] shadow-[0_24px_64px_rgba(0,0,0,0.7)]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2937]">
          <h3 className="text-white font-semibold text-[15px] tracking-[-0.2px]">Save Clip</h3>
          <button
            onClick={onClose}
            className="text-[#6b7280] hover:text-white w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.08] transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <ClipForm />

        {/* Actions */}
        <div className="px-5 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-transparent border border-[#374151] text-[#9ca3af] hover:text-white hover:border-[#6b7280] rounded-[10px] py-[11px] text-sm font-semibold cursor-pointer transition-all duration-150"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-[#312e81] disabled:cursor-not-allowed text-white border-none rounded-[10px] py-[11px] text-sm font-bold cursor-pointer tracking-[0.3px] shadow-[0_4px_14px_rgba(79,70,229,0.4)] transition-all duration-150"
          >
            {loading ? 'Saving…' : 'Save Clip'}
          </button>
        </div>

      </div>
    </div>
  );
}
