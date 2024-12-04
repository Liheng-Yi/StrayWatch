import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";
import { useState, useEffect } from "react";
import { getCurrentUserId, getCurrentUser } from "../../Components/UI/auth";
import { ShelterClient, Pet } from "./client";
import PetUpdateModal from "../PetDatabase/PetUpdateModal";
import PetCards from './PetCards';
import ShelterList from '../Map/shelterList';

const Shelter = () => {
  const navigate = useNavigate();
  const [displayedPets, setDisplayedPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab] = useState("all");
  const [showEditButton, setShowEditButton] = useState(false);
  const [isShelter, setIsShelter] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [selectedShelterId, setSelectedShelterId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPets = async () => {
      try {
        const userId = getCurrentUserId();
        if (!userId) {
          navigate("/login");
          return;
        }
        const user = getCurrentUser();
        setIsShelter(user?.role === 'shelter');
        setIsAdminUser(user?.role === 'admin');
        
        if (user?.role === 'shelter') {
          const pets = await ShelterClient.fetchUserPets(userId);
          setDisplayedPets(pets);
          setShowEditButton(true);
        }
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

  const handleShelterClick = async (shelterId: string) => {
    try {
      const pets = await ShelterClient.fetchShelterPets(shelterId);
      setDisplayedPets(pets);
      setSelectedShelterId(shelterId);
    } catch (error) {
      console.error("Error fetching shelter's pets:", error);
    }
  };

  return (
    <div className="shelter-container">
      <div className="content-wrapper">
        <div className="left-content">
          <h1 className="dashboard-title">Shelter Dashboard</h1>
          <p className="subtitle">Help pets find their forever homes</p>

          <div className="action-buttons mt-3">
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

        <div className="images-grid hide-on-mobile">
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

      {isAdminUser ? (
        <>
          <h3 className="text-start mb-4">All Shelters</h3>
          <ShelterList 
            onShelterClick={handleShelterClick}
            onShelterUpdate={() => {}}
            userRole="admin"
          />
          {selectedShelterId && (
            <>
              <h3 className="text-start mb-4">Shelter Pets: {displayedPets.length}</h3>
              <PetCards
                pets={displayedPets}
                showEditButton={showEditButton}
                onDeletePet={handleDeletePet}
                onEditPet={(pet) => {
                  setSelectedPet(pet);
                  setShowUpdateModal(true);
                }}
              />
            </>
          )}
        </>
      ) : isShelter ? (
        <>
          <h3 className="text-start mb-4">Shelter Pets: {displayedPets.length}</h3>
          <PetCards
            pets={displayedPets}
            showEditButton={showEditButton}
            onDeletePet={handleDeletePet}
            onEditPet={(pet) => {
              setSelectedPet(pet);
              setShowUpdateModal(true);
            }}
          />
        </>
      ) : (
        <div className="text-center py-4 text-muted">
          Only shelter accounts can view and manage pets.
        </div>
      )}

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
