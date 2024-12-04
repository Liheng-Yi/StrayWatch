import React, { useState,useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIProvider,useMapsLibrary } from '@vis.gl/react-google-maps';
import { getCurrentUserId } from "../../../Components/UI/auth";
import PetProfileComplete from './PetProfileComplete';

const AddPet = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate('/profile');
  };

  return (
    <div>
      <button 
        onClick={handleBack}
        className="btn btn-link d-flex align-items-center text-primary ps-0 mb-4"
      >
        <span className="me-2">←</span>
        Back to Main Page
      </button>
      
      <div className="text-center max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Record My Pet</h1>

        <APIProvider
          apiKey={(() => {
            return process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? "";
          })()}
          solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
        >
          <div className="h-96 mb-6 rounded-lg overflow-hidden">
            <div className="m-2">
              < PetProfileComplete/>
            </div>
          </div>
        </APIProvider>
      </div>
    </div>
  );
}

export default AddPet;