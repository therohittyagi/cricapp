/**
 * Format seconds into HH:MM:SS or MM:SS string.
 * @param {number} seconds
 * @returns {string}
 */
export function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/**
 * Clamp a value between lo and hi.
 */
export function clamp(value, lo, hi) {
  return Math.max(lo, Math.min(hi, value));
}

/**
 * Get fractional position [0,1] of clientX within a DOM element.
 */
export function getFractionFromMouseEvent(clientX, element) {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  return clamp((clientX - rect.left) / rect.width, 0, 1);
}
