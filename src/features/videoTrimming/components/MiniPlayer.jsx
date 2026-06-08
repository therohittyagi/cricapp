import { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Hls from 'hls.js';
import { selectHlsUrl } from '../videoSlice';

function parseTime(str) {
  if (!str) return 0;
  const parts = str.split(':').map(Number);
  return parts.length === 3
    ? parts[0] * 3600 + parts[1] * 60 + parts[2]
    : parts[0] * 60 + (parts[1] || 0);
}

export default function MiniPlayer({ clip, onClose }) {
  const videoRef = useRef(null);
  const hlsRef   = useRef(null);
  const hlsUrl   = useSelector(selectHlsUrl);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress]   = useState(0);

  const startSec   = parseTime(clip.start);
  const endSec     = parseTime(clip.end);
  const clipLength = Math.max(endSec - startSec, 0.01);

  // Mount / clip-change: attach HLS and seek to start
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attachHls = () => {
      if (!hlsUrl) return;
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: false, lowLatencyMode: false });
        hlsRef.current = hls;
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.currentTime = startSec;
          video.play().catch(() => {});
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsUrl;
        video.currentTime = startSec;
        video.play().catch(() => {});
      }
    };

    attachHls();

    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
      video.pause();
    };
  }, [clip.id]);

  // Time-update: track progress and stop at endSec
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (video.currentTime >= endSec) {
        video.pause();
        setIsPlaying(false);
        setProgress(1);
        return;
      }
      setProgress((video.currentTime - startSec) / clipLength);
    };

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('play',  () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('play',  () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, [startSec, endSec, clipLength]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      if (video.currentTime >= endSec) video.currentTime = startSec;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = startSec + frac * clipLength;
    setProgress(frac);
  };

  const tags = Array.isArray(clip.tags) ? clip.tags : [];

  return (
    <div className="shrink-0 border-b border-[#1f2937]">
      {/* Video area */}
      <div className="relative bg-black w-full" style={{ aspectRatio: '16/9' }}>
        <video ref={videoRef} className="w-full h-full object-cover" />

        {/* Play/Pause click layer */}
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

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center hover:bg-black/80 transition-colors z-10"
        >
          ✕
        </button>

        {/* Progress bar (clickable) */}
        <div
          onClick={handleSeek}
          className="absolute bottom-0 inset-x-0 h-[4px] bg-white/20 cursor-pointer"
        >
          <div
            className="h-full bg-blue-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Clip info row */}
      <div className="px-3 py-2 flex items-center justify-between gap-2 bg-[#0e1015]">
        <span className="text-[11px] text-[#d1d5db] font-medium truncate">{clip.name}</span>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] text-[#4b5563] tabular-nums whitespace-nowrap mr-1">
            {clip.start} – {clip.end}
          </span>
          {tags.map((tag) => {
            const c =  { text: '#fff', bg: '#333', border: '#555' };
            return (
              <span
                key={tag}
                className="text-[9px] px-[6px] py-[1px] rounded-full font-bold"
                style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
