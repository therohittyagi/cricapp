import { useSelector } from 'react-redux';
import HlsPlayer from './HlsPlayer';
import VideoOverlay from './VideoOverlay';
import { selectHlsReady } from '../videoSlice';

export default function VideoPlayer({ videoRef, format = 'T20', teams = 'IND vs PAK' }) {
  const hlsReady = useSelector(selectHlsReady);

  return (
    <div className="relative bg-black shrink-0">
      <HlsPlayer videoRef={videoRef} />
      <VideoOverlay format={format} teams={teams} showLoader={!hlsReady} />
    </div>
  );
}
