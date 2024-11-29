import React from 'react';
import { useNavigate } from 'react-router-dom';
import { APIProvider } from '@vis.gl/react-google-maps';
import PlaceAutocomplete from './LostForm';

const LostInfo = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
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
        <h1 className="text-3xl font-bold mb-4">Report Lost Pet</h1>

        <APIProvider
          apiKey={(() => {
            //console.log("API Key:", process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
            return process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? "";
          })()}
          solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
        >
          <div className="h-96 mb-6 rounded-lg overflow-hidden">
            <div className="m-2">
              <PlaceAutocomplete />
            </div>
          </div>
        </APIProvider>
      </div>
    </div>
  );
};

export default LostInfo;