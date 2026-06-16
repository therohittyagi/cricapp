import { useEffect, useState } from 'react';

/**
 * useToast – lightweight toast state manager
 *
 * const { toast, showToast, hideToast } = useToast();
 * showToast({ message: '...', type: 'success' | 'error' | 'info', duration?: ms })
 */
export function useToast() {
  const [toast, setToast] = useState(null); // { message, type, id }

  const showToast = ({ message, type = 'success', duration = 3500 }) => {
    const id = Date.now();
    setToast({ message, type, id });
    setTimeout(() => setToast((prev) => (prev?.id === id ? null : prev)), duration);
  };

  const hideToast = () => setToast(null);

  return { toast, showToast, hideToast };
}

/**
 * <Toast toast={toast} onClose={hideToast} />
 * Renders a fixed top-right notification. Pass null/undefined to hide.
 */
export default function Toast({ toast, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [toast]);

  if (!toast) return null;

  const styles = {
    success: {
      bar:  'bg-emerald-500',
      icon: 'text-emerald-400',
      border: 'border-emerald-500/30',
      svg: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20,6 9,17 4,12" />
        </svg>
      ),
    },
    error: {
      bar:  'bg-red-500',
      icon: 'text-red-400',
      border: 'border-red-500/30',
      svg: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    info: {
      bar:  'bg-blue-500',
      icon: 'text-blue-400',
      border: 'border-blue-500/30',
      svg: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      ),
    },
  };

  const s = styles[toast.type] ?? styles.info;

  return (
    <div
      className={`fixed top-5 right-5 z-[9999] flex items-start gap-3 min-w-[280px] max-w-[380px] bg-[#1a1f2e] border ${s.border} rounded-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.45)] overflow-hidden transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
    >
      {/* Left colour bar */}
      <div className={`w-[3px] self-stretch ${s.bar} shrink-0`} />

      {/* Icon */}
      <div className={`mt-[14px] ${s.icon} shrink-0`}>{s.svg}</div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-3 pr-2">
        <p className="text-[12px] font-semibold text-white leading-snug">
          {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Info'}
        </p>
        <p className="text-[11px] text-[#9ca3af] mt-[2px] leading-snug break-words">
          {toast.message}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={onClose}
        className="mt-[10px] mr-[10px] shrink-0 w-5 h-5 flex items-center justify-center rounded text-[#4b5563] hover:text-white hover:bg-white/[0.08] transition-colors text-[11px] leading-none"
      >
        ✕
      </button>
    </div>
  );
}
