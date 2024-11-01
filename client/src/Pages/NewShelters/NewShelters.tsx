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
        <div className="main-page-text max-w-2xl mx-auto p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 ">Don't worry, we are here to help!</h1>
            <h2 className="text-2xl mb-6">Tell us about the lost pet</h2>
          </div>

          <div className="text-center mb-8 p-3">
            <button 
              onClick={handleLostPetClick}
              className="lost-found-button"
            >
              I Lost a Pet
            </button>
            <button 
              onClick={handleSpotPetClick}
              className="lost-found-button"
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