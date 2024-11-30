import React, { useState, useRef, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

import "./styles.css";
import { submitLostPet } from "./client";
import { useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";

interface Location {
  lat: number;
  lng: number;
}

const PlaceAutocomplete = () => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    kind: "",
    color: "",
    location: "",
    description: "",
    image: null as File | null,
    status: "Lost" as const,
    userId: "",
    coordinates: null as { type: 'Point', coordinates: [number, number] } | null
  });

  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.user.currentUser);
  // console.log("[LostForm]--currentUser", currentUser);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ["geometry", "formatted_address"],
      types: ["address"],
      componentRestrictions: { country: "us" },
    };
    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;
    placeAutocomplete.addListener("place_changed", () => {
      const place = placeAutocomplete.getPlace();

      setSelectedPlace(place);
    });
  }, [placeAutocomplete]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (
    input: React.ChangeEvent<HTMLInputElement> | File
  ) => {
    const file = input instanceof File ? input : input.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };



  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          
          if (data.results && data.results[0]) {
            const address = data.results[0].formatted_address;
            if (inputRef.current) {
              inputRef.current.value = address;
            }
            setSelectedPlace(data.results[0]);
            setFormData(prev => ({
              ...prev,
              location: address,
              coordinates: {
                type: 'Point',
                coordinates: [longitude, latitude] // Note: GeoJSON uses [lng, lat] order
              }
            }));
          }
        } catch (error) {
          setLocationError("Failed to get address from coordinates");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setLocationError(
          error.code === 1
            ? "Location access denied. Please enable location services."
            : "Failed to get your location"
        );
        setIsLoadingLocation(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    
    if (currentUser?._id === undefined) {
      navigate("/login");
      return;
    }

    try {
      await submitLostPet({
        name: formData.name,
        kind: formData.kind,
        color: formData.color,
        location: formData.location,
        description: formData.description,
        image: formData.image,
        status: "Lost",
        userId: currentUser._id,
        coordinates: formData.coordinates,
      });

      // Clear form
      setFormData({
        name: "",
        kind: "",
        color: "",
        location: "",
        description: "",
        image: null,
        status: "Lost",
        userId: "",
        coordinates: null,
      });
      setImagePreview(null);
      alert("Pet information submitted successfully!");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <label htmlFor="address" className="form-label">
            Where did your pet get lost?
          </label>
          <p className="text-muted small mb-2">
            Please provide a specific street address. We will never share your
            exact location.
          </p>

          <form onSubmit={handleSubmit} className="mb-3">
            <div>
              <label className="form-label fw-semibold">
                Address<span className="text-primary">*</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-control"
                  placeholder="Enter address"
                  required
                  ref={inputRef}
                />
              </div>
            </div>
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

            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Pet Name<span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="if unsure, put unknown"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Kind of Pet<span className="text-primary">*</span>
                </label>
                <select
                  name="kind"
                  value={formData.kind}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select pet type</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Pet Color<span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-12">
                <label className="form-label fw-semibold">Description</label>
                <textarea
                  name="description"
                  placeholder="More details help us find your pet!"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  rows={3}
                />
              </div>
            </div>

            <div className="mb-3">
              <div
                className={`
                  
                  d-flex
                  flex-column
                  align-items-center
                  justify-content-center
                  rounded
                  border-2
                  border-dashed
                  p-4
                `}
                style={{
                  height: "280px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleImageChange(e.dataTransfer.files[0]);
                  }
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fff")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f4effa")
                }
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImageChange(e.target.files[0]);
                    }
                  }}
                />

                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <>
                    <i className=""></i>
                    <h3 className="fs-4 fw-semibold text-dark mb-2">
                      Photo Upload
                    </h3>
                    <p className="text-secondary">
                      Drag and drop to upload or{" "}
                      <span className="text-secondary text-decoration-underline">
                        browse
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="text-center">
              <button type="submit" className="lost-found-button">
                FIND MY PET
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlaceAutocomplete;
