import { HLS_STREAM_URL } from '../../../shared/constants/events';

let hlsInstance = null;

/**
 * Dynamically load HLS.js from CDN then attach to a <video> element.
 * @param {HTMLVideoElement} videoElement
 * @param {object} callbacks
 * @param {Function} callbacks.onReady
 * @param {Function} callbacks.onError
 * @returns {Promise<void>}
 */
export async function initHls(videoElement, { onReady, onError } = {}) {
  if (!videoElement) return;

  const attach = () => {
    if (window.Hls?.isSupported()) {
      hlsInstance = new window.Hls({ enableWorker: false, lowLatencyMode: false });
      hlsInstance.loadSource(HLS_STREAM_URL);
      hlsInstance.attachMedia(videoElement);
      hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, () => onReady?.());
      hlsInstance.on(window.Hls.Events.ERROR, (_, data) => {
        if (data.fatal) onError?.(data);
      });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS (Safari)
      videoElement.src = HLS_STREAM_URL;
      onReady?.();
    } else {
      onError?.({ message: 'HLS not supported in this browser.' });
    }
  };

  if (window.Hls) {
    attach();
  } else {
    await loadHlsScript();
    attach();
  }
}

/**
 * Inject the HLS.js script tag and wait for it to load.
 */
function loadHlsScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.13/dist/hls.min.js';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Destroy the current HLS.js instance.
 */
export function destroyHls() {
  if (hlsInstance) {
    hlsInstance.destroy();
    hlsInstance = null;
  }
}

/**
 * Return the active HLS instance (for advanced usage).
 */
export function getHlsInstance() {
  return hlsInstance;
}
