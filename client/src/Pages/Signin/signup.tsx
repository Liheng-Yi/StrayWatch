import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as client from "./client";
import "./signin.css";

interface UserData {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

function SignUp() {
  const [userData, setUserData] = useState<UserData>({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    roles: ["USER"],
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRoleChange = (role: string) => {
    setUserData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (userData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await client.signup(userData);
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 p-3">
      <form
        className="signup-form bg-white p-4 rounded shadow-sm"
        style={{ maxWidth: "400px", width: "100%" }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-center mb-4">Sign Up</h2>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Choose a username"
            value={userData.username}
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter your email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              placeholder="First name"
              value={userData.firstName}
              onChange={(e) =>
                setUserData({ ...userData, firstName: e.target.value })
              }
              required
            />
          </div>
          <div className="col">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              placeholder="Last name"
              value={userData.lastName}
              onChange={(e) =>
                setUserData({ ...userData, lastName: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Create a password"
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label d-block">Choose Role(s)</label>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="roleAdmin"
              checked={userData.roles.includes("USER")}
              onChange={() => handleRoleChange("USER")}
            />
            <label className="form-check-label" htmlFor="roleAdmin">
              Admin
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="rolePetOwner"
              checked={userData.roles.includes("PET_OWNER")}
              onChange={() => handleRoleChange("PET_OWNER")}
            />
            <label className="form-check-label" htmlFor="rolePetOwner">
              Pet Owner
            </label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="roleShelterWorker"
              checked={userData.roles.includes("SHELTER_WORKER")}
              onChange={() => handleRoleChange("SHELTER_WORKER")}
            />
            <label className="form-check-label" htmlFor="roleShelterWorker">
              Shelter Worker
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-3">
          Sign Up
        </button>

        <div className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
