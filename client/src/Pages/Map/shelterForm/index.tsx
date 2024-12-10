import React, { useState, useEffect, useRef } from "react";
import PurpleButton from "../../../Components/UI/lightPurpleButton";
import { registerShelter } from "./client";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { getCurrentUserId } from "../../../Components/UI/auth";

interface ShelterFormProps {
  onClose: () => void;
}

const ShelterForm = ({ onClose }: ShelterFormProps) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const places = useMapsLibrary("places");
  const inputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    shelterName: "",
    shelterAddress: "",
    shelterPhone: "",
    shelterEmail: "",
    shelterWebsite: "",
    verified: false,
  });

  const formRef = useRef<HTMLDivElement>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

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
      handlePlaceSelect(place);
      setSelectedPlace(place);
    });
  }, [placeAutocomplete]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is on a Google Places autocomplete element
      const target = event.target as HTMLElement;
      if (target.closest(".pac-container")) {
        return;
      }

      if (formRef.current && !formRef.current.contains(target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Fill form data with dummy data for debugging
  useEffect(() => {
    setFormData({
      shelterName: "Debug Shelter",
      shelterAddress: "123 Debug St, Debug City, DB 12345",
      shelterPhone: "(123) 456-7890",
      shelterEmail: "debug@shelter.com",
      shelterWebsite: "https://www.debugshelter.com",
      verified: false,
    });
  }, []);
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
  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    setSelectedPlace(place);
    //console.log('[Sform]API Key:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    // Update form data with place information
    setFormData((prev) => ({
      ...prev,
      shelterAddress: place.formatted_address || "",
      shelterPhone: place.formatted_phone_number || prev.shelterPhone,
      shelterWebsite: place.website || prev.shelterWebsite,
      shelterName:
        !prev.shelterName && place.name ? place.name : prev.shelterName,
    }));

    // Clear any previous location errors
    setLocationError(null);
  };

  const handleLocationError = (error: string) => {
    setLocationError(error);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userId = getCurrentUserId();
      if (!userId) {
        setLocationError("Please login to register a shelter");
        return;
      }

      if (!selectedPlace?.geometry?.location) {
        setLocationError("Please select a valid address");
        return;
      }

      const lat = typeof selectedPlace.geometry.location.lat === "function"
        ? selectedPlace.geometry.location.lat()
        : selectedPlace.geometry.location.lat;

      const lng = typeof selectedPlace.geometry.location.lng === "function"
        ? selectedPlace.geometry.location.lng()
        : selectedPlace.geometry.location.lng;

      const location = {
        type: "Point",
        coordinates: [lng, lat],
      };

      const shelterData = {
        ...formData,
        location,
        userId,
      };

      await registerShelter(shelterData);

      // Reset form
      setFormData({
        shelterName: "",
        shelterAddress: "",
        shelterPhone: "",
        shelterEmail: "",
        shelterWebsite: "",
        verified: false,
      });
      setSelectedPlace(null);
      onClose(); // Close the form after successful registration
    } catch (error) {
      console.error("Error details:", error);
      setLocationError(
        error instanceof Error ? error.message : "Failed to register shelter"
      );
    }
  };

  return (
    <div className="container py-5" ref={formRef}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4">
                Register Your Shelter
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Basic Information Section */}
                  <div className="col-12">
                    <h5 className="border-bottom pb-2 mb-3">
                      Basic Information
                    </h5>
                  </div>
                  <div className="col-12">
                    <label className="form-label">
                      Shelter Name <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-building"></i>
                      </span>
                      <input
                        type="text"
                        name="shelterName"
                        value={formData.shelterName}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter shelter name"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="position-relative">
                      <input
                        type="text"
                        id="address"
                        name="address"
                        className="form-control"
                        placeholder="Enter address"
                        required
                        ref={inputRef}
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
                        <div className="text-danger small mt-1">
                          {locationError}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="col-12 mt-4">
                    <h5 className="border-bottom pb-2 mb-3">
                      Contact Information
                    </h5>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-telephone"></i>
                      </span>
                      <input
                        type="tel"
                        name="shelterPhone"
                        value={formData.shelterPhone}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="email"
                        name="shelterEmail"
                        value={formData.shelterEmail}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="shelter@example.com"
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Website</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-globe"></i>
                      </span>
                      <input
                        type="url"
                        name="shelterWebsite"
                        value={formData.shelterWebsite}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="https://www.yourshelter.com"
                      />
                    </div>
                  </div>

                  <div className="col-12 mt-4 text-center">
                    <PurpleButton type="submit" className="btn btn-lg">
                      Register Shelter
                    </PurpleButton>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShelterForm;
