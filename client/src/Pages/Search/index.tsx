import { useState } from 'react';
import './styles.css';
import FoundPets from './foundPets'

const Search = () => {
  const [searchParams, setSearchParams] = useState({
    species: '',
    breed: '',
    color: '',
    location: '',
    date: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Need search filter
    console.log('Search params:', searchParams);
  };

  return (
    <div className="search-container">
      <FoundPets />
      <h1>Find Lost Pets</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-field">
          <label htmlFor="species">Pet Type</label>
          <select 
            id="species"
            value={searchParams.species}
            onChange={(e) => setSearchParams({...searchParams, species: e.target.value})}
          >
            <option value="">All Types</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="search-field">
          <label htmlFor="breed">Breed</label>
          <input
            type="text"
            id="breed"
            placeholder="Enter breed"
            value={searchParams.breed}
            onChange={(e) => setSearchParams({...searchParams, breed: e.target.value})}
          />
        </div>

        <div className="search-field">
          <label htmlFor="color">Color</label>
          <input
            type="text"
            id="color"
            placeholder="Enter color(s)"
            value={searchParams.color}
            onChange={(e) => setSearchParams({...searchParams, color: e.target.value})}
          />
        </div>

        <div className="search-field">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            placeholder="Enter city or zip code"
            value={searchParams.location}
            onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
          />
        </div>

        <div className="search-field">
          <label htmlFor="date">Last Seen Date</label>
          <input
            type="date"
            id="date"
            value={searchParams.date}
            onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
          />
        </div>

        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
};

export default Search;
