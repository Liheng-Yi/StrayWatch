import { ObjectId } from 'mongodb';

export const shelterSchema = {
  name: String,
  address: String,
  phone: String,
  email: String,
  website: String,
  location: {
    type: String,
    coordinates: Array
  },
  pets: Array,
  userId: ObjectId,
  verified: Boolean
};

export const validateShelter = (shelter) => {
  if (!shelter.name || !shelter.address) {
    throw new Error('Name and address are required');
  }
  
  return {
    name: shelter.shelterName,
    address: shelter.shelterAddress,
    phone: shelter.shelterPhone || null,
    email: shelter.shelterEmail || null,
    website: shelter.shelterWebsite || null,
    location: shelter.location ? {
      type: "Point",
      coordinates: shelter.location.coordinates
    } : null,
    pets: [],
    userId: null,
    verified: false
  };
}; 