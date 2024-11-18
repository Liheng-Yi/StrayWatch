import { useState } from 'react';
import './styles.css';

interface Pet {
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
  const [pets] = useState<Pet[]>([
    {
      id: '1',
      name: 'Unknown',
      species: 'Dog',
      breed: 'Golden Retriever',
      color: 'Golden',
      location: 'Boston, MA',
      dateFound: '2024-03-15',
      imageUrl: 'https://placeholder.com/300x200',
      description: 'Found near Central Park. Friendly and wearing a red collar.',
      contactInfo: 'John Doe: 555-0123'
    },
  ]);

  return (
    <div className="found-pets-container">
      <h2>Found Pets</h2>
      <div className="pets-grid">
        {pets.map((pet) => (
          <div key={pet.id} className="pet-card">
            <div className="pet-image">
              <img src={pet.imageUrl} alt={`${pet.species} - ${pet.breed}`} />
            </div>
            <div className="pet-info">
              <h3>{pet.species} - {pet.breed}</h3>
              <div className="pet-details">
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
