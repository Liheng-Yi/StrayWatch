import React from "react";
import { Routes, useNavigate, Route, useLocation } from "react-router-dom";
import LostPetForm from "./LostInfo";
import SpotPetForm from "./SpotPetForm";

type LostPetFormState = {
  ownerName: string;
  petName: string;
  petType: string;
  lastSeenDate: string;
  description: string;
};

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLostPetClick = () => {
    navigate("/home/lost");
  };

  const handleSpotPetClick = () => {
    navigate("/home/spot");
  };

  const handleBack = () => {
    navigate("/home");
  };

  // Only show the initial content if we're at the base home path
  const showInitialContent = location.pathname === "/home";

  return (
    <>
      {showInitialContent ? (
        <div className="main-page-text max-w-2xl mx-auto p-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-900 ">
              Don't worry, we are here to help!
            </h1>
            <h3
              className="text-2xl mb-6"
              style={{ color: "#4a2589", fontSize: "2.0rem" }}
            >
              Tell us about the lost pet
            </h3>
          </div>

          <div className="text-center mb-8 p-3">
            <button onClick={handleLostPetClick} className="lost-found-button">
              I Lost a Pet
            </button>
            <button onClick={handleSpotPetClick} className="lost-found-button">
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

export default Landing;
