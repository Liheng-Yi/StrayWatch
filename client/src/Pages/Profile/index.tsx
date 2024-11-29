import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import PurpleButton from "../../Components/UI/lightPurpleButton";
import { getCurrentUserId } from "../../Components/UI/auth";
import { FaTrash } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setPets, deletePet } from "./reducer";

// TODO: fetch profile from database
const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [user, setUser] = useState<any>({
    username: "UserName",
    email: "aa@gmail.com",
    phone: "123456",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState<string>("");

  const currentUserId = getCurrentUserId();
  const API_URL = process.env.API_URL || "http://localhost:5000";

  const dispatch = useAppDispatch();
  const { pets } = useAppSelector((state) => state.profile);
  const { currentUser } = useAppSelector((state) => state.user);

  useEffect(() => {
    // Determine if viewing own profile or someone else's
    setIsOwnProfile(
      !userId || (currentUser && userId === currentUser._id) || false
    );

    // Fetch user data
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data for ID:", userId || currentUser?._id);
        const response = await fetch(
          `${API_URL}/api/profile/${userId || currentUser?._id}`
        );
        const userData = await response.json();
        console.log("Received user data:", userData);
        setUser(userData);

        // Only update pets if we get data from API
        const petsResponse = await fetch(
          `${API_URL}/api/pets/user/${userId || currentUser?._id}`
        );
        if (petsResponse.ok) {
          const petsData = await petsResponse.json();
          if (petsData && petsData.length > 0) {
            dispatch(setPets(petsData));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [userId, currentUser, dispatch]);

  const handleUpdateUsername = async () => {
    try {
      const response = await fetch(`/api/users/${userId || currentUserId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUsername }),
      });

      if (response.ok) {
        setUser((prev: any) => ({ ...prev, username: newUsername }));
        setIsEditing(false);
      } else {
        console.error("Failed to update username");
      }
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const handleDeletePet = async (petId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/pets/${petId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        dispatch(deletePet(petId));
      } else {
        console.error("Failed to delete pet");
      }
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  return (
    <div>
      <h2 className="color: #C5E0DC;--a: 45deg;--t:.15em">
        {" "}
        <span>
          {isOwnProfile ? "My Profile" : `${user.username}'s Profile`}
        </span>
      </h2>
      <div className="card col-lg-8 mx-auto">
        <div className="card-header">Profile</div>
        <div className="card-body">
          <h5 className="card-title">{user.username}</h5>
          {isOwnProfile && (
            <>
              {isEditing ? (
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control mb-2"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                  />
                  <PurpleButton onClick={handleUpdateUsername}>
                    Save
                  </PurpleButton>
                  <PurpleButton onClick={() => setIsEditing(false)}>
                    Cancel
                  </PurpleButton>
                </div>
              ) : (
                <PurpleButton
                  onClick={() => {
                    setNewUsername(user.username);
                    setIsEditing(true);
                  }}
                >
                  Change Username
                </PurpleButton>
              )}
            </>
          )}
          {isOwnProfile && (
            <>
              <p className="card-text">{user.email}</p>
              <p className="card-text">{user.phone}</p>
            </>
          )}
        </div>
      </div>
      <br />
      <br />

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
      <br />

      {pets.map((pet: any, index: number) => (
        <div>
          <div className="card col-lg-8 mx-auto" key={index}>
            <div className="card-header">Pet Profile</div>
            <div className="card-body">
              <h5 className="card-title">{pet.name}</h5>
              {isOwnProfile && (
                <button
                  className="btn btn-link text-danger p-0"
                  onClick={() => handleDeletePet(pet._id)}
                  title="Delete pet"
                >
                  <FaTrash />
                </button>
              )}
              <span
                className={`badge ${
                  pet.status === "Lost" ? "bg-danger" : "bg-success"
                }`}
              >
                {pet.status}
              </span>
              <p className="card-text">{pet.location} </p>
              <p className="card-text">{pet.description}</p>
              <br />
              {pet.picture && (
                <img
                  src={pet.picture}
                  alt={`Photo of ${pet.name}`}
                  className="img-fluid rounded"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              )}
            </div>
          </div>
          <br />
        </div>
      ))}
    </div>
  );
};
export default Profile;
