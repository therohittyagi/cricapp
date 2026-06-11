import MatchInfo from './MatchInfo';
import LiveBadge from './LiveBadge';

export default function VideoOverlay({ showLoader }) {
  return (
    <>
      <MatchInfo />
      <LiveBadge />

      {showLoader && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0f] gap-[10px] pointer-events-auto">
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="23" stroke="#1f2937" strokeWidth="2" />
            <circle cx="24" cy="24" r="6"  fill="#1f2937" />
          </svg>
          <div className="text-[#4b5563] text-[13px]">Loading HLS stream…</div>
        </div>
      )}
    </>
  );
}
