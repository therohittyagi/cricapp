import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectInPoint,
  selectOutPoint,
  selectDuration,
  setInPoint,
  setOutPoint,
  setCurrentTime,
  setIsPlaying,
} from '../videoSlice';
import { formatTime } from '../../../shared/utils/formatTime/timeFormat';

const TICK_COUNT = 13;

export default function InOutSeekbar({ videoRef }) {
  const dispatch = useDispatch();
  const inPoint = useSelector(selectInPoint);
  const outPoint = useSelector(selectOutPoint);
  const duration = useSelector(selectDuration);

  const barRef = useRef(null);
  const [hoverFrac, setHoverFrac] = useState(null);

  const getFrac = (clientX) => {
    const rect = barRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      e.preventDefault();
      const secs = getFrac(e.clientX) * duration;
      dispatch(setInPoint(secs));
      dispatch(setCurrentTime(secs));
      if (videoRef?.current) {
        videoRef.current.currentTime = secs;
        videoRef.current.play();
        dispatch(setIsPlaying(true));
      }
      if (outPoint != null && secs >= outPoint) {
        dispatch(setOutPoint(Math.min(secs + 1, duration)));
      }
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    const secs = getFrac(e.clientX) * duration;
    dispatch(setOutPoint(secs));
    dispatch(setCurrentTime(secs));
    if (videoRef?.current) {
      videoRef.current.currentTime = secs;
      videoRef.current.pause();
      dispatch(setIsPlaying(false));
    }
    if (inPoint != null && secs <= inPoint) {
      dispatch(setInPoint(Math.max(secs - 1, 0)));
    }
  };

  const inPct   = inPoint  != null && duration ? (inPoint  / duration) * 100 : null;
  const outPct  = outPoint != null && duration ? (outPoint / duration) * 100 : null;
  const rangePct = inPct != null && outPct != null ? outPct - inPct : 0;

  return (
    <div className="bg-[#111318] border-t border-[#1f2937] px-[14px] pt-5 pb-1 shrink-0">
      {/* Hint */}
      <div className="flex justify-end gap-4 mb-2 text-[10px] text-[#4b5563] select-none">
        <span><span className="text-blue-400 font-semibold">Left click</span> → Set IN</span>
        <span><span className="text-blue-400 font-semibold">Right click</span> → Set OUT</span>
      </div>

      {/* Track */}
      <div
        ref={barRef}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
        onMouseMove={(e) => setHoverFrac(getFrac(e.clientX))}
        onMouseLeave={() => setHoverFrac(null)}
        className="relative h-[6px] bg-[#1f2937] rounded-full cursor-crosshair select-none"
      >
        {/* Hover time tooltip */}
        {hoverFrac != null && (
          <div
            className="absolute -top-7 -translate-x-1/2 pointer-events-none bg-[#1f2937] text-white text-[10px] font-mono px-[6px] py-[2px] rounded whitespace-nowrap"
            style={{ left: `${hoverFrac * 100}%` }}
          >
            {formatTime(hoverFrac * duration)}
          </div>
        )}
        {/* Hover ghost line */}
        {hoverFrac != null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[1px] h-[10px] bg-white/40 pointer-events-none"
            style={{ left: `${hoverFrac * 100}%` }}
          />
        )}
        {/* Range highlight */}
        {inPct != null && outPct != null && rangePct > 0 && (
          <div
            className="absolute top-0 bottom-0 bg-blue-500/30 border-x-[2px] border-blue-500 rounded-full pointer-events-none"
            style={{ left: `${inPct}%`, width: `${rangePct}%` }}
          />
        )}

        {/* IN marker */}
        {inPct != null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
            style={{ left: `${inPct}%` }}
          >
            <div className="w-[3px] h-[14px] bg-blue-400 rounded-full" />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-blue-300 font-mono whitespace-nowrap font-semibold">
              IN {formatTime(inPoint)}
            </div>
          </div>
        )}

        {/* OUT marker */}
        {outPct != null && (
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
            style={{ left: `${outPct}%` }}
          >
            <div className="w-[3px] h-[14px] bg-blue-400 rounded-full" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] text-blue-300 font-mono whitespace-nowrap font-semibold">
              OUT {formatTime(outPoint)}
            </div>
          </div>
        )}
      </div>

      {/* Time ruler */}
      <div className="relative h-4 mt-2 mb-1">
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
