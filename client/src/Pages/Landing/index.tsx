import React from "react";
import { Routes, useNavigate, Route, useLocation } from "react-router-dom";
import LostPetForm from "./LostInfo";
import SpotPetForm from "./SpotPetForm";
import { PawPrint, Search } from "lucide-react";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showInitialContent = location.pathname === "/home";

  const handleLostPetClick = () => {
    navigate("/home/lost");
  };

  const handleSpotPetClick = () => {
    navigate("/home/spot");
  };

  return (
    <>
      {showInitialContent ? (
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 text-center">
              <h1 className="display-5 fw-bold mb-4">
                Don't worry, we are here to help!
              </h1>
              <h3 className="h4 mb-5" style={{ color: "#4a2589" }}>
                Tell us about the lost pet
              </h3>

              <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                <button
                  onClick={handleLostPetClick}
                  className="btn btn-primary btn-lg px-4 py-3 d-flex align-items-center justify-content-center gap-2"
                >
                  <PawPrint size={24} />I Lost a Pet
                </button>
                <button
                  onClick={handleSpotPetClick}
                  className="btn btn-outline-primary btn-lg px-4 py-3 d-flex align-items-center justify-content-center gap-2"
                >
                  <Search size={24} />I Spot a Pet
                </button>
              </div>
            </div>
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
