import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentTime, selectDuration, selectInPoint, selectOutPoint,
  setCurrentTime, setDragging, setInPoint, setOutPoint, setIsPlaying,
} from '../videoSlice';
import { formatTime } from '../../../shared/utils/formatTime/timeFormat';
import TimelinePlayhead from './TimelinePlayhead';

const MAJOR_TICKS = 13;
const MINOR_PER_SEGMENT = 4;

export default function Timeline({ videoRef, timelineBarRef, showInOut, compact = false }) {
  const dispatch    = useDispatch();
  const currentTime = useSelector(selectCurrentTime);
  const duration    = useSelector(selectDuration);
  const inPoint     = useSelector(selectInPoint);
  const outPoint    = useSelector(selectOutPoint);

  const [hoverFrac, setHoverFrac]     = useState(null);
  const [activeMarker, setActiveMarker] = useState(null); // 'in' | 'out' | null

  const playPercent = duration ? ((currentTime / duration) * 100).toFixed(3) : '0';
  const inPct       = inPoint  != null && duration ? (inPoint  / duration) * 100 : null;
  const outPct      = outPoint != null && duration ? (outPoint / duration) * 100 : null;
  const rangePct    = inPct != null && outPct != null ? outPct - inPct : 0;

  const getFrac = (clientX) => {
    const rect = timelineBarRef.current.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const handleClick = (e) => {
    const frac = getFrac(e.clientX);
    const t    = frac * duration;
    if (videoRef.current) videoRef.current.currentTime = t;
    dispatch(setCurrentTime(t));
    if (showInOut) {
      dispatch(setInPoint(t));
      if (videoRef?.current) { videoRef.current.play(); dispatch(setIsPlaying(true)); }
      if (outPoint != null && t >= outPoint) dispatch(setOutPoint(Math.min(t + 1, duration)));
    }
  };

  const handleContextMenu = (e) => {
    if (!showInOut) return;
    e.preventDefault();
    const t = getFrac(e.clientX) * duration;
    dispatch(setOutPoint(t));
    dispatch(setCurrentTime(t));
    if (videoRef?.current) {
      videoRef.current.currentTime = t;
      videoRef.current.pause();
      dispatch(setIsPlaying(false));
    }
    if (inPoint != null && t <= inPoint) dispatch(setInPoint(Math.max(t - 1, 0)));
  };

  const handlePlayheadMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setDragging('playhead'));
  };

  useEffect(() => {
    if (!showInOut) { setActiveMarker(null); return; }
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return;
      const t = hoverFrac != null ? hoverFrac * duration : currentTime;

      if (e.key === 'i' || e.key === 'I') {
        dispatch(setInPoint(t));
        dispatch(setCurrentTime(t));
        if (videoRef?.current) { videoRef.current.currentTime = t; videoRef.current.play(); dispatch(setIsPlaying(true)); }
        if (outPoint != null && t >= outPoint) dispatch(setOutPoint(Math.min(t + 1, duration)));
        setActiveMarker('in');
      } else if (e.key === 'o' || e.key === 'O') {
        dispatch(setOutPoint(t));
        dispatch(setCurrentTime(t));
        if (videoRef?.current) { videoRef.current.currentTime = t; videoRef.current.pause(); dispatch(setIsPlaying(false)); }
        if (inPoint != null && t <= inPoint) dispatch(setInPoint(Math.max(t - 1, 0)));
        setActiveMarker('out');
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const delta = e.key === 'ArrowRight' ? 1 : -1;
        if (activeMarker === 'in' && inPoint != null) {
          e.preventDefault();
          const newT = Math.max(0, Math.min(inPoint + delta, outPoint != null ? outPoint - 0.1 : duration));
          dispatch(setInPoint(newT));
          dispatch(setCurrentTime(newT));
          if (videoRef?.current) videoRef.current.currentTime = newT;
        } else if (activeMarker === 'out' && outPoint != null) {
          e.preventDefault();
          const newT = Math.max(inPoint != null ? inPoint + 0.1 : 0, Math.min(outPoint + delta, duration));
          dispatch(setOutPoint(newT));
          dispatch(setCurrentTime(newT));
          if (videoRef?.current) videoRef.current.currentTime = newT;
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showInOut, hoverFrac, duration, currentTime, inPoint, outPoint, activeMarker, dispatch]);

  return (
    <div className={`bg-[#111318] border-t border-[#1f2937] shrink-0 ${compact ? 'px-2 pt-1' : 'px-[14px] pt-2'} ${showInOut && !compact ? 'pb-9' : showInOut && compact ? 'pb-7' : compact ? 'pb-1' : 'pb-3'}`}>

      {/* Hint row */}
      {showInOut && (
        <div className="flex justify-end gap-4 mb-1 text-[10px] text-[#4b5563] select-none">
          <span><span className="text-blue-400 font-semibold">Left click / I</span> → Set IN</span>
          <span><span className="text-blue-400 font-semibold">Right click / O</span> → Set OUT</span>
          {/* {activeMarker && (
            <span><span className="text-blue-400 font-semibold">← →</span> Nudge {activeMarker.toUpperCase()} ±1s</span>
          )} */}
        </div>
      )}

      {/* Time ruler */}
      <div className="relative h-[22px] mb-1 overflow-visible">
        {/* Major tick labels */}
        {Array.from({ length: MAJOR_TICKS }, (_, i) => {
          const frac = i / (MAJOR_TICKS - 1);
          return (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{ left: `${frac * 100}%` }}
            >
              <span className="text-[9px] text-[#4b5563] tabular-nums select-none whitespace-nowrap -translate-x-1/2 block leading-tight">
                {formatTime(frac * duration)}
              </span>
              <div className="w-px h-[5px] bg-[#374151]" />
            </div>
          );
        })}
        {/* Minor ticks */}
        {Array.from({ length: (MAJOR_TICKS - 1) * MINOR_PER_SEGMENT + 1 }, (_, i) => {
          if (i % MINOR_PER_SEGMENT === 0) return null;
          const frac = i / ((MAJOR_TICKS - 1) * MINOR_PER_SEGMENT);
          return (
            <div
              key={`m${i}`}
              className="absolute bottom-0 w-px h-[3px] bg-[#2d3748]"
              style={{ left: `${frac * 100}%` }}
            />
          );
        })}
      </div>

      {/* Seekbar */}
      <div
        ref={timelineBarRef}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onMouseMove={(e) => showInOut && setHoverFrac(getFrac(e.clientX))}
        onMouseLeave={() => setHoverFrac(null)}
        className="relative h-[6px] bg-[#1f2937] rounded-[3px] cursor-crosshair select-none"
      >
        {/* Played fill */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#4f46e5] to-[#6366f1] rounded-[3px] pointer-events-none"
          style={{ width: `${playPercent}%` }}
        />

        {/* Range highlight */}
        {showInOut && inPct != null && outPct != null && rangePct > 0 && (
          <div
            className="absolute inset-y-0 bg-blue-500/25 border-x border-blue-500 pointer-events-none"
            style={{ left: `${inPct}%`, width: `${rangePct}%` }}
          />
        )}

        {/* IN marker */}
        {showInOut && inPct != null && (
          <div
            className="absolute -translate-x-1/2 flex flex-col items-center cursor-pointer z-10"
            style={{ left: `${inPct}%`, top: 'calc(100% + 3px)' }}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setCurrentTime(inPoint));
              if (videoRef?.current) videoRef.current.currentTime = inPoint;
              setActiveMarker('in');
            }}
          >
            <div className={`w-0 h-0 border-l-[5px] border-r-[5px] border-b-[7px] border-l-transparent border-r-transparent transition-colors ${activeMarker === 'in' ? 'border-b-white' : 'border-b-blue-400'}`} />
            <span className={`text-[8px] font-bold uppercase tracking-wider leading-tight mt-[2px] transition-colors ${activeMarker === 'in' ? 'text-white' : 'text-blue-400'}`}>IN</span>
            <span className={`text-[9px] font-mono font-semibold whitespace-nowrap leading-tight mt-[1px] transition-colors ${activeMarker === 'in' ? 'text-white' : 'text-blue-300'}`}>
              {formatTime(inPoint)}
            </span>
          </div>
        )}

        {/* OUT marker */}
        {showInOut && outPct != null && (
          <div
            className="absolute -translate-x-1/2 flex flex-col items-center cursor-pointer z-10"
            style={{ left: `${outPct}%`, top: 'calc(100% + 3px)' }}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setCurrentTime(outPoint));
              if (videoRef?.current) videoRef.current.currentTime = outPoint;
              setActiveMarker('out');
            }}
          >
            <div className={`w-0 h-0 border-l-[5px] border-r-[5px] border-b-[7px] border-l-transparent border-r-transparent transition-colors ${activeMarker === 'out' ? 'border-b-white' : 'border-b-blue-400'}`} />
            <span className={`text-[8px] font-bold uppercase tracking-wider leading-tight mt-[2px] transition-colors ${activeMarker === 'out' ? 'text-white' : 'text-blue-400'}`}>OUT</span>
            <span className={`text-[9px] font-mono font-semibold whitespace-nowrap leading-tight mt-[1px] transition-colors ${activeMarker === 'out' ? 'text-white' : 'text-blue-300'}`}>
              {formatTime(outPoint)}
            </span>
          </div>
        )}

        {/* Hover time tooltip */}
        {hoverFrac != null && (
          <div
            className="absolute -top-7 -translate-x-1/2 pointer-events-none bg-[#1f2937] text-white text-[10px] font-mono px-[6px] py-[2px] rounded whitespace-nowrap z-20 flex items-center gap-[6px]"
            style={{ left: `${hoverFrac * 100}%` }}
          >
            {formatTime(hoverFrac * duration)}
            {showInOut && (
              <span className="text-[#6b7280]">
                <span className="text-blue-400">I</span> in · <span className="text-blue-400">O</span> out
              </span>
            )}
          </div>
        )}

        <TimelinePlayhead
          percent={Number(playPercent)}
          onMouseDown={handlePlayheadMouseDown}
        />
      </div>
    </div>
  );
}
