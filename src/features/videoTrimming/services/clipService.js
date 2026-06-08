import { formatTime } from '../../../shared/utils/formatTime/timeFormat';


/**
 * Build a new clip object from the current editor state.
 * @param {{ clipName: string, selectedTag: string, inPoint: number, outPoint: number, duration: number }} params
 * @returns {object} clip
 */
export function createClip({ clipName, selectedTags, inPoint, outPoint, duration }) {


  return {
    id: Date.now(),
    name: clipName || 'Untitled Clip',
    tags: selectedTags,
    start: formatTime(inPoint * duration),
    end: formatTime(outPoint * duration),
   
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

