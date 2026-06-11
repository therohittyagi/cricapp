// features/video/services/videoService.js

import api from "../../../shared/services/axios";

export const fetchMatchConfig = async (matchId) => {
  const response = await api.get(
    `/configuration/get-modify-config/${matchId}/`,
  );

  return response.data;
};

export const saveClipToServer = async (payload) => {
  const response = await api.post("/clipping/hls-clip/", payload);

  return response.data;
};

export const fetchClipsList = async (matchId) => {
  const response = await api.get(`/clipping/hls-clip/get-list/${matchId}/`);
  return response.data;
};
