import React from 'react';
import { Routes, useNavigate, Route, useLocation } from 'react-router-dom';
import LostPetForm from './LostPetForm';
import SpotPetForm from './SpotPetForm';

type LostPetFormState = {
  ownerName: string;
  petName: string;
  petType: string;
  lastSeenDate: string;
  description: string;
};

const NewShelters: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLostPetClick = () => {
    navigate('/shelterform/lost');
  };

  const handleSpotPetClick = () => {
    navigate('/shelterform/spot');
  };

  const handleBack = () => {
    navigate('/shelterform');
  };

  // Only show the initial content if we're at the base shelterform path
  const showInitialContent = location.pathname === '/shelterform';

  return (
    <>
      {showInitialContent ? (
        <div className="max-w-2xl mx-auto p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Search pets near San Jose, CA</h1>
            <h2 className="text-2xl mb-6">Add New Shelter</h2>
          </div>

          <div className="text-center space-x-4 mb-8">
            <button 
              onClick={handleLostPetClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              I Lost a Pet
            </button>
            <button 
              onClick={handleSpotPetClick}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              I Spot a Pet
            </button>
          </div>
        </div>
      ) : null}

      <Routes>
        <Route path="lost" element={<LostPetForm />} />
        <Route path="spot" element={<SpotPetForm />} />
      </Routes>
    </>
  );
};

export default NewShelters;
