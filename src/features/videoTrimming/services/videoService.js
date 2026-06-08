const BASE_URL = import.meta.env.VITE_LIVE_API_URL || '/api';

export async function fetchMatchConfig(matchId) {
  const res = await fetch(`${BASE_URL}/configuration/get-modify-config/${matchId}/`);
  if (!res.ok) throw new Error(`Failed to fetch match config: ${res.status}`);
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

