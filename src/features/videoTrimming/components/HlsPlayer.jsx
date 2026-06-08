import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentTime, setDuration, setIsPlaying } from '../videoSlice';

export default function HlsPlayer({ videoRef, className }) {
  const dispatch = useDispatch();

  // Destroy HLS instance on unmount
  useEffect(() => {
    return () => {
      import('../services/hlsService').then(({ destroyHls }) => destroyHls());
    };
  }, []);

  // Sync video events to Redux
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => dispatch(setCurrentTime(video.currentTime));
    const onDuration   = () => {
      if (video.duration && !isNaN(video.duration))
        dispatch(setDuration(video.duration));
    };
    const onPlay  = () => dispatch(setIsPlaying(true));
    const onPause = () => dispatch(setIsPlaying(false));
    const onEnded = () => dispatch(setIsPlaying(false));

    video.addEventListener('timeupdate',     onTimeUpdate);
    video.addEventListener('durationchange', onDuration);
    video.addEventListener('play',           onPlay);
    video.addEventListener('pause',          onPause);
    video.addEventListener('ended',          onEnded);

    return () => {
      video.removeEventListener('timeupdate',     onTimeUpdate);
      video.removeEventListener('durationchange', onDuration);
      video.removeEventListener('play',           onPlay);
      video.removeEventListener('pause',          onPause);
      video.removeEventListener('ended',          onEnded);
    };
  }, [dispatch, videoRef]);

  return (
    <video
      ref={videoRef}
      playsInline
      preload="auto"
      className={`w-full flex-1 min-h-0 block object-cover ${className ?? ''}`}
    />
  );
}
