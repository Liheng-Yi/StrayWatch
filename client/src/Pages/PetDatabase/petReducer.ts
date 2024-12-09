import { Pet } from './clients';

export type PetAction = 
  | { type: 'SET_PETS'; payload: Pet[] }
  | { type: 'UPDATE_PET'; payload: Pet }
  | { type: 'DELETE_PET'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean };

export interface PetState {
  pets: Pet[];
  loading: boolean;
  error: string | null;
}

// Initial state
export const initialState: PetState = {
  pets: [],
  loading: true,
  error: null
};

export const petReducer = (state: PetState, action: PetAction): PetState => {
  switch (action.type) {
    case 'SET_PETS':
      return {
        ...state,
        pets: action.payload,
        loading: false,
        error: null
      };

    case 'UPDATE_PET':
      return {
        ...state,
        pets: state.pets.map(pet => 
          pet._id === action.payload._id ? action.payload : pet
        ),
        error: null
      };

    case 'DELETE_PET':
      return {
        ...state,
        pets: state.pets.filter(pet => pet._id !== action.payload),
        error: null
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };

    default:
      return state;
  }
}; 