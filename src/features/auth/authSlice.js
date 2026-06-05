import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "./authApi";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

    builder
      .addMatcher(authApi.endpoints.getMe.matchPending, (state) => {
        state.isLoading = true;
      })

      .addMatcher(authApi.endpoints.getMe.matchFulfilled, (state) => {
        state.isAuthenticated = true;
        state.isLoading = false;
      })

      .addMatcher(authApi.endpoints.getMe.matchRejected, (state) => {
        state.isAuthenticated = false;
        state.isLoading = false;
      })

      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.isAuthenticated = false;
      });

  },
});

export default authSlice.reducer;

export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;