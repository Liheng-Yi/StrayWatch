import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  username: string;
  role: "user" | "shelter" | "admin";
  phone: string;
  email: string;
  pets: string[];
}

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      return state;
    },
    logout: (state) => {
      state.currentUser = null;
      state.error = null;
    },
  },
});

const { actions, reducer } = userSlice;
export const { setUser, setLoading, setError, logout } = actions;
export default reducer;
