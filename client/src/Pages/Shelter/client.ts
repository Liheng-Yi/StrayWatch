interface Pet {
    _id: string;
    name: string;
    kind: string;
    status: string;
    description: string;
    color: string;
    location: string;
    userId: string;
    lat: string;
    lng: string;
    picture: string;
    createdAt: string;
  }
  
  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.REACT_APP_API_URL
      : "http://localhost:5000";
  
  export const ShelterClient = {
    fetchPets: async (type: string): Promise<Pet[]> => {
      const response = await fetch(`${API_URL}/api/pets?type=${encodeURIComponent(type)}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
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
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error('Failed to update pet');
      }
      
      return response.json();
    },
  
    searchPets: async (searchQuery: string): Promise<Pet[]> => {
      const response = await fetch(
        `${API_URL}/api/pets/search?query=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Search error response:', errorText);
        throw new Error('Failed to search pets');
      }
      
      return response.json();
    },
  
    fetchUserPets: async (userId: string): Promise<Pet[]> => {
      try {
        const response = await fetch(`/api/pets/user/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user pets');
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching user pets:', error);
        throw error;
      }
    },
  
    getUserRole: async (userId: string): Promise<string> => {
      const response = await fetch(`/api/users/${userId}/role`);
      if (!response.ok) {
        throw new Error('Failed to fetch user role');
      }
      const data = await response.json();
      return data.role;
    },
  
    fetchShelterPets: async (shelterId: string): Promise<Pet[]> => {
      const response = await fetch(`${API_URL}/api/pets/shelter/${shelterId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch shelter pets');
      }
      return response.json();
    }
  };
  
  export type { Pet }; 