import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as client from "./client";
import { UserCircle } from "lucide-react";
import "./signin.css";
import { useAppDispatch } from "../../store/hooks";
import { setUser, setLoading, setError } from "./reducer";

function SignIn() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setLoading(true));

    try {
      const user = await client.signin(credentials);
      dispatch(
        setUser({
          ...user,
          role: user.role as "user" | "shelter" | "admin",
        })
      );
      localStorage.setItem("currentUser", JSON.stringify(user));
      window.location.href = "/home";
    } catch (err: any) {
      const errorMessage = err.message || "Invalid credentials";
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Add this function to help with debugging
  const checkLoginStatus = () => {
    const userStr = localStorage.getItem("currentUser");
    console.log("Current localStorage:", userStr);
    if (userStr) {
      console.log("Parsed user:", JSON.parse(userStr));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 p-3">
      <form
        className="signin-form bg-white p-4 rounded shadow-sm"
        style={{ maxWidth: "400px", width: "100%" }}
        onSubmit={handleSubmit}
      >
        <h2 className="text-center mb-4">
          <UserCircle className="mb-3" size={50} />
          <div>Sign In</div>
        </h2>

        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Enter your username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                username: e.target.value,
              })
            }
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                password: e.target.value,
              })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100 mb-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <span>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>

        <div className="text-center mb-3">
          <span className="text-muted">Don't have an account? </span>
          <Link to="/signup" className="text-primary text-decoration-none">
            Sign up
          </Link>
        </div>

        {/* Add this button during development to help with debugging */}
        {process.env.NODE_ENV === "development" && (
          <button
            type="button"
            onClick={checkLoginStatus}
            className="btn btn-secondary w-100"
          >
            Check Login Status
          </button>
        )}
      </form>
    </div>
  );
}

export default SignIn;
