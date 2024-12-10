import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as client from "./client";
import "./signin.css";

interface UserData {
  username: string;
  password: string;
  email: string | null;
  phone: string | null;
  role: "user" | "shelter" | "admin";
}

function SignUp() {
  const [userData, setUserData] = useState<UserData>({
    username: "",
    password: "",
    email: null,
    phone: null,
    role: "user" as "user" | "shelter" | "admin",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRoleChange = (newRole: "user" | "shelter" | "admin") => {
    setUserData((prev) => ({
      ...prev,
      role: newRole,
      email: newRole === "admin" ? null : prev.email || "",
      phone: newRole === "admin" ? null : prev.phone || "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (userData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const submitData = {
      ...userData,
      email: userData.role === "admin" ? undefined : userData.email || "",
      phone: userData.role === "admin" ? undefined : userData.phone || "",
    };

    try {
      await client.signup(submitData);
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

        {userData.role !== "admin" && (
          <>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={userData.email || ""}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                required={["user", "shelter"].includes(userData.role)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                placeholder="Enter your phone number"
                value={userData.phone || ""}
                onChange={(e) =>
                  setUserData({ ...userData, phone: e.target.value })
                }
                required={["user", "shelter"].includes(userData.role)}
              />
            </div>
          </>
        )}

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
              type="radio"
              className="form-check-input"
              id="roleUser"
              checked={userData.role === "user"}
              onChange={() => handleRoleChange("user")}
            />
            <label className="form-check-label" htmlFor="roleUser">
              User
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="roleShelter"
              checked={userData.role === "shelter"}
              onChange={() => handleRoleChange("shelter")}
            />
            <label className="form-check-label" htmlFor="roleShelter">
              Shelter
            </label>
          </div>
          <div className="form-check">
            <input
              type="radio"
              className="form-check-input"
              id="roleAdmin"
              checked={userData.role === "admin"}
              onChange={() => handleRoleChange("admin")}
            />
            <label className="form-check-label" htmlFor="roleAdmin">
              Admin
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
