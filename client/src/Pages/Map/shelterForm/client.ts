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
  location?: any;
  verified: boolean;
  userId: string;
}

export const registerShelter = async (shelterData: ShelterFormData) => {
  try {
    // First register the shelter
    const shelterResponse = await axios.post(`${API_URL}/api/shelters`, shelterData);
    const newShelterId = shelterResponse.data.shelter._id;

    // Then update the user's shelters array
    await axios.patch(`${API_URL}/api/users/${shelterData.userId}`, {
      $push: { shelters: newShelterId }
    });

    return shelterResponse.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to register shelter');
    }
    throw error;
  }
};
