import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import PurpleButton from "../../Components/UI/lightPurpleButton";
import { MapPin, Pencil, Share2 } from "lucide-react";
import { FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getCurrentUserId } from "../../Components/UI/auth";
import { ShelterClient, Pet } from "./client";
import PetUpdateModal from "../PetDatabase/PetUpdateModal";

const Shelter = () => {
  const navigate = useNavigate();
  const [displayedPets, setDisplayedPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab] = useState("all");
  const [showEditButton, setShowEditButton] = useState(false);

  useEffect(() => {
    const fetchUserPets = async () => {
      try {
        const userId = getCurrentUserId();
        if (!userId) {
          navigate("/login");
          return;
        }
        const pets = await ShelterClient.fetchUserPets(userId);
        setDisplayedPets(pets);
        setShowEditButton(true);
      } catch (error) {
        console.error("Error fetching user's pets:", error);
      }
    };

    fetchUserPets();
  }, [navigate]);

  const handleDeletePet = async (petId: string) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) {
      return;
    }
    
    try {
      await ShelterClient.deletePet(petId);
      setDisplayedPets(prev => prev.filter(pet => pet._id !== petId));
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  const handleUpdatePet = async (petId: string, data: FormData) => {
    try {
      const updatedPet = await ShelterClient.updatePet(petId, data);
      setDisplayedPets(prev => 
        prev.map(pet => pet._id === petId ? updatedPet : pet)
      );
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating pet:", error);
    }
  };

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

      <h3 className="text-start mb-4">Shelter Pets: {displayedPets.length}</h3>

      {/* Pet Cards Grid */}
      <div className="row row-cols-1 row-cols-md-2 g-4">
        {displayedPets.map((pet) => (
          <div key={pet._id} className="col">
            <div className="card h-100">
              <div className="row g-0">
                <div className="col-md-6">
                  <img
                    src={pet.picture || "/api/placeholder/400/320"}
                    alt={pet.name}
                    className="img-fluid h-100 w-100 object-fit-cover"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
                <div className="col-md-6">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5 className="card-title mb-1">{pet.name}</h5>
                        <small className="text-muted d-flex align-items-center">
                          <MapPin size={16} className="me-1" />
                          {pet.location}
                        </small>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className={`badge ${
                          pet.status === 'Lost' ? 'bg-danger' : 'bg-success'
                        }`}>
                          {pet.status}
                        </span>
                        {showEditButton && (
                          <>
                            <button
                              className="btn btn-link text-secondary p-0 border-0"
                              onClick={() => {
                                setSelectedPet(pet);
                                setShowUpdateModal(true);
                              }}
                              title="Edit pet"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="btn btn-link text-secondary p-0 border-0"
                              onClick={() => handleDeletePet(pet._id)}
                              title="Delete pet"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="mb-1"><strong>Type:</strong> {pet.kind}</p>
                      <p className="mb-1"><strong>Color:</strong> {pet.color}</p>
                      <p className="card-text small text-muted">
                        {pet.description}
                      </p>
                    </div>

                    <div className="d-flex gap-2">
                    <PurpleButton
                        variant="outline"
                        className="d-flex align-items-center"
                      >
                        <Share2 size={12} />
                        Share
                      </PurpleButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayedPets.length === 0 && (
        <div className="text-center py-4 text-muted">
          {searchQuery 
            ? `No pets found matching "${searchQuery}"`
            : `No ${activeTab === 'all' ? 'pets' : activeTab} found.`
          }
        </div>
      )}
  
      <PetUpdateModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onSubmit={handleUpdatePet}
        pet={selectedPet}
      />
    </div>
  );
};

export default Shelter;
