import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL 
  : 'http://localhost:5000';

export interface Shelter {
  _id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  verified: boolean;
}

export interface Pet {
  _id: string;
  name: string;
  kind: string;
  color: string;
  status: string;
  location: string;
  picture: string;
  description: string;
  shelterId: string;
}

export const ShelterClient = {
  fetchShelters: async (): Promise<Shelter[]> => {
    const response = await fetch(`${API_URL}/api/shelters`);
    if (!response.ok) throw new Error('Failed to fetch shelters');
    return response.json();
  },

  fetchShelterPets: async (shelterId: string): Promise<Pet[]> => {
    const response = await fetch(`${API_URL}/api/pets/shelter/${shelterId}`);
    if (!response.ok) throw new Error('Failed to fetch shelter pets');
    return response.json();
  },

  toggleVerification: async (shelterId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/shelters/${shelterId}/toggle-verification`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to update verification status');
  }
}; 