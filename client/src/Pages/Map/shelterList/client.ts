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
    try {
      const response = await axios.get(`${API_URL}/api/shelters`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch shelters');
      }
      throw error;
    }
  },

  fetchShelterPets: async (shelterId: string): Promise<Pet[]> => {
    try {
      const response = await axios.get(`${API_URL}/api/pets/shelter/${shelterId}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch shelter pets');
      }
      throw error;
    }
  },

  toggleVerification: async (shelterId: string): Promise<void> => {
    try {
      await axios.patch(`${API_URL}/api/shelters/${shelterId}/toggle-verification`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update verification status');
      }
      throw error;
    }
  },

  deleteShelter: async (shelterId: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/api/shelters/${shelterId}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to delete shelter');
      }
      throw error;
    }
  }
}; 