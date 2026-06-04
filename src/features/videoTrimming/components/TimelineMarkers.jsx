import { TAG_COLORS } from '../../../shared/constants/tags';
import { EVENT_MARKERS } from '../../../shared/constants/events';

export default function TimelineMarkers() {
  return (
    <>
      {EVENT_MARKERS.map((event, i) => {
        const color = TAG_COLORS[event.type]?.text || '#fff';
        return (
          <div
            key={i}
            title={event.type}
            className="absolute -top-[3px] -bottom-[3px] -translate-x-1/2 w-[3px] rounded-[2px] cursor-pointer"
            style={{ left: `${event.pos * 100}%`, background: color }}
          >
            {event.label && (
              <div
                className="absolute left-1/2 -translate-x-1/2 bg-red-600 text-white text-[8px] font-extrabold px-1 rounded-[3px] whitespace-nowrap"
                style={{ bottom: 'calc(100% + 2px)' }}
              >
                {event.label}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
