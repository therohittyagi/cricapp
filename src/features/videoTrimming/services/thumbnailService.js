/**
 * Capture a single video frame at `timeSeconds` and return a data URL.
 * @param {HTMLVideoElement} videoElement
 * @param {number} timeSeconds
 * @param {{ width?: number, height?: number }} options
 * @returns {Promise<string>} base64 data URL
 */
export function captureFrame(videoElement, timeSeconds, { width = 120, height = 68 } = {}) {
  return new Promise((resolve, reject) => {
    if (!videoElement) return reject(new Error('No video element provided'));

    const original = videoElement.currentTime;

    const onSeeked = () => {
      videoElement.removeEventListener('seeked', onSeeked);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, width, height);
        const dataURL = canvas.toDataURL('image/jpeg', 0.7);
        videoElement.currentTime = original;
        resolve(dataURL);
      } catch (err) {
        reject(err);
      }
    };

    videoElement.addEventListener('seeked', onSeeked);
    videoElement.currentTime = timeSeconds;
  });
}

/**
 * Generate an evenly-spaced array of thumbnail data URLs from a video.
 * @param {HTMLVideoElement} videoElement
 * @param {number} count   Number of thumbnails to generate
 * @param {number} duration  Total video duration in seconds
 * @returns {Promise<string[]>}
 */
export async function generateThumbnails(videoElement, count = 20, duration) {
  const thumbnails = [];
  const interval = duration / count;

  for (let i = 0; i < count; i++) {
    const time = i * interval;
    try {
      const dataURL = await captureFrame(videoElement, time);
      thumbnails.push({ id: i, src: dataURL, time });
    } catch {
      thumbnails.push({ id: i, src: null, time });
    }
  }

  return thumbnails;
}
