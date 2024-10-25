import React from 'react';
import { useNavigate } from 'react-router-dom';

const SpotPetForm: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Report Spotted Pet</h1>
        <button 
          onClick={handleBack}
          className="mb-6 text-blue-500 hover:text-blue-600"
        >
          ← Back to Main Page
        </button>
      </div>
      <div className="text-center">
        Spot a pet form coming11 soon...
      </div>
    </div>
  );
};

export default SpotPetForm;