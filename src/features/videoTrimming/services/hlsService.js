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

