import { useSelector } from 'react-redux';
import { selectMatchConfig } from '../videoSlice';

export default function MatchInfo() {
  const cfg = useSelector(selectMatchConfig);

  const format = cfg?.match_type?.match_type ?? 'LIVE';
  const teams  = cfg?.standard_file_name
    ?? (cfg?.home_team && cfg?.away_team
        ? `${cfg.home_team.team_code} vs ${cfg.away_team.team_code}`
        : 'IND vs PAK');

  return (
    <div className="absolute top-[14px] left-[14px] bg-black/55 backdrop-blur-sm rounded-[6px] py-[6px] px-[10px] border-l-[3px] border-blue-500">
      <div className="text-[10px] font-bold text-blue-400 tracking-[1.5px]">{format}</div>
      <div className="text-[14px] font-bold text-white">{teams}</div>
    </div>
  );
}
