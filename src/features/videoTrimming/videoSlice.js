import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_DURATION } from '../../shared/constants/events';
import { loadHlsThunk, saveClipThunk, fetchMatchConfigThunk } from './videoThunk';

const initialState = {
  hlsUrl: null,

  // HLS / playback
  hlsReady: false,
  isPlaying: false,
  currentTime: 0,
  duration: DEFAULT_DURATION,
  volume: 0.8,
  isMuted: false,

  // Clip range (fractions 0–1), null = not yet selected
  inPoint: null,
  outPoint: null,

  // Dragging: null | 'playhead' | 'in' | 'out'
  dragging: null,

  // Clips
  clips: [],

  // Form
  clipName: 'cricketsample.mp4',
  selectedTags: [],
  filterTag: 'all',

  // Async status
  loading: false,
  error: null,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
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
      const minGap = state.duration > 0 ? 1 / state.duration : 0.001;
      const max = state.outPoint != null ? state.outPoint - minGap : 1;
      state.inPoint = Math.max(0, Math.min(payload, max));
    },
    setOutPoint(state, { payload }) {
      const minGap = state.duration > 0 ? 1 / state.duration : 0.001;
      const min = state.inPoint != null ? state.inPoint + minGap : 0;
      state.outPoint = Math.max(min, Math.min(payload, 1));
    },
    setDragging(state, { payload }) {
      state.dragging = payload;
    },
    setClipName(state, { payload }) {
      state.clipName = payload;
    },
    toggleTag(state, { payload }) {
      const idx = state.selectedTags.indexOf(payload);
      if (idx === -1) state.selectedTags.push(payload);
      else state.selectedTags.splice(idx, 1);
    },
    setFilterTag(state, { payload }) {
      state.filterTag = payload;
    },
    resetInOut(state) {
      state.inPoint = null;
      state.outPoint = null;
      state.selectedTags = [];
      state.clipName = 'cricketsample.mp4';
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

    // fetchMatchConfigThunk
    builder
      .addCase(fetchMatchConfigThunk.fulfilled, (state, { payload }) => {
        state.hlsUrl = payload.output_hls_url;
      })
      .addCase(fetchMatchConfigThunk.rejected, (state, { error }) => {
        state.error = error.message;
      });
  },
});

export const {
  setIsPlaying,
  setCurrentTime,
  setDuration,
  setVolume,
  setIsMuted,
  setInPoint,
  setOutPoint,
  setDragging,
  setClipName,
  toggleTag,
  setFilterTag,
  resetInOut,
} = videoSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

export const selectHlsUrl        = (s) => s.video.hlsUrl;
export const selectHlsReady      = (s) => s.video.hlsReady;
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
export const selectSelectedTags = (s) => s.video.selectedTags;
export const selectFilterTag    = (s) => s.video.filterTag;
export const selectLoading      = (s) => s.video.loading;

export default videoSlice.reducer;
