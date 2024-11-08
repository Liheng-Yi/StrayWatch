import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import {useDispatch} from 'react-redux';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBBtn,
  MDBCardText,
} from "mdb-react-ui-kit";
import axios from "axios";


/**
   @todo: read from databse to fufill image,username,location,bio,pet info
**/
const Profile = () => {
  const dispatch = useDispatch();
  const [user, setCurrentUser] = useState({id:"001"});
  const username = "olive";
  const [profile, setProfile] = useState<any>({});

  const updateProfile = async () => {
    const updatedProfile = {id:"001",email:"sss"};
    // dispatch(setCurrentUser(updateProfile));
  };


  useEffect(() => {
    axios
      .get(`/profile/${user.id}`)
      .then((response) => {
        setCurrentUser(response.data);
      }) 
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [username]);

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      <div className="page shadow">
        <div className="main-container shadow">
          <MDBContainer>
            <br />
            <MDBRow>
              <MDBCol sm={12} md={4}>
                <div className="container">
                  <img
                    src="./img.jpg"
                    alt="John"
                    style={{ width: "65%", borderRadius: "100%" }}
                  />
                  <br />
                  <button onClick = {updateProfile} className="btn btn-link p-0 text-decoration-underline"> Update Profile</button>
                </div>
              </MDBCol>

              <MDBCol>
                <div className="container">
                  <p> Username</p>
                  <p>San Francisco, CA</p>
                  {/* email and phone are invisible to other users */}
                  <p> email </p> 
                  <p> phone </p>
                </div>

                <hr />

                <MDBContainer>
                  <MDBRow>
                    <MDBCol sm={2} lg={2} md={2}>
                      <h6 className="m-4">Bio </h6>
                    </MDBCol>
                    <MDBCol>
                      <p className="bio">Hello, I am a cat person</p>
                    </MDBCol>
                  </MDBRow>
                </MDBContainer>
                <br />
                <br />
                <MDBContainer>
                  {/** @todo: get pet info and present as cards use map() */}
                  <MDBRow>
                    <MDBCard>
                      <MDBCardImage
                        src="https://mdbootstrap.com/img/new/standard/nature/184.webp"
                        position="top"
                        alt="..."
                      />
                      <MDBCardBody>
                        <MDBCardTitle>Pet Name</MDBCardTitle>
                        <MDBBtn href="#">Report Lost</MDBBtn>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBRow>
                </MDBContainer>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </div>
      </div>
    </div>
  );
};
export default Profile;
