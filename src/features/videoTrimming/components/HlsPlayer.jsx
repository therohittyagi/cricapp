import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { loadHlsThunk } from '../videoThunk';
import { setCurrentTime, setDuration, setIsPlaying } from '../videoSlice';

export default function HlsPlayer({ videoRef, className }) {
  const dispatch = useDispatch();
  const initRef  = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || initRef.current) return;
    initRef.current = true;
    dispatch(loadHlsThunk(video));
    return () => {
      import('../services/hlsService').then(({ destroyHls }) => destroyHls());
    };
  }, [dispatch, videoRef]);

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
      className={`w-full h-[420px] block object-cover ${className ?? ''}`}
    />
  );
}
