import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectDragging, selectInPoint, selectOutPoint, selectDuration,
  selectCurrentTime, setDragging, setInPoint, setOutPoint, setCurrentTime,
} from '../videoSlice';
import { getFractionFromMouseEvent, formatTime, clamp } from '../../../shared/utils/formatTime/timeFormat';

import VideoPlayer      from '../components/VideoPlayer';
import VolumeControl    from '../components/VolumeControl';
import PlaybackControls from '../components/PlaybackControls';
import GoLiveButton     from '../components/GoLiveButton';
import Timeline         from '../components/Timeline';
import ThumbnailStrip   from '../components/ThumbnailStrip';
import ClipsList        from '../components/ClipsList';

export default function VideoTrimming() {
  const dispatch    = useDispatch();
  const videoRef    = useRef(null);
  const tlBarRef    = useRef(null);
  const thumbBarRef = useRef(null);

  const dragging    = useSelector(selectDragging);
  const inPoint     = useSelector(selectInPoint);
  const outPoint    = useSelector(selectOutPoint);
  const duration    = useSelector(selectDuration);
  const currentTime = useSelector(selectCurrentTime);

  useEffect(() => {
    if (!dragging) return;

    const onMouseMove = (e) => {
      if (dragging === 'playhead') {
        const frac = getFractionFromMouseEvent(e.clientX, tlBarRef.current);
        const t    = frac * duration;
        if (videoRef.current) videoRef.current.currentTime = t;
        dispatch(setCurrentTime(t));
      } else if (dragging === 'in') {
        const frac = getFractionFromMouseEvent(e.clientX, thumbBarRef.current);
        dispatch(setInPoint(clamp(frac, 0, outPoint - 0.02)));
      } else if (dragging === 'out') {
        const frac = getFractionFromMouseEvent(e.clientX, thumbBarRef.current);
        dispatch(setOutPoint(clamp(frac, inPoint + 0.02, 1)));
      }
    };

    const onMouseUp = () => dispatch(setDragging(null));

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup',   onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup',   onMouseUp);
    };
  }, [dragging, duration, inPoint, outPoint, dispatch]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        input[type=range] { -webkit-appearance:none; height:4px; border-radius:2px; outline:none; cursor:pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:13px; height:13px; border-radius:50%; background:#6366f1; cursor:grab; border:2px solid #fff; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:#374151; border-radius:2px; }
      `}</style>

      <div className="flex h-full overflow-hidden text-white bg-[#0d0d10]" style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* LEFT: Editor */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">

          <VideoPlayer videoRef={videoRef} />

          {/* Controls bar */}
          <div className="bg-[#111318] border-t border-[#1f2937] px-[14px] h-[52px] flex items-center justify-between gap-2 shrink-0">

            <div className="text-[13px] font-semibold tabular-nums text-[#d1d5db] min-w-[112px]">
              {formatTime(currentTime)}{' '}
              <span className="text-[#4b5563]">/</span>{' '}
              {formatTime(duration)}
            </div>

            <VolumeControl    videoRef={videoRef} />
            <PlaybackControls videoRef={videoRef} />

            <div className="flex items-center gap-[5px]">
              <GoLiveButton />
              <IconBtn title="Download">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </IconBtn>
              <IconBtn title="Cut">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
                  <line x1="20" y1="4" x2="8.12" y2="15.88"/>
                  <line x1="14.47" y1="14.48" x2="20" y2="20"/>
                  <line x1="8.12" y1="8.12" x2="12" y2="12"/>
                </svg>
              </IconBtn>
              <IconBtn title="Fullscreen">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
              </IconBtn>
            </div>
          </div>

          <Timeline      videoRef={videoRef} timelineBarRef={tlBarRef} />
          <ThumbnailStrip thumbBarRef={thumbBarRef} />
        </div>

        {/* RIGHT: Clips */}
        <ClipsList />
      </div>
    </>
  );
}

function IconBtn({ children, title }) {
  return (
    <button
      title={title}
      className="bg-transparent border-none text-[#9ca3af] cursor-pointer w-8 h-8 rounded-md flex items-center justify-center transition-all duration-150 hover:bg-white/[0.08] hover:text-white"
    >
      {children}
    </button>
  );
}
