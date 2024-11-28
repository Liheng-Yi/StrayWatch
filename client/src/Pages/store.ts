import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Signin/reducer";

interface UserState {
  currentUser: any;
  isLoading: boolean;
  error: string | null;
}

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
