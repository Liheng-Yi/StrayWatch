import React, { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './styles.css';
import PurpleButton from "../../Components/UI/lightPurpleButton";
import {getCurrentUserId} from "../../Components/UI/auth";

// TODO: fetch profile from database
const Profile: React.FC = () => {
  const {userId} = useParams();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [user, setUser] = useState<any>({
    username: "UserName",
    email: "aa@gmail.com",
    phone: "123456",
  });
  
  const [pets,setPets] = useState<any>([{name:"Catty",status:true,location:"SF",description:"Cute!!"},{name:"Missy",status:false,location:"SF",description:"Cute!!"}])
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");

  
  const currentUserId = getCurrentUserId();
  const API_URL = process.env.API_URL;

  const handleUpdateUsername = async () => {
    
    try {
      const response = await fetch(`/api/users/${userId || currentUserId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername })
      });
      
      if (response.ok) {
        setUser((prev:any )=> ({ ...prev, username: newUsername }));
        setIsEditing(false);
      } else {
        console.error('Failed to update username');
      }
    } catch (error) {
      console.error('Error updating username:', error);
    }
  };

  useEffect(() => {
    // Determine if viewing own profile or someone else's
    setIsOwnProfile(!userId || userId === currentUserId);
    
    // Fetch user data
    const fetchUserData = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch(`/api/users/${userId || currentUserId}`);
        const userData = await response.json();
        setUser(userData);
        if (userData.pets && userData.pets.length > 0) {
          const petPromises = userData.pets.map((petId: string) =>
            fetch(`/api/pets/${petId}`).then(res => res.json())
          );
          const petData = await Promise.all(petPromises);
          setPets(petData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    
    fetchUserData();
  }, [userId]);


  return (
    
    <div>
      <h2 className="color: #C5E0DC;--a: 45deg;--t:.15em"> <span>{isOwnProfile ? 'My Profile' : `${user.username}'s Profile`}</span></h2>
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
                    <PurpleButton onClick={handleUpdateUsername}>Save</PurpleButton>
                    <PurpleButton onClick={() => setIsEditing(false)}>Cancel</PurpleButton>
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
      <br/>
      <br/>

      <div className="d-flex align-items-center gap-3">
        <h2 className="color: #C5E0DC;--a: 45deg;--t:.15em mb-0"><span>Pets</span></h2>
        {isOwnProfile && (
          <PurpleButton onClick={() => navigate('/add-pet')}>
            Add Pet
          </PurpleButton>
        )}
      </div>
      <br/>
      

      {pets.map((pet: any, index: number) => (
        <div>
        <div className="card col-lg-8 mx-auto" key={index}>
          <div className="card-header">Pet Profile</div>
          <div className="card-body">
            <h5 className="card-title">{pet.name}</h5>
            <p className="card-text">{pet.location} , {pet.status}</p>
            <p className="card-text">{pet.description}</p>
            <br/>
            {pet.picture && (
              <img 
                src={pet.picture} 
                alt={`Photo of ${pet.name}`}
                className="img-fluid rounded"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            )}
          </div>
        </div>
        <br/>
        </div>
      ))}
      
    </div>
  );
};
export default Profile;