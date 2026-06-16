function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function formatDuration(start, end) {
  if (start == null || end == null) return null;
  const s = Math.round(end - start);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

const STATUS_STYLES = {
  completed:  { label: 'Success',    cls: 'bg-emerald-500 text-white border-emerald-400' },
  success:    { label: 'Success',    cls: 'bg-emerald-500 text-white border-emerald-400' },
  done:       { label: 'Success',    cls: 'bg-emerald-500 text-white border-emerald-400' },
  pending:    { label: 'Pending',    cls: 'bg-amber-500   text-white border-amber-400'  },
  processing: { label: 'Processing', cls: 'bg-blue-500    text-white border-blue-400'   },
  failed:     { label: 'Failed',     cls: 'bg-red-500     text-white border-red-400'    },
  error:      { label: 'Failed',     cls: 'bg-red-500     text-white border-red-400'    },
};

export default function ClipCard({ clip, onSelect, isActive }) {
  const name     = clip.output_name || "clip.mp4";
  const duration = (clip.mp4_start_time != null && clip.mp4_end_time != null)
    ? formatDuration(clip.mp4_start_time, clip.mp4_end_time)
    : formatDuration(clip.start_time, clip.end_time);
  const date     = formatDate(clip.created_at);
  const tags     = clip.tags?.slice(0, 3) ?? [];
  const statusKey = clip.status?.toLowerCase();
  const status   = STATUS_STYLES[statusKey] ?? null;

  return (
    <div
      onClick={onSelect}
      className="flex flex-col cursor-pointer group"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video rounded-[8px] overflow-hidden bg-[#1f2937] shrink-0">
        {clip.thumbnail_url ? (
          <img
            src={clip.thumbnail_url}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1f2937] to-[#0d1117]" />
        )}

        {/* Hover play overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-150 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <div
              style={{
                width: 0, height: 0,
                borderStyle: "solid",
                borderWidth: "5px 0 5px 9px",
                borderColor: "transparent transparent transparent #fff",
                marginLeft: 2,
              }}
            />
          </div>
        </div>

        {/* Status badge */}
        {status && (
          <span className={`absolute bottom-[5px] left-[5px] text-[8px] font-bold px-[5px] py-[1px] rounded border z-10 ${status.cls}`}>
            {status.label}
          </span>
        )}

        {/* Duration badge */}
        {duration && (
          <span className="absolute bottom-[5px] right-[5px] text-[9px] font-bold text-white bg-black/60 px-[5px] py-[1px] rounded z-10 tabular-nums">
            {duration}
          </span>
        )}

        {/* Active ring */}
        {isActive && (
          <div className="absolute inset-0 ring-2 ring-inset ring-indigo-500 rounded-[8px] pointer-events-none" />
        )}
      </div>

      {/* Info */}
      <div className="mt-[7px] min-w-0">
        <p className="text-[11px] font-medium text-[#d1d5db] leading-snug line-clamp-2 break-words">
          {name}
        </p>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-[3px] mt-[5px]">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-[6px] py-[2px] rounded-full text-[9px] font-semibold bg-[#1f2937] border border-[#374151] text-[#c4c9d4] leading-none whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {date && (
          <p className="text-[10px] text-[#4b5563] mt-[2px]">{date}</p>
        )}
      </div>
    </div>
  );
}
