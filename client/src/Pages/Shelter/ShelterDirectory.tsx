import React from "react";
import { Pet } from "./types";

interface ShelterDirectoryProps {
  pets: Pet[];
  onEdit: (pet: Pet) => void;
  onDelete: (id: string) => void;
}

const ShelterDirectory: React.FC<ShelterDirectoryProps> = ({
  pets,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {pets.map((pet) => (
        <div key={pet._id} className="border rounded-lg p-4 shadow-md">
          <img
            src={pet.imageUrl}
            alt={pet.name}
            className="w-full h-48 object-cover rounded-md"
          />
          <h3 className="text-xl font-semibold mt-2">{pet.name}</h3>
          <p>Species: {pet.species}</p>
          <p>Breed: {pet.breed}</p>
          <p>Age: {pet.age}</p>
          <p>Description: {pet.description}</p>
          <div className="mt-4 space-x-2">
            <button onClick={() => onEdit(pet)} className="btn-primary">
              Edit
            </button>
            <button onClick={() => onDelete(pet._id)} className="btn-danger">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShelterDirectory;
