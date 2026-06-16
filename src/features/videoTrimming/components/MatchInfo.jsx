import { useSelector } from 'react-redux';
import { selectMatchConfig } from '../videoSlice';

export default function MatchInfo({ action }) {
  const cfg = useSelector(selectMatchConfig);

  const format   = cfg?.match_type?.match_type ?? 'LIVE';
  const homeCode = cfg?.home_team?.team_code;
  const awayCode = cfg?.away_team?.team_code;
  const teams    = homeCode && awayCode
    ? `${homeCode} vs ${awayCode}`
    : cfg?.standard_file_name ?? 'IND vs PAK';

  return (
    <div className="flex items-center gap-2 px-3 py-[7px] bg-[#0d1117] border-b border-[#1f2937] shrink-0">
      <span className="text-[9px] font-bold text-blue-400 tracking-[1.5px] uppercase shrink-0">{format}</span>
      <span className="text-[#4b5563]">·</span>
      <span className="text-[11px] font-medium text-[#d1d5db] truncate flex-1">{teams}</span>
      {action}
    </div>
  );
}
