export interface Pet {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  description: string;
  imageUrl: string;
}

export interface Shelter {
  _id: string;
  name: string;
  address: string;
  contact: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description?: string;
}
