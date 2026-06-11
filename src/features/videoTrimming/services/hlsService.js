import Hls from 'hls.js';

let hlsInstance = null;

export function initHls(videoElement, url, { onReady, onError } = {}) {
  if (!videoElement || !url) return;

  if (Hls.isSupported()) {
    hlsInstance = new Hls({ enableWorker: false, lowLatencyMode: false });
    hlsInstance.loadSource(url);
    hlsInstance.attachMedia(videoElement);
    hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => onReady?.());
    hlsInstance.on(Hls.Events.ERROR, (_, data) => {
      if (data.fatal) onError?.(data);
    });
  } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
    videoElement.src = url;
    onReady?.();
  } else {
    onError?.({ message: 'HLS not supported in this browser.' });
  }
}

export function destroyHls() {
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
}

export function getHlsInstance() {
  return hlsInstance;
}

export function goToLive(videoElement) {
  if (!videoElement) return;
  if (hlsInstance) {
    const livePos = hlsInstance.liveSyncPosition;
    if (livePos != null) {
      videoElement.currentTime = livePos;
      videoElement.play().catch(() => {});
      return livePos;
    }
  }
  // Fallback: seek to end of seekable range
  if (videoElement.seekable.length > 0) {
    const end = videoElement.seekable.end(videoElement.seekable.length - 1);
    videoElement.currentTime = end;
    videoElement.play().catch(() => {});
    return end;
  }
  return null;
}
