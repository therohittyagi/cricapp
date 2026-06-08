import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentTime, selectDuration, setCurrentTime, setDragging } from '../videoSlice';
import { getFractionFromMouseEvent, formatTime } from '../../../shared/utils/formatTime/timeFormat';
import TimelinePlayhead from './TimelinePlayhead';

const TICK_COUNT = 13;

export default function Timeline({ videoRef, timelineBarRef }) {
  const dispatch    = useDispatch();
  const currentTime = useSelector(selectCurrentTime);
  const duration    = useSelector(selectDuration);

  const playFrac    = duration ? currentTime / duration : 0;
  const playPercent = (playFrac * 100).toFixed(3);

  const handleBarClick = (e) => {
    const frac = getFractionFromMouseEvent(e.clientX, timelineBarRef.current);
    const t    = frac * duration;
    if (videoRef.current) videoRef.current.currentTime = t;
    dispatch(setCurrentTime(t));
  };

  const handlePlayheadMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setDragging('playhead'));
  };

  return (
    <div className="bg-[#111318] border-t border-[#1f2937] px-[14px] pt-[10px] shrink-0 ">

      {/* Progress bar */}
      <div
        ref={timelineBarRef}
        onClick={handleBarClick}
        className="relative h-[6px] bg-[#1f2937] rounded-[3px] cursor-crosshair select-none my-2"
      >
        {/* Played fill */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#4f46e5] to-[#6366f1] rounded-[3px]"
          style={{ width: `${playPercent}%` }}
        />

        <TimelinePlayhead
          percent={Number(playPercent)}
          onMouseDown={handlePlayheadMouseDown}
        />
      </div>

      {/* Time ruler */}
      <div className="relative h-5 mt-1 overflow-hidden mb-2">
        {Array.from({ length: TICK_COUNT }, (_, i) => {
          const frac = i / (TICK_COUNT - 1);
          return (
            <div
              key={i}
              className="absolute -translate-x-1/2 text-[10px] text-[#4b5563] tabular-nums select-none whitespace-nowrap"
              style={{ left: `${frac * 100}%` }}
            >
              {formatTime(frac * duration)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
