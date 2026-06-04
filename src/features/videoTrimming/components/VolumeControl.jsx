import { useDispatch, useSelector } from 'react-redux';
import { setVolume, setIsMuted, selectVolume, selectIsMuted } from '../videoSlice';

const MuteIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);
const MutedIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    <line x1="23" y1="9"  x2="17" y2="15" />
    <line x1="17" y1="9"  x2="23" y2="15" />
  </svg>
);

export default function VolumeControl({ videoRef }) {
  const dispatch = useDispatch();
  const volume   = useSelector(selectVolume);
  const isMuted  = useSelector(selectIsMuted);

  const handleMuteToggle = () => {
    const newMuted = !isMuted;
    dispatch(setIsMuted(newMuted));
    if (videoRef.current) videoRef.current.muted = newMuted;
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    dispatch(setVolume(val));
    dispatch(setIsMuted(val === 0));
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted  = val === 0;
    }
  };

  const displayVolume = isMuted ? 0 : volume;

  return (
    <div className="flex items-center gap-[6px]">
      <button
        onClick={handleMuteToggle}
        title={isMuted ? 'Unmute' : 'Mute'}
        className={`bg-transparent border-none cursor-pointer w-7 h-7 flex items-center justify-center rounded ${isMuted ? 'text-[#6b7280]' : 'text-[#9ca3af]'}`}
      >
        {isMuted ? <MutedIcon /> : <MuteIcon />}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.02"
        value={displayVolume}
        onChange={handleVolumeChange}
        className="w-[72px]"
        style={{ background: `linear-gradient(to right, #6366f1 ${displayVolume * 100}%, #374151 0)` }}
      />
    </div>
  );
}
