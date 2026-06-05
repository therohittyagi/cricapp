import { useSelector } from 'react-redux';
import HlsPlayer from './HlsPlayer';
import VideoOverlay from './VideoOverlay';
import { selectHlsReady } from '../videoSlice';

export default function VideoPlayer({ videoRef, format = 'T20', teams = 'IND vs PAK' }) {
  const hlsReady = useSelector(selectHlsReady);

  return (
    <div className="relative bg-black flex-1 min-h-0 flex flex-col overflow-hidden">
      <HlsPlayer videoRef={videoRef} />
      <div className="absolute inset-0 pointer-events-none">
        <VideoOverlay format={format} teams={teams} showLoader={!hlsReady} />
      </div>
    </div>
  );
}
