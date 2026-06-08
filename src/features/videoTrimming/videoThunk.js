import { createAsyncThunk } from '@reduxjs/toolkit';
import { initHls, destroyHls } from './services/hlsService';
import { createClip } from './services/clipService';
import { saveClipToServer, fetchMatchConfig } from './services/videoService';

/**
 * Load the HLS stream and attach it to a video element.
 * The videoElement is passed via the thunk argument so it stays out of Redux state.
 */
export const loadHlsThunk = createAsyncThunk(
  'video/loadHls',
  async (videoElement, { getState, rejectWithValue }) => {
    const { hlsUrl } = getState().video;
    if (!hlsUrl) return rejectWithValue('No HLS URL available');
    try {
      await new Promise((resolve, reject) => {
        initHls(videoElement, hlsUrl, { onReady: resolve, onError: reject });
      });
      return true;
    } catch (err) {
      destroyHls();
      return rejectWithValue(err?.message || 'HLS failed to load');
    }
  }
);

export const fetchMatchConfigThunk = createAsyncThunk(
  'video/fetchMatchConfig',
  async (matchId, { rejectWithValue }) => {
    try {
      const res = await fetchMatchConfig(matchId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Build a new clip from the current editor state, optionally persist it to
 * the server, and return the clip object to be added to the Redux store.
 */
export const saveClipThunk = createAsyncThunk(
  'video/saveClip',
  async (_, { getState, rejectWithValue }) => {
    const { video } = getState();
    const { clipName, selectedTags, inPoint, outPoint, duration } = video;

    const clip = createClip({ clipName, selectedTags, inPoint, outPoint, duration });

    try {
      // Attempt server save; fall back to local-only if the API is unavailable.
      const saved = await saveClipToServer(clip).catch(() => clip);
      return saved;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/**
 * Seek the video to a specific time.
 * This is a plain thunk (not createAsyncThunk) since seeking is synchronous.
 * @param {HTMLVideoElement} videoElement
 * @param {number} time  seconds
 */
export const seekVideoThunk = (videoElement, time) => (dispatch, getState) => {
  const { duration } = getState().video;
  const safeTime = Math.max(0, Math.min(time, duration));
  if (videoElement) videoElement.currentTime = safeTime;
  // currentTime will update via the timeupdate listener in HlsPlayer
};

/**
 * Seek by a relative delta (e.g. +10 or -10 seconds).
 * @param {HTMLVideoElement} videoElement
 * @param {number} delta
 */
export const seekDeltaThunk = (videoElement, delta) => (dispatch, getState) => {
  const { currentTime } = getState().video;
  dispatch(seekVideoThunk(videoElement, currentTime + delta));
};

/**
 * Toggle play/pause.
 * @param {HTMLVideoElement} videoElement
 */
export const togglePlayThunk = (videoElement) => (dispatch, getState) => {
  const { isPlaying } = getState().video;
  if (!videoElement) return;
  isPlaying ? videoElement.pause() : videoElement.play().catch(() => {});
};
