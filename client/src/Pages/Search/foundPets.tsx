import { useState } from 'react';
import './styles.css';
import foundPetsData from "../../Database/foundPets.json";

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  color: string;
  location: string;
  dateFound: string;
  imageUrl: string;
  description: string;
  contactInfo: string;
}

const FoundPets: React.FC = () => {
  const [pets] = useState<Pet[]>(foundPetsData);

  return (
    <div className="found-pets-container">
      <h2>Found Pets</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {pets.map((pet) => (
          <div key={pet.id} className="pet-card ">
            <div className="pet-image">
              <img src={pet.imageUrl} alt={`${pet.species} - ${pet.breed}`} />
            </div>
            <div className="pet-info">
              <h3>{pet.species} - {pet.breed}</h3>
              <div className="pet-details">
                <p><strong>Name:</strong> {pet.name}</p>
                <p><strong>Color:</strong> {pet.color}</p>
                <p><strong>Location:</strong> {pet.location}</p>
                <p><strong>Found on:</strong> {new Date(pet.dateFound).toLocaleDateString()}</p>
                <p><strong>Description:</strong> {pet.description}</p>
                <p className="contact-info"><strong>Contact:</strong> {pet.contactInfo}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoundPets;
