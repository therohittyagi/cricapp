import { formatTime } from "../../../shared/utils/formatTime/timeFormat";

const STATUS_STYLES = {
  success: "bg-green-500/15 text-green-400 border-green-500/30",
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  failed:  "bg-red-500/15  text-red-400   border-red-500/30",
};

const PlayOverlay = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-[18px] h-[18px] rounded-full bg-black/55 flex items-center justify-center">
      <div
        style={{
          width: 0, height: 0,
          borderStyle: "solid",
          borderWidth: "4px 0 4px 7px",
          borderColor: "transparent transparent transparent #fff",
          marginLeft: 2,
        }}
      />
    </div>
  </div>
);

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

export default function ClipCard({ clip, onSelect, isActive }) {
  const name     = clip.output_name || "clip.mp4";
  const start    = formatTime(clip.start_time ?? 0);
  const end      = formatTime(clip.end_time ?? 0);
  const duration = clip.end_time != null && clip.start_time != null
    ? formatTime(clip.end_time - clip.start_time)
    : null;
  const status   = (clip.status || "pending").toLowerCase();
  const date     = formatDate(clip.created_at);

  return (
    <div
      onClick={onSelect}
      className={[
        "flex items-start gap-3 py-3 px-4 border-b border-[#1a1f2e] cursor-pointer transition-colors duration-150 hover:bg-white/[0.04]",
        isActive ? "bg-indigo-500/10 border-l-2 border-l-indigo-500" : "",
      ].join(" ")}
    >
      {/* Thumbnail */}
      <div
        className="w-[68px] h-[42px] shrink-0 rounded-[5px] overflow-hidden relative"
        style={{ background: "#1f2937" }}
      >
        {clip.thumbnail_url ? (
          <img
            src={clip.thumbnail_url}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <div
              className="absolute inset-0"
              style={{ backgroundImage: "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.06) 0%, transparent 60%)" }}
            />
            <div className="absolute bottom-0 inset-x-0 h-[30%] bg-[rgba(22,101,52,0.4)]" />
          </>
        )}
        {duration && (
          <span className="absolute bottom-[3px] right-[4px] text-[9px] font-bold text-white/80 tabular-nums z-10">
            {duration}
          </span>
        )}
        <PlayOverlay />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {/* Name */}
        <div className="text-xs font-medium text-[#d1d5db] leading-[1.4] mb-[5px] truncate" title={name}>
          {name}
        </div>

        {/* Time range + status */}
        <div className="flex items-center justify-between gap-2 mb-[4px]">
          <span className="text-[10px] text-[#6b7280] tabular-nums whitespace-nowrap">
            {start} – {end}
          </span>
          <span
            className={[
              "inline-block px-[6px] py-[1px] rounded-full text-[9px] font-bold uppercase tracking-wide border",
              STATUS_STYLES[status] || STATUS_STYLES.pending,
            ].join(" ")}
          >
            {status}
          </span>
        </div>

        {/* Date */}
        {date && (
          <div className="text-[10px] text-[#4b5563]">{date}</div>
        )}

        {/* Tags */}
        {clip.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-[6px]">
            {clip.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-[5px] py-[1px] rounded-full text-[9px] font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
