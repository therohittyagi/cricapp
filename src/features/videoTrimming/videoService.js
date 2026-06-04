const BASE_URL = import.meta.env.VITE_LIVE_API_URL || '/api';
/**
 * Fetch metadata for a video by id.
 * @param {string} videoId
 * @returns {Promise<object>}
 */
export async function fetchVideoMetadata(videoId) {
  const res = await fetch(`${BASE_URL}/videos/${videoId}`);
  if (!res.ok) throw new Error(`Failed to fetch video metadata: ${res.status}`);
  return res.json();
}

/**
 * Save a clip to the server.
 * @param {object} clip
 * @returns {Promise<object>} saved clip with server-assigned id
 */
export async function saveClipToServer(clip) {
  const res = await fetch(`${BASE_URL}/clips`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clip),
  });
  if (!res.ok) throw new Error(`Failed to save clip: ${res.status}`);
  return res.json();
}

/**
 * Fetch all saved clips for a given video.
 * @param {string} videoId
 * @returns {Promise<object[]>}
 */
export async function fetchClips(videoId) {
  const res = await fetch(`${BASE_URL}/videos/${videoId}/clips`);
  if (!res.ok) throw new Error(`Failed to fetch clips: ${res.status}`);
  return res.json();
}

/**
 * Delete a clip by id.
 * @param {number|string} clipId
 * @returns {Promise<void>}
 */
export async function deleteClip(clipId) {
  const res = await fetch(`${BASE_URL}/clips/${clipId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete clip: ${res.status}`);
}
