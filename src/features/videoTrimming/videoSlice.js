import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_CLIPS } from '../../shared/constants/tags';
import { DEFAULT_DURATION } from '../../shared/constants/events';
import { loadHlsThunk, saveClipThunk } from './videoThunk';

const initialState = {
  // HLS / playback
  hlsReady: false,
  isPlaying: false,
  currentTime: 0,
  duration: DEFAULT_DURATION,
  volume: 0.8,
  isMuted: false,

  // Clip range (fractions 0–1)
  inPoint: 0.13,
  outPoint: 0.46,

  // Dragging: null | 'playhead' | 'in' | 'out'
  dragging: null,

  // Clips
  clips: INITIAL_CLIPS,

  // Form
  clipName: 'cricketsample.mp4',
  selectedTag: 'Fours',
  filterTag: 'all',

  // Async status
  loading: false,
  error: null,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setHlsReady(state, { payload }) {
      state.hlsReady = payload;
    },
    setIsPlaying(state, { payload }) {
      state.isPlaying = payload;
    },
    setCurrentTime(state, { payload }) {
      state.currentTime = payload;
    },
    setDuration(state, { payload }) {
      state.duration = payload;
    },
    setVolume(state, { payload }) {
      state.volume = payload;
      if (payload === 0) state.isMuted = true;
    },
    setIsMuted(state, { payload }) {
      state.isMuted = payload;
    },
    setInPoint(state, { payload }) {
      state.inPoint = Math.max(0, Math.min(payload, state.outPoint - 0.02));
    },
    setOutPoint(state, { payload }) {
      state.outPoint = Math.max(state.inPoint + 0.02, Math.min(payload, 1));
    },
    setDragging(state, { payload }) {
      state.dragging = payload; // null | 'playhead' | 'in' | 'out'
    },
    addClip(state, { payload }) {
      state.clips.unshift(payload);
    },
    removeClip(state, { payload: id }) {
      state.clips = state.clips.filter((c) => c.id !== id);
    },
    setClipName(state, { payload }) {
      state.clipName = payload;
    },
    setSelectedTag(state, { payload }) {
      state.selectedTag = payload;
    },
    setFilterTag(state, { payload }) {
      state.filterTag = payload;
    },
  },
  extraReducers: (builder) => {
    // loadHlsThunk
    builder
      .addCase(loadHlsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadHlsThunk.fulfilled, (state) => {
        state.hlsReady = true;
        state.loading = false;
      })
      .addCase(loadHlsThunk.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      });

    // saveClipThunk
    builder
      .addCase(saveClipThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveClipThunk.fulfilled, (state, { payload }) => {
        state.clips.unshift(payload);
        state.loading = false;
      })
      .addCase(saveClipThunk.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
      });
  },
});

export const {
  setHlsReady,
  setIsPlaying,
  setCurrentTime,
  setDuration,
  setVolume,
  setIsMuted,
  setInPoint,
  setOutPoint,
  setDragging,
  addClip,
  removeClip,
  setClipName,
  setSelectedTag,
  setFilterTag,
} = videoSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

export const selectHlsReady     = (s) => s.video.hlsReady;
export const selectIsPlaying    = (s) => s.video.isPlaying;
export const selectCurrentTime  = (s) => s.video.currentTime;
export const selectDuration     = (s) => s.video.duration;
export const selectVolume       = (s) => s.video.volume;
export const selectIsMuted      = (s) => s.video.isMuted;
export const selectInPoint      = (s) => s.video.inPoint;
export const selectOutPoint     = (s) => s.video.outPoint;
export const selectDragging     = (s) => s.video.dragging;
export const selectClips        = (s) => s.video.clips;
export const selectClipName     = (s) => s.video.clipName;
export const selectSelectedTag  = (s) => s.video.selectedTag;
export const selectFilterTag    = (s) => s.video.filterTag;
export const selectLoading      = (s) => s.video.loading;

export default videoSlice.reducer;
