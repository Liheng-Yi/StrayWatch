import React from "react";
import { useNavigate } from "react-router-dom";

const NewShelterButton: React.FC = () => {
  const navigate = useNavigate();

  const handleNewShelter = () => {
    navigate("/map/shelterForm");
  };

  return (
    <button
      onClick={handleNewShelter}
      className="bg-white text-black px-6 py-2 border-2 border-black hover:bg-gray-100 transition-colors"
    >
      New Shelter
    </button>
  );
};

export default NewShelterButton;
