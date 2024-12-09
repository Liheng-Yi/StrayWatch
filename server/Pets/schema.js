import { ObjectId } from 'mongodb';

export const petSchema = {
  name: String,
  kind: String,
  color: String,
  status: String,
  location: String,
  description: String,
  userId: ObjectId,
  picture: String,
  createdAt: Date
};

export const validatePet = (petData, file) => {
  const validatedData = {
    ...petData,
    userId: new ObjectId(petData.userId),
    picture: file ? file.location : null,
    createdAt: new Date()
  };

  return validatedData;
};

export const validateUpdateData = (updateData, file) => {
  const validatedUpdate = {
    name: updateData.name,
    kind: updateData.kind,
    color: updateData.color,
    status: updateData.status,
    location: updateData.location,
    description: updateData.description
  };

  if (file) {
    validatedUpdate.picture = file.location;
  }

  return validatedUpdate;
}; 