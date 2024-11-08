import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './styles.css';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>({
    username: "UserName",
    email: "aa@gmail.com",
    phone: "123456",
  });

  const [pets,setPets] = useState<any>([{name:"Catty",status:true,location:"SF",description:"Cute!!"},{name:"Missy",status:false,location:"SF",description:"Cute!!"}])
  console.log(pets);
  const navigate = useNavigate();

  return (
    
    <div>
      <h2 className="color: #C5E0DC;--a: 45deg;--t:.15em"><span>User Profile</span></h2>
      <div className="card col-lg-8 mx-auto">
        <div className="card-header">Profile</div>
        <div className="card-body">
          <h5 className="card-title">{user.username}</h5>
          <p className="card-text">{user.email}</p>
          <p className="card-text">{user.phone}</p>
        </div>
      </div>
      <br/>
      <br/>

      <h2 className="color: #C5E0DC;--a: 45deg;--t:.15em"><span>Pets</span></h2>
      

      {pets.map((pet: any, index: number) => (
        <div>
        <div className="card col-lg-8 mx-auto" key={index}>
          <div className="card-header">Pet Profile</div>
          <div className="card-body">
            <h5 className="card-title">{pet.name}</h5>
            <p className="card-text">{pet.location} , {pet.status}</p>
            <p className="card-text">{pet.description}</p>
            <br/>
            <button className={`btn ${pet.status? "report-lost-button":"report-found-button"}`}> {pet.status? "Report Lost":"Report Found"}</button>
          </div>
        </div>
        <br/>
        </div>
      ))}
      
    </div>
  );
};
export default Profile;