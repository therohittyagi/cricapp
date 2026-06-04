import { useDispatch, useSelector } from 'react-redux';
import { selectIsPlaying, selectDuration, selectCurrentTime, setCurrentTime, setIsPlaying } from '../videoSlice';
import { clamp } from '../../../shared/utils/formatTime/timeFormat';

const RewindIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 4v6h6" /><path d="M3.51 15a9 9 0 1 0 .49-3.51" />
  </svg>
);
const ForwardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 1 1-.49-3.51" />
  </svg>
);
const PlayIcon  = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
);
const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
  </svg>
);

export default function PlaybackControls({ videoRef }) {
  const dispatch    = useDispatch();
  const isPlaying   = useSelector(selectIsPlaying);
  const duration    = useSelector(selectDuration);
  const currentTime = useSelector(selectCurrentTime);

  const seek = (delta) => {
    const v = videoRef.current;
    const t = clamp(currentTime + delta, 0, duration);
    if (v) v.currentTime = t;
    dispatch(setCurrentTime(t));
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
      dispatch(setIsPlaying(false));
    } else {
      v.play().catch(() => {});
      dispatch(setIsPlaying(true));
    }
  };

  return (
    <div className="flex items-center gap-[3px]">
      <button
        className="bg-transparent border-none text-[#9ca3af] hover:text-white cursor-pointer w-[34px] h-[34px] rounded-md flex items-center justify-center transition-all duration-150"
        onClick={() => seek(-10)}
        title="Rewind 10s"
      >
        <RewindIcon />
      </button>

      <button
        onClick={togglePlay}
        className="bg-[#1f2937] border border-[#374151] text-white cursor-pointer w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 hover:bg-[#374151]"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <button
        className="bg-transparent border-none text-[#9ca3af] hover:text-white cursor-pointer w-[34px] h-[34px] rounded-md flex items-center justify-center transition-all duration-150"
        onClick={() => seek(10)}
        title="Forward 10s"
      >
        <ForwardIcon />
      </button>
    </div>
  );
}
