// features/video/videoSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { DEFAULT_DURATION } from "../../shared/constants/events";
import {
  loadHlsThunk,
  saveClipThunk,
  fetchMatchConfigThunk,
  fetchClipsListThunk,
} from "./videoThunk";

const initialState = {
  // Match Data
  matchId: null,
  hlsUrl: null,
  matchConfig: null,

  // HLS / Playback
  hlsReady: false,
  isPlaying: false,
  currentTime: 0,
  duration: DEFAULT_DURATION,
  volume: 0.8,
  isMuted: false,

  // Clip Range
  inPoint: null,
  outPoint: null,

  // Dragging
  dragging: null,

  // Saved Clips
  clips: [],
  clipsTotal: 0,
  saveCounter: 0,

  // Form
  clipName: "sample.mp4",
  selectedTags: [],
  filterTag: "all",

  // Async State
  loading: false,
  error: null,
};

const videoSlice = createSlice({
  name: "video",

  initialState,

  reducers: {
    setIsPlaying(state, action) {
      state.isPlaying = action.payload;
    },

    setCurrentTime(state, action) {
      state.currentTime = action.payload;
    },

    setDuration(state, action) {
      state.duration = action.payload;
    },

    setVolume(state, action) {
      state.volume = action.payload;

      if (action.payload === 0) {
        state.isMuted = true;
      }
    },

    setIsMuted(state, action) {
      state.isMuted = action.payload;
    },

    setInPoint(state, action) {
      const max = state.outPoint != null ? state.outPoint - 1 : state.duration;
      state.inPoint = Math.max(0, Math.min(action.payload, max));
    },

    setOutPoint(state, action) {
      const min = state.inPoint != null ? state.inPoint + 1 : 0;
      state.outPoint = Math.max(min, Math.min(action.payload, state.duration));
    },

    setDragging(state, action) {
      state.dragging = action.payload;
    },

    setClipName(state, action) {
      state.clipName = action.payload;
    },

    toggleTag(state, action) {
      const tag = action.payload;

      const exists = state.selectedTags.includes(tag);

      if (exists) {
        state.selectedTags = state.selectedTags.filter((item) => item !== tag);
      } else {
        state.selectedTags.push(tag);
      }
    },

    setFilterTag(state, action) {
      state.filterTag = action.payload;
    },

    clearError(state) {
      state.error = null;
    },

    resetInOut(state) {
      state.inPoint = null;
      state.outPoint = null;
      state.selectedTags = [];
      state.clipName = "sample.mp4";
    },
  },

  extraReducers: (builder) => {
    builder

      /*
       * FETCH MATCH CONFIG
       */
      .addCase(fetchMatchConfigThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMatchConfigThunk.fulfilled, (state, action) => {
        state.loading = false;

        const cfg = action.payload?.data ?? action.payload ?? null;
        state.matchConfig = cfg;
        state.matchId  = cfg?.match_id || null;
        state.hlsUrl   = cfg?.output_hls_url || null;
        if (cfg?.standard_file_name) state.clipName = cfg.standard_file_name;
      })

      .addCase(fetchMatchConfigThunk.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || action.error.message;
      })

      /*
       * LOAD HLS
       */
      .addCase(loadHlsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loadHlsThunk.fulfilled, (state) => {
        state.loading = false;
        state.hlsReady = true;
      })

      .addCase(loadHlsThunk.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || action.error.message;
      })

      /*
       * SAVE CLIP
       */
      .addCase(saveClipThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(saveClipThunk.fulfilled, (state) => {
        state.loading = false;
        state.saveCounter += 1;

        // Reset form after save
        state.inPoint = null;
        state.outPoint = null;
        state.selectedTags = [];
        state.clipName = "sample.mp4";
      })

      .addCase(saveClipThunk.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload || action.error.message;
      })

      /*
       * FETCH CLIPS LIST
       */
      .addCase(fetchClipsListThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchClipsListThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.clips = action.payload?.results || [];
        state.clipsTotal = action.payload?.count || 0;
      })

      .addCase(fetchClipsListThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
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
  clearError,
  resetInOut,
} = videoSlice.actions;

/*
|--------------------------------------------------------------------------
| Selectors
|--------------------------------------------------------------------------
*/

export const selectMatchConfig = (state) => state.video.matchConfig;

export const selectMatchId = (state) => state.video.matchId;

export const selectHlsUrl = (state) => state.video.hlsUrl;

export const selectHlsReady = (state) => state.video.hlsReady;

export const selectIsPlaying = (state) => state.video.isPlaying;

export const selectCurrentTime = (state) => state.video.currentTime;

export const selectDuration = (state) => state.video.duration;

export const selectVolume = (state) => state.video.volume;

export const selectIsMuted = (state) => state.video.isMuted;

export const selectInPoint = (state) => state.video.inPoint;

export const selectOutPoint = (state) => state.video.outPoint;

export const selectDragging = (state) => state.video.dragging;

export const selectClips = (state) => state.video.clips;

export const selectClipsTotal = (state) => state.video.clipsTotal;

export const selectSaveCounter = (state) => state.video.saveCounter;

export const selectClipName = (state) => state.video.clipName;

export const selectSelectedTags = (state) => state.video.selectedTags;

export const selectFilterTag = (state) => state.video.filterTag;

export const selectLoading = (state) => state.video.loading;

export const selectError = (state) => state.video.error;

export default videoSlice.reducer;
