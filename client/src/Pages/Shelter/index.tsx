import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const Shelter = () => {
  const navigate = useNavigate();

  const handleAddPetClick = () => {
    navigate("/home/spot");
  };

  const handleNewShelterClick = () => {
    navigate("/map", { state: { openShelterForm: true } });
  };

  return (
    <div className="shelter-container">
      <div className="content-wrapper">
        <div className="left-content">
          <h1 className="dashboard-title">Shelter Dashboard</h1>
          <p className="subtitle">Help pets find their forever homes</p>

          <div className="action-buttons">
            <button onClick={handleAddPetClick} className="action-button">
              <span>🐾</span>
              Add Pet
            </button>
            <button onClick={handleNewShelterClick} className="action-button">
              <span>🔍</span>
              New Shelter
            </button>
          </div>
        </div>

        <div className="images-grid">
          <img
            src={`${process.env.PUBLIC_URL}/pic/shelterPage.jpg`}
            alt="Child hugging dog"
            className="feature-image"
          />
          <img
            src={`${process.env.PUBLIC_URL}/pic/shelterpage2.jpg`}
            alt="Shelter pets"
            className="feature-image"
          />
        </div>
      </div>
    </div>
  );
};

export default Shelter;
