

const PlayOverlay = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-[18px] h-[18px] rounded-full bg-black/55 flex items-center justify-center">
      <div
        style={{
          width: 0, height: 0,
          borderStyle: 'solid',
          borderWidth: '4px 0 4px 7px',
          borderColor: 'transparent transparent transparent #fff',
          marginLeft: 2,
        }}
      />
    </div>
  </div>
);

export default function ClipCard({ clip, onSelect, isActive }) {
  const tags = Array.isArray(clip.tags) ? clip.tags : (clip.tag ? [clip.tag] : []);

  return (
    <div
      onClick={onSelect}
      className={`flex items-start gap-3 py-3 px-5 border-b border-[#1a1f2e] cursor-pointer transition-colors duration-150 hover:bg-white/[0.04] ${isActive ? 'bg-indigo-500/10 border-l-2 border-l-indigo-500' : ''}`}
    >

      {/* Thumbnail */}
      <div
        className="w-[68px] h-[42px] shrink-0 rounded-[5px] overflow-hidden relative"
        style={{ background: clip.thumb || '#1f2937' }}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.06) 0%, transparent 60%)' }}
        />
        <div className="absolute bottom-0 inset-x-0 h-[30%] bg-[rgba(22,101,52,0.4)]" />
        <PlayOverlay />
      </div>

      {/* Text info */}
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-[#d1d5db] leading-[1.4] mb-[6px] line-clamp-2">
          {clip.name}
        </div>

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1 flex-wrap">
            {tags.map((tag, idx) => {
              const c = { text: '#fff', bg: '#333', border: '#555' };
              return (
                <span
                  key={idx}
                  className="inline-block py-[2px] px-[8px] rounded-full text-[10px] font-bold tracking-[0.3px]"
                  style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                >
                  {tag}
                </span>
              );
            })}
          </div>
          <span className="text-[10px] text-[#4b5563] tabular-nums whitespace-nowrap">
            {clip.start} – {clip.end}
          </span>
        </div>
      </div>
    </div>
  );
}
