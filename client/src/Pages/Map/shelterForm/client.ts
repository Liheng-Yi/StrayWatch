import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? process.env.REACT_APP_API_URL 
  : 'http://localhost:5000';

export interface ShelterFormData {
  shelterName: string;
  shelterAddress: string;
  shelterPhone: string;
  shelterEmail: string;
  shelterWebsite: string;
  location?: any
}

export const registerShelter = async (shelterData: ShelterFormData) => {
  try {
    const response = await axios.post(`${API_URL}/api/shelters`, shelterData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to register shelter');
    }
    throw error;
  }
};
