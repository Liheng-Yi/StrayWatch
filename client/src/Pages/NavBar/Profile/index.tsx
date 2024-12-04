import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import PurpleButton from "../../../Components/UI/lightPurpleButton";
import { getCurrentUserId } from "../../../Components/UI/auth";
import { FaTrash } from "react-icons/fa";

// TODO: fetch profile from database
const Profile: React.FC = () => {
  const { userId } = useParams();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [user, setUser] = useState<any>({
    username: "UserName",
    email: "aa@gmail.com",
    phone: "123456",
  });


  const [pets, setPets] = useState<any>([]);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone,setNewPhone] = useState("");
  const [error, setError] = useState<string>("");

  const currentUserId = getCurrentUserId();
  const API_URL = process.env.API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchUserPets = async () => {
      try {
        const targetId = userId || currentUserId;
        const response = await fetch(`${API_URL}/api/pets/user/${targetId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch pets");
        }

        console.log("fetchPets",response);
        const data = await response.json();
        setPets(data);
      } catch (error) {
        console.error("Error fetching pets:", error);
        setError("Failed to load pets");
      }
    };
    fetchUserPets();
  }, [API_URL]);

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`/api/users/${userId || currentUserId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUsername,email:newEmail,phone:newPhone }),
      });

      if (response.ok) {
        setUser((prev: any) => ({ ...prev, username: newUsername,email:newEmail,phone:newPhone }));
        setIsEditing(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleDeletePet = async (petId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/pets/${petId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setPets(pets.filter((pet: any) => pet._id !== petId));
      } else {
        console.error("Failed to delete pet");
      }
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  // fetch user and pets data for profile
  useEffect(() => {
    // Determine if viewing own profile or someone else's
    setIsOwnProfile(!userId || userId === currentUserId);

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/profile/${userId || currentUserId}`);
        const userData = await response.json();
        console.log("userData", userData);
        setUser(userData);
        if (userData.pets && userData.pets.length > 0) {
          const petPromises = userData.pets.map((petId: string) =>
            fetch(`/api/pets/${petId}`).then((res) => res.json())
          );
          const petData = await Promise.all(petPromises);
          setPets(petData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    
       
    <div className="profile-container">
      <div className="col-lg-8 mx-auto">
      <h2 className="color: #C5E0DC;--a: 45deg;--t:.15em">
        <span>{isOwnProfile ? 'My Profile' : `${user.username}'s Profile`}</span>
      </h2>
    </div>
    <br/>
      <div className="col-lg-8 mx-auto">
      <div className="pet-card">
        <div className="pet-card__content">
          <div className="pet-card__header">
            <h5 className="pet-card__title">{user.username}</h5>
            {isOwnProfile && !isEditing && (
              <PurpleButton
                onClick={() => {
                  setNewUsername(user.username);
                  setIsEditing(true);
                }}
              >
                update profile
              </PurpleButton>
            )}
          </div>
          
          {isEditing ? (
            <div className="mb-3">
              <input
                type="text"
                className="form-control mb-2"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder={user.username}
              />
              <input
              type="email"
              className="form-control mb-2"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder= {user.email}
              />
              <input
              type="text"
              className="form-control mb-2"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder={user.phone}
              />
              <div className="d-flex gap-2">
                <PurpleButton onClick={handleUpdateProfile}>
                  Save
                </PurpleButton>
                <PurpleButton onClick={() => setIsEditing(false)}>
                  Cancel
                </PurpleButton>
              </div>
            </div>
          ) : (
            isOwnProfile && (
              <>
                <p className="pet-card__description">📧 Email: {user.email}</p>
                <p className="pet-card__description">📱 Phone: {user.phone}</p>
              </>
            )
          )}
        </div>
      </div>
    </div>

    <br />
    <br />

      <div className="col-lg-8 mx-auto">
        <div className="d-flex align-items-center gap-3">
          <h2 className="color: #C5E0DC;--a: 45deg;--t:.15em mb-0">
            <span>Pets</span>
          </h2>
          {isOwnProfile && (
            <PurpleButton onClick={() => navigate("/add-pet")}>
              Add Pet
            </PurpleButton>
          )}
        </div>
      </div>
      <br />

      <div className="container">
        {pets.map((pet: any, index: number) => (
          <div className="pet-card col-lg-8 mx-auto" key={index}>
            {pet.picture && (
              <img
                src={pet.picture}
                alt={`Photo of ${pet.name}`}
                className="pet-card__image"
              />
            )}
            <div className="pet-card__content">
              <div className="pet-card__header">
                <h5 className="pet-card__title">{pet.name}</h5>
                <div className="d-flex align-items-center">
                  <span
                    className={`badge ${
                      pet.status === "Lost" ? "bg-danger" : "bg-success"
                    } pet-card__status`}
                  >
                    {pet.status}
                  </span>
                  {isOwnProfile && (
                    <button
                      className="delete-button"
                      onClick={() => handleDeletePet(pet._id)}
                      title="Delete pet"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
              <p className="pet-card__location">📍 {pet.location}</p>
              <p className="pet-card__description">{pet.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Profile;
