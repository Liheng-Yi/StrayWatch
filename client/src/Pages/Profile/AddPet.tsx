import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { APIProvider, useMapsLibrary } from "@vis.gl/react-google-maps";
import PurpleButton from "../../Components/UI/lightPurpleButton";
// Added Redux imports
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addPet } from "./reducer";

const AddPet = () => {
  // Added Redux hooks
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.user);

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");
  const navigate = useNavigate();

  const API_URL =
    process.env.NODE_ENV === "production"
      ? process.env.API_URL
      : "http://localhost:5000";

  const [petData, setPetData] = useState({
    name: "",
    kind: "",
    color: "",
    status: "lost" as "lost" | "found",
    location: "",
    picture: "",
    description: "",
  });

  // Google Places setup remains the same
  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "formatted_address"],
      types: ["address"],
      componentRestrictions: { country: "us" },
    };
    const autocomplete = new places.Autocomplete(inputRef.current, options);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      setPetData((prev) => ({
        ...prev,
        location: place.formatted_address || "",
      }));
    });
  }, [places]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${API_URL}/api/pets/add/${currentUser?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser?._id,
            ...petData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add pet");
      }

      // Added Redux dispatch
      const newPet = await response.json();
      dispatch(
        addPet({
          _id: newPet._id,
          _userId: currentUser?._id || "",
          ...petData,
        })
      );

      navigate("/profile");
    } catch (error) {
      console.error("Error adding pet:", error);
    }
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.results[0]) {
              setPetData((prev) => ({
                ...prev,
                location: data.results[0].formatted_address,
              }));
            }
          } catch (error) {
            setLocationError("Failed to get address");
          } finally {
            setIsLoadingLocation(false);
          }
        },
        () => {
          setLocationError("Failed to get location");
          setIsLoadingLocation(false);
        }
      );
    } else {
      setLocationError("Geolocation not supported");
      setIsLoadingLocation(false);
    }
  };

  // Rest of the component remains the same
  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? ""}>
      <div className="container mt-4">
        <h2 className="mb-4">Add New Pet</h2>
        <form onSubmit={handleSubmit} className="col-lg-8 mx-auto">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={petData.name}
              onChange={(e) => setPetData({ ...petData, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Kind</label>
            <input
              type="text"
              name="kind"
              className="form-control"
              value={petData.kind}
              onChange={(e) => setPetData({ ...petData, kind: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Color</label>
            <input
              type="text"
              name="color"
              className="form-control"
              value={petData.color}
              onChange={(e) =>
                setPetData({ ...petData, color: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-control"
              value={petData.status}
              onChange={(e) =>
                setPetData({
                  ...petData,
                  status: e.target.value as "lost" | "found",
                })
              }
              required
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              className="form-control"
              value={petData.location}
              onChange={(e) =>
                setPetData({ ...petData, location: e.target.value })
              }
              ref={inputRef}
              required
            />
            <div className="d-flex ms-3 justify-content-start w-100 mb-2">
              <button
                type="button"
                onClick={getCurrentLocation}
                className="btn btn-link p-0 text-decoration-underline"
                disabled={isLoadingLocation}
              >
                {isLoadingLocation ? (
                  <span
                    className="spinner-border spinner-border-sm me-1"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  <span>🐾 Use My Location</span>
                )}
              </button>
            </div>
            {locationError && (
              <div className="text-danger small mt-1">{locationError}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              value={petData.description}
              onChange={(e) =>
                setPetData({ ...petData, description: e.target.value })
              }
              rows={3}
            />
          </div>
          <div className="mb-3">
            <PurpleButton type="submit">Submit Pet Information</PurpleButton>
            <PurpleButton type="button" onClick={() => navigate("/profile")}>
              Cancel
            </PurpleButton>
          </div>
        </form>
      </div>
    </APIProvider>
  );
};

export default AddPet;
