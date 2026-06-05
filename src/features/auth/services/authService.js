import api from "../../../shared/services/axios";

export const loginUser = async (credentials) => {
  const response = await api.post("user-management/login/", credentials);

  const { access, refresh, user } = response.data.data;

  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
  localStorage.setItem("auth_user", JSON.stringify(user));

  return { accessToken: access, refreshToken: refresh, user };
};

export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("auth_user");
};
