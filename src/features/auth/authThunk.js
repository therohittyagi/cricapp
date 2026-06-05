// features/auth/authThunk.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, logoutUser } from "./services/authService";

export const login = createAsyncThunk(
  "user-management/login/",
  async (credentials, thunkAPI) => {
    try {
      return await loginUser(credentials);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      logoutUser();
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue("Logout failed");
    }
  }
);