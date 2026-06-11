import { useRef, useEffect, useState } from 'react';
import { formatTime } from '../../../shared/utils/formatTime/timeFormat';

export default function MiniPlayer({ clip, onClose }) {
  const videoRef  = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [duration, setDuration]   = useState(0);

  const url  = clip.url || '';
  const name = clip.output_name || 'clip.mp4';
  const range = `${formatTime(clip.start_time ?? 0)} – ${formatTime(clip.end_time ?? 0)}`;

  // Load video src whenever clip changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    video.src = url;
    video.load();
    video.play().catch(() => {});

    return () => {
      video.pause();
      video.src = '';
    };
  }, [clip.id, url]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.duration) setProgress(video.currentTime / video.duration);
    };
    const onDuration  = () => setDuration(video.duration || 0);
    const onPlay      = () => setIsPlaying(true);
    const onPause     = () => setIsPlaying(false);
    const onEnded     = () => { setIsPlaying(false); setProgress(1); };

    video.addEventListener('timeupdate',    onTimeUpdate);
    video.addEventListener('durationchange', onDuration);
    video.addEventListener('play',          onPlay);
    video.addEventListener('pause',         onPause);
    video.addEventListener('ended',         onEnded);

    return () => {
      video.removeEventListener('timeupdate',    onTimeUpdate);
      video.removeEventListener('durationchange', onDuration);
      video.removeEventListener('play',          onPlay);
      video.removeEventListener('pause',         onPause);
      video.removeEventListener('ended',         onEnded);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      if (video.ended) video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = frac * video.duration;
    setProgress(frac);
  };

  return (
    <div className="shrink-0 border-b border-[#1f2937]">
      {/* Video area */}
      <div className="relative bg-black w-full" style={{ aspectRatio: '16/9' }}>

        {url ? (
          <video ref={videoRef} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#4b5563]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            <span className="text-xs">Processing…</span>
          </div>
        )}

        {/* Play/Pause overlay */}
        {url && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 w-full h-full flex items-center justify-center group cursor-pointer"
            style={{ background: 'transparent', border: 'none' }}
          >
            <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              {isPlaying ? (
                <div className="flex gap-[3px]">
                  <div className="w-[3px] h-4 bg-white rounded-full" />
                  <div className="w-[3px] h-4 bg-white rounded-full" />
                </div>
              ) : (
                <div style={{
                  width: 0, height: 0,
                  borderStyle: 'solid',
                  borderWidth: '6px 0 6px 10px',
                  borderColor: 'transparent transparent transparent #fff',
                  marginLeft: 2,
                }} />
              )}
            </div>
          </button>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center hover:bg-black/80 transition-colors z-10"
        >
          ✕
        </button>

        {/* Progress bar */}
        {url && (
          <div
            onClick={handleSeek}
            className="absolute bottom-0 inset-x-0 h-[4px] bg-white/20 cursor-pointer"
          >
            <div className="h-full bg-blue-500 transition-[width] duration-75" style={{ width: `${progress * 100}%` }} />
          </div>
        )}
      </div>

      {/* Clip info row */}
      <div className="px-3 py-2 flex items-center justify-between gap-2 bg-[#0e1015]">
        <span className="text-[11px] text-[#d1d5db] font-medium truncate" title={name}>{name}</span>
        <div className="flex items-center gap-2 shrink-0">
          {duration > 0 && (
            <span className="text-[10px] text-[#6b7280] tabular-nums">{formatTime(duration)}</span>
          )}
          <span className="text-[10px] text-[#4b5563] tabular-nums whitespace-nowrap">{range}</span>
        </div>
      </div>
    </div>
  );
}
