// features/auth/services/authService.js

import api from "../../../shared/services/axios";

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  const { token, user } = response.data;

  if (token) {
    localStorage.setItem("token", token);
  }

  return { token, user };
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
