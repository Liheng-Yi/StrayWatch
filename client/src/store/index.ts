import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Pages/Signin/reducer";
import profileReducer from "../Pages/Profile/reducer";

export const store = configureStore({
  reducer: {
    user: userReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
