import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

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

      {pets.map((pet: any, index: number) => (
        <div>
        <div className="card col-lg-8 mx-auto" key={index}>
          <div className="card-header">Pet Profile</div>
          <div className="card-body">
            <h5 className="card-title">{pet.name}</h5>
            <p className="card-text">{pet.location} , {pet.status}</p>
            <p className="card-title">{pet.description}</p>
            <button className={`btn ${pet.status? "btn-danger":"btn-success"}`}> {pet.status? "Report Lost":"Report Found"}</button>
          </div>
        </div>
        <br/>
        </div>
      ))}
      
    </div>
  );
};
export default Profile;

//   return (
//     <div>
//       <link
//         rel="stylesheet"
//         href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
//       />
//       <div className="page shadow">
//         <div className="main-container shadow">
//           <MDBContainer>
//             <br />
//             <MDBRow>
//               <MDBCol sm={12} md={4}>
//                 <div className="container">
//                   <img
//                     src="./img.jpg"
//                     alt="John"
//                     style={{ width: "65%", borderRadius: "100%" }}
//                   />
//                   <br />
//                 </div>
//               </MDBCol>

//               <MDBCol>
//                 <div className="container">
//                   <p> Username</p>
//                   <p>San Francisco, CA</p>
//                 </div>

//                 <hr />

//                 <MDBContainer>
//                   <MDBRow>
//                     <MDBCol sm={2} lg={2} md={2}>
//                       <h6 className="m-4">Bio </h6>
//                     </MDBCol>
//                     <MDBCol>
//                       <p className="bio">Hello, I am a cat person</p>
//                     </MDBCol>
//                   </MDBRow>
//                 </MDBContainer>
//                 <br />
//                 <br />
//                 <MDBContainer>
//                   {/** @todo: get pet info and present as cards use map() */}
//                   <MDBRow>
//                     <MDBCard>
//                       <MDBCardImage
//                         src="https://mdbootstrap.com/img/new/standard/nature/184.webp"
//                         position="top"
//                         alt="..."
//                       />
//                       <MDBCardBody>
//                         <MDBCardTitle>Pet Name</MDBCardTitle>
//                         <MDBBtn href="#">Report Lost</MDBBtn>
//                       </MDBCardBody>
//                     </MDBCard>
//                   </MDBRow>
//                 </MDBContainer>
//               </MDBCol>
//             </MDBRow>
//           </MDBContainer>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default Profile;
