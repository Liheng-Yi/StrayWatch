import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import * as client from "./client";
import { UserCircle } from "lucide-react";
import "./signin.css";

function SignIn() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const user = await client.signin(credentials);
      // Store user info in localStorage or state management system
      localStorage.setItem("currentUser", JSON.stringify(user));
      setIsLoading(false);

      // Navigate to main page (assuming "/" is your main page route)
      navigate("/");

      // Optional: Refresh the page to update the navigation bar
      // window.location.reload();
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Invalid credentials");
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
      </form>
    </div>
  );
}

export default SignIn;
