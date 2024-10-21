import React, { useState } from 'react';
import './styles.css';

// Define a type for the shelter form state
type ShelterFormState = {
  name: string;
  latitude: string;
  longitude: string;
};

const ShelterForm: React.FC = () => {
  const [shelter, setShelter] = useState<ShelterFormState>({
    name: '',
    latitude: '',
    longitude: ''
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setShelter(prevShelter => ({
      ...prevShelter,
      [name]: value
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Shelter Information:', shelter);
    // Here you could also make an API call to send the shelter data to your server
    alert('Shelter submitted! Check the console for details.');
  };

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <h1 className="mb-4">Search pets near San Jose, CA</h1>
        <h2>Add New Shelter</h2>
      </div>
      <div  style={{ textAlign: 'center', marginTop: '20px' }}>
        <button className="buttons-action-pet" style={{ marginRight: '10px' }}>I Lost a Pet</button>
        <button className="buttons-action-pet">I Spot a Pet</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Shelter Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={shelter.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="latitude">Latitude:</label>
          <input
            type="text"
            id="latitude"
            name="latitude"
            value={shelter.latitude}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="longitude">Longitude:</label>
          <input
            type="text"
            id="longitude"
            name="longitude"
            value={shelter.longitude}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit Shelter</button>
      </form>
    </div>
  );
};

export default ShelterForm;
