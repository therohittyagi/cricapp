import { useSelector } from 'react-redux';
import { selectMatchConfig } from '../videoSlice';

export default function LiveBadge() {
  const cfg = useSelector(selectMatchConfig);
  if (!cfg?.engine_status) return null;

  return (
    <>
      <style>{`
        @keyframes livePulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
      `}</style>
      <div className="absolute top-[14px] right-[14px] bg-green-600 text-white text-[11px] font-bold py-[5px] px-3 rounded-full flex items-center gap-[6px] tracking-wide shadow-[0_0_12px_rgba(22,163,74,0.4)]">
        <div className="w-[7px] h-[7px] rounded-full bg-white shrink-0" style={{ animation: 'livePulse 1.4s ease-in-out infinite' }} />
        LIVE
      </div>
    </>
  );
}
