interface Pet {
  _id: string;
  color: string;
  name: string;
  kind: string;
  status: string;
  location: string;
  picture: string;
  description: string;
}

const API_URL = process.env.NODE_ENV === 'production' 
  ? process.env.API_URL 
  : 'http://localhost:5000';

export const PetClient = {
  fetchPets: async (type: string): Promise<Pet[]> => {
    const response = await fetch(`${API_URL}/api/pets?type=${type}`);
    if (!response.ok) throw new Error('Failed to fetch pets');
    return response.json();
  },

  deletePet: async (petId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/pets/${petId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete pet');
    }
  },

  updatePet: async (petId: string, petData: FormData): Promise<Pet> => {
    const response = await fetch(`${API_URL}/api/pets/${petId}`, {
      method: 'PUT',
      body: petData,
      credentials: 'include'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error('Failed to update pet');
    }
    
    return response.json();
  }
};

export type { Pet }; 