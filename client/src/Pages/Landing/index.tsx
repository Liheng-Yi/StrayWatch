import React, { useState, useEffect } from "react";
import { Routes, useNavigate, Route, useLocation } from "react-router-dom";
import LostPetForm from "./LostInfo";
import SpotPetForm from "./SpotPetForm";
import { PawPrint, Search } from "lucide-react";
import Map from "./Map";

interface Pet {
  _id: string;
  color: string;
  name: string;
  kind: string;
  status: string;
  location: string;
  picture: string;
  description: string;
  lat: string;
  lng: string;
}

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showInitialContent = location.pathname === "/home";
  const [pets, setPets] = useState<Pet[]>([]);
  const API_URL = process.env.NODE_ENV === 'production' 
    ? process.env.API_URL 
    : 'http://localhost:5000';

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch(`${API_URL}/api/pets?type=all`);
        if (!response.ok) throw new Error('Failed to fetch pets');
        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };
    fetchPets();
  }, []);

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
                  className="lost-found-button d-flex align-items-center justify-content-center gap-2"
                >
                  <PawPrint size={24} />I Lost a Pet
                </button>
                <button
                  onClick={handleSpotPetClick}
                  className="lost-found-button d-flex align-items-center justify-content-center gap-2"
                  style={{
                    backgroundColor: "transparent",
                    border: "2px solid #7758aa",
                    color: "#7758aa",
                  }}
                >
                  <Search size={24} />I Spot a Pet
                </button>
              </div>
            </div>
          </div>
          
          {/* Map Component */}
          <Map pets={pets} />
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
