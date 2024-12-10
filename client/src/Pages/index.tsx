import { Routes, Route, Navigate, Link } from "react-router-dom";
import { UserCircle, PawPrint } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import PurpleButton from "../Components/UI/lightPurpleButton";
import Map from "./Map";
import Landing from "./Landing";
import SignIn from "./NavBar/Signin/signin";
import SignUp from "./NavBar/Signin/signup";
import Profile from "./NavBar/Profile/index";
import AddPet from "./NavBar/Profile/AddPet";
import PetSearch from "./PetDatabase";
import Shelter from "./Shelter";
import "./styles.css";
import { logout } from "./NavBar/Signin/reducer";
import PetDetails from './PetDatabase/details';

export default function MainPage() {
  const currentUser = useAppSelector((state: any) => state.user.currentUser);
  const dispatch = useAppDispatch();

  console.log("--currentUser", currentUser);
  const handleSignOut = () => {
    dispatch(logout());
    localStorage.removeItem("currentUser");
    window.location.href = "/home";
  };

  const teamMembers = [
    { name: "Liheng Yi", section: "2" },
    { name: "Chenyang Li", section: "2" },
    { name: "Linyan Fu", section: "1" },
    { name: "Chengxu Lan", section: "1" }
  ];

  return (
    <div
      id="wd-mainpage"
      className="min-vh-100 d-flex flex-column main-container"
    >
      <div className="background-decorations">
        <div className="paw-pattern-overlay"></div>
      </div>

      <nav className="navbar navbar-expand-lg navbar-light custom-bg shadow-sm">
        <div className="container-fluid py-2">
          {/* Brand/Home - Now in its own div */}
          <div className="navbar-brand-container">
            <Link
              className="navbar-brand fw-bold custom-nav-link"
              to="/home"
              style={{
                fontSize: "1.3rem",
                color: "#4a2589",
              }}
            >
              Home
            </Link>
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible content */}
          <div className="collapse navbar-collapse" id="navbarContent">
            {/* Center navigation - Changed from me-auto to mx-auto */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-4">
              <li className="nav-item">
                <Link
                  className="nav-link custom-nav-link position-relative hover-underline"
                  to="/petdatabase"
                >
                  Lost/FoundPets
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link custom-nav-link position-relative hover-underline"
                  to="/map"
                >
                  Nearby Shelters
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link custom-nav-link position-relative hover-underline"
                  to="/shelter"
                >
                  Shelters
                </Link>
              </li>
            </ul>

            {/* Right side user menu */}
            <ul className="navbar-nav align-items-center gap-3">
              {currentUser ? (
                <>
                  <li className="nav-item">
                    <span className="nav-item text-muted fst-italic text-nowrap">
                      Welcome, {currentUser.username}
                    </span>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link d-flex align-items-center hover-opacity"
                      to="/profile"
                    >
                      <PawPrint size={18} className="me-1" />
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <PurpleButton
                      onClick={handleSignOut}
                      className="btn btn-outline-primary btn-sm rounded-pill px-3 hover-scale"
                    >
                      Sign Out
                    </PurpleButton>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link
                    className="nav-link d-flex align-items-center hover-opacity"
                    to="/login"
                  >
                    <UserCircle size={18} className="me-1" />
                    Sign in
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="flex-grow-1 content-container">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/map" element={<Map />} />
          <Route path="/home/*" element={
            <>
              <Landing />
              <div className="container py-3">
                <div className="row justify-content-center">
                  <div className="col-md-8">
                    <div className="card shadow-sm">
                      <div className="card-body">
                        <h5 className="text-center mb-3">Team Members</h5>
                        <div className="row">
                          {teamMembers.map((member, index) => (
                            <div key={index} className="col-6 col-md-3 text-center mb-2">
                              <small>{member.name} (Sec {member.section})</small>
                            </div>
                          ))}
                        </div>
                        <div className="text-center mt-2">
                          <a 
                            href="https://github.com/Liheng-Yi/StrayWatch" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-primary"
                          >
                            GitHub Repository for both frontend and backend
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          } />
          <Route path="/petdatabase" element={<PetSearch />} />
          <Route path="/shelter" element={<Shelter />} />
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/" /> : <SignIn />}
          />
          <Route
            path="/signup"
            element={currentUser ? <Navigate to="/" /> : <SignUp />}
          />
          <Route
            path="/profile"
            element={currentUser ? <Profile /> : <Navigate to="/login" />}
          />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/add-pet" element={<AddPet />} />
          <Route path="/pet/:petId" element={<PetDetails />} />
        </Routes>
      </div>
    </div>
  );
}
