import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Pet {
  _id: string;
  _userId: string;
  name: string;
  kind: string;
  color: string;
  status: "found" | "lost";
  location: string;
  picture: string;
  description: string;
}

interface ProfileState {
  pets: Pet[];
  user: {
    username: string;
    email: string;
    phone: string;
  } | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  pets: [
    {
      _id: "1",
      _userId: "1",
      name: "Catty",
      kind: "Cat",
      color: "Orange",
      status: "lost",
      location: "SF",
      picture: "",
      description: "Cute!!",
    },
    {
      _id: "2",
      _userId: "1",
      name: "Missy",
      kind: "Dog",
      color: "Brown",
      status: "found",
      location: "SF",
      picture: "",
      description: "Cute!!",
    },
  ],
  user: null,
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setPets: (state, action: PayloadAction<Pet[]>) => {
      state.pets = action.payload;
    },
    addPet: (state, action: PayloadAction<Pet>) => {
      state.pets.push(action.payload);
    },
    deletePet: (state, action: PayloadAction<string>) => {
      state.pets = state.pets.filter((pet) => pet._id !== action.payload);
    },
    setUser: (state, action: PayloadAction<ProfileState["user"]>) => {
      state.user = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setPets, addPet, deletePet, setUser, setError } =
  profileSlice.actions;
export default profileSlice.reducer;
