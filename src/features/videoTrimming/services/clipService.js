import { formatTime } from '../../../shared/utils/formatTime/timeFormat';
import { THUMB_COLORS } from '../../../shared/constants/tags';

/**
 * Build a new clip object from the current editor state.
 * @param {{ clipName: string, selectedTag: string, inPoint: number, outPoint: number, duration: number }} params
 * @returns {object} clip
 */
export function createClip({ clipName, selectedTag, inPoint, outPoint, duration }) {
  const randomThumb = THUMB_COLORS[Math.floor(Math.random() * THUMB_COLORS.length)];

  return {
    id: Date.now(),
    name: clipName || 'Untitled Clip',
    tags: [selectedTag],
    start: formatTime(inPoint * duration),
    end: formatTime(outPoint * duration),
    thumb: randomThumb,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Filter a list of clips by tag.
 * @param {object[]} clips
 * @param {string} filterTag  – 'all' returns everything
 * @returns {object[]}
 */
export function filterClips(clips, filterTag) {
  if (!filterTag || filterTag === 'all') return clips;
  return clips.filter((c) =>
    Array.isArray(c.tags) ? c.tags.includes(filterTag) : c.tag === filterTag
  );
}

/**
 * Sort clips by creation date descending (newest first).
 * @param {object[]} clips
 * @returns {object[]}
 */
export function sortClipsByNewest(clips) {
  return [...clips].sort((a, b) => b.id - a.id);
}

/**
 * Remove a clip by id.
 * @param {object[]} clips
 * @param {number} id
 * @returns {object[]}
 */
export function removeClip(clips, id) {
  return clips.filter((c) => c.id !== id);
}
