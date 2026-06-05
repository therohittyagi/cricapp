import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectInPoint,
  selectOutPoint,
  selectDuration,
  setInPoint,
  setOutPoint,
} from '../videoSlice';
import { formatTime } from '../../../shared/utils/formatTime/timeFormat';

const TICK_COUNT = 13;

export default function InOutSeekbar() {
  const dispatch = useDispatch();
  const inPoint = useSelector(selectInPoint);
  const outPoint = useSelector(selectOutPoint);
  const duration = useSelector(selectDuration);

  const barRef = useRef(null);
  const [dragAnchor, setDragAnchor] = useState(null);

  const getFrac = (clientX) => {
    const rect = barRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const frac = getFrac(e.clientX);
    setDragAnchor(frac);
    dispatch(setInPoint(frac));
    dispatch(setOutPoint(Math.min(frac + 0.02, 1)));
  };

  useEffect(() => {
    if (dragAnchor === null) return;

    const onMove = (e) => {
      const frac = getFrac(e.clientX);
      if (frac >= dragAnchor) {
        dispatch(setInPoint(dragAnchor));
        dispatch(setOutPoint(frac));
      } else {
        dispatch(setOutPoint(dragAnchor));
        dispatch(setInPoint(frac));
      }
    };

    const onUp = () => setDragAnchor(null);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragAnchor, dispatch]);

  const inPct = inPoint != null ? inPoint * 100 : null;
  const outPct = outPoint != null ? outPoint * 100 : null;
  const rangePct =
    inPoint != null && outPoint != null ? (outPoint - inPoint) * 100 : 0;

  return (
    <div className="bg-[#111318] border-t border-[#1f2937] px-[14px] pt-5 pb-1 shrink-0">
      {/* Track */}
      <div
        ref={barRef}
        onMouseDown={handleMouseDown}
        className="relative h-[6px] bg-[#1f2937] rounded-full cursor-crosshair select-none"
      >
        {/* Range highlight */}
        {inPct != null && outPct != null && (
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
              IN {formatTime(inPoint * duration)}
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
              OUT {formatTime(outPoint * duration)}
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
