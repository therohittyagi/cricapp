import { createAsyncThunk } from "@reduxjs/toolkit";
import { initHls, destroyHls } from "./services/hlsService";
import { fetchMatchConfig, saveClipToServer, fetchClipsList } from "./services/videoService";

export const loadHlsThunk = createAsyncThunk(
  "video/loadHls",
  async (videoElement, { getState, rejectWithValue }) => {
    const { hlsUrl } = getState().video;

    if (!hlsUrl) {
      return rejectWithValue("No HLS URL available");
    }

    try {
      await new Promise((resolve, reject) => {
        initHls(videoElement, hlsUrl, {
          onReady: resolve,
          onError: reject,
        });
      });

      return true;
    } catch (error) {
      destroyHls();

      return rejectWithValue(error?.message || "Failed to load HLS");
    }
  },
);

export const fetchMatchConfigThunk = createAsyncThunk(
  "video/fetchMatchConfig",
  async (matchId, { rejectWithValue }) => {
    try {
      return await fetchMatchConfig(matchId);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch match config",
      );
    }
  },
);

export const saveClipThunk = createAsyncThunk(
  "video/saveClip",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { video } = getState();

      const { matchId, clipName, selectedTags, inPoint, outPoint, duration } =
        video;

      const payload = {
        match_id: matchId,
        tags: selectedTags,
        start_time: Math.floor(inPoint ?? 0),
        end_time: Math.floor(outPoint ?? 0),
        output_name: clipName,
      };

      return await saveClipToServer(payload);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to save clip",
      );
    }
  },
);

export const fetchClipsListThunk = createAsyncThunk(
  "video/fetchClipsList",
  async (matchId, { rejectWithValue }) => {
    try {
      return await fetchClipsList(matchId);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || "Failed to fetch clips"
      );
    }
  }
);

export const seekVideoThunk = (videoElement, time) => (dispatch, getState) => {
  const { duration } = getState().video;

  const safeTime = Math.max(0, Math.min(time, duration));

  if (videoElement) {
    videoElement.currentTime = safeTime;
  }
};

export const seekDeltaThunk = (videoElement, delta) => (dispatch, getState) => {
  const { currentTime } = getState().video;

  dispatch(seekVideoThunk(videoElement, currentTime + delta));
};

export const togglePlayThunk = (videoElement) => (dispatch, getState) => {
  const { isPlaying } = getState().video;

  if (!videoElement) return;

  if (isPlaying) {
    videoElement.pause();
  } else {
    videoElement.play().catch(() => {});
  }
};
