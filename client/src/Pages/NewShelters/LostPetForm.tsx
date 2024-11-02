import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  APIProvider,
  ControlPosition,
  MapControl,
  AdvancedMarker,
  Map,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
  AdvancedMarkerRef
} from '@vis.gl/react-google-maps';

interface MapHandlerProps {
  place: google.maps.places.PlaceResult | null;
  marker: google.maps.marker.AdvancedMarkerElement | null;
}
interface Location {
  lat: number;
  lng: number;
}
interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  onAddressConfirm: () => void;
  selectedPlace: google.maps.places.PlaceResult | null;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const LostPetForm = () => {
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);

  const [formData, setFormData] = useState({
    petName: '',
    petType: '',
    lastSeenAddress: '',
    email: '',
    phone: ''
  });

  const handleBack = () => {
    navigate('/');
  };

  const handleAddressConfirm = () => {
    setIsAddressConfirmed(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Form submitted successfully!\n' + JSON.stringify(formData, null, 2));
  };

  return (
    <div>
      <button 
        onClick={handleBack}
        className="mb-6 text-blue-500 hover:text-blue-600"
      >
        ← Back to Main Page
      </button>
      <div className="text-center max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Report Lost Pet</h1>

        <APIProvider
          apiKey={(() => {
            console.log("API Key:", process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
            return process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? "";
          })()}
          solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
        >
          <div className="h-96 mb-6 rounded-lg overflow-hidden">
            <div className="m-2">
              <PlaceAutocomplete 
                onPlaceSelect={setSelectedPlace} 
                onAddressConfirm={handleAddressConfirm}
                selectedPlace={selectedPlace}
                formData={formData}
                handleChange={handleChange}
              />
            </div>
          </div>
        </APIProvider>
      </div>
    </div>
  );
};

const MapHandler = ({ place, marker }: MapHandlerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place || !marker) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry.viewport);
    }
    marker.position = place.geometry?.location;
  }, [map, place, marker]);

  return null;
};

const PlaceAutocomplete = ({ onPlaceSelect, onAddressConfirm, selectedPlace, formData, handleChange }: PlaceAutocompleteProps) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'formatted_address'],
      types: ['address'],
      componentRestrictions: { country: 'us' }
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);
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
            onPlaceSelect(data.results[0]);
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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <label htmlFor="address" className="form-label">
            Where did your pet get lost?
          </label>
          <p className="text-muted small mb-2">
            Please provide a specific street address. We will never share your exact location.
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
            {/* Location button moved to its own row */}
            <div className="d-flex ms-3 justify-content-start w-100 mb-2">
              <button
                type="button"
                onClick={getCurrentLocation}
                className="btn btn-link p-0 text-decoration-underline" 
                disabled={isLoadingLocation}
              >
                {isLoadingLocation ? (
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
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
            

            {/* Address and Email Row */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Pet Name<span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  name="petName"
                  placeholder="if unsure, put unknown"
                  value={formData.petName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Kind of Pet<span className="text-primary">*</span>
                </label>
                <select
                  name="petType"
                  value={formData.petType}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                </select>
              </div>
            </div>

            {/* Phone Field */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Phone<span className="text-primary">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Email Address<span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
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

export default LostPetForm;