import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    userInfo: "",
    login: true,
    error: false,
    pending: false,
  },
  reducers: {
    loginStart: (state) => {
      state.login = false;
      state.pending = true;
    },
    loginSuccess: (state, action) => {
      state.userInfo = action.payload;
      state.login = true;
      state.error = false;
      state.pending = false;
    },
    loginFailed: (state) => {
      state.userInfo = "";
      state.login = false;
      state.error = true;
      state.pending = false;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});

export const { loginSuccess, loginStart, loginFailed, setUserInfo } =
  authSlice.actions;

export default authSlice.reducer;
