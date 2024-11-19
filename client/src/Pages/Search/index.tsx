import { useState } from 'react';
import './styles.css';
import FoundPets from './foundPets'
import SearchForm from './SearchForm'

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
    <div>
      <FoundPets />
      <h1>Find Lost Pets</h1>
      <SearchForm 
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Search;
