import { useSelector } from 'react-redux';
import HlsPlayer from './HlsPlayer';
import VideoOverlay from './VideoOverlay';
import { selectHlsReady } from '../videoSlice';

export default function VideoPlayer({ videoRef, format = 'T20', teams = 'IND vs PAK', compact = false }) {
  const hlsReady = useSelector(selectHlsReady);

  return (
    <div
      className={`relative bg-black w-full overflow-hidden ${compact ? 'h-[24vh]' : ''}`}
      style={compact ? {} : { aspectRatio: '16/9' }}
    >
      <HlsPlayer videoRef={videoRef} compact={compact} />
      <div className="absolute inset-0 pointer-events-none">
        <VideoOverlay format={format} teams={teams} showLoader={!hlsReady} />
      </div>
    </div>
  );
}
