import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import dataReducer from "./dataSlice";
import commonReducer from "./commonSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
    data: dataReducer,
    common: commonReducer,
  },
});
