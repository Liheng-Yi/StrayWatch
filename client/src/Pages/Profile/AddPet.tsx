import React, { useState,useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIProvider,useMapsLibrary } from '@vis.gl/react-google-maps';
import PurpleButton from "../../Components/UI/lightPurpleButton";
import { getCurrentUserId } from "../../Components/UI/auth";

const AddPet: React.FC = () => {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  const navigate = useNavigate();
  const API_URL = process.env.NODE_ENV === 'production' 
      ? process.env.API_URL 
      : 'http://localhost:5000';
  const [petData, setPetData] = useState({
    name: '',
    kind: '',
    color: '',
    status: 'found',
    location: '',
    picture: '',
    description: ''
  });
  const [error, setError] = useState('');

  // set up Google Places autocomplete functionality
  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'formatted_address'],
      types: ['address'],
      componentRestrictions: { country: 'us' }
    };
    const autocomplete = new places.Autocomplete(inputRef.current, options);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      setPetData(prev => ({
        ...prev,
        location: place.formatted_address || ''
      }));
    });
  }, [places]);

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
            setPetData(prev => ({
              ...prev,
              location: address
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPetData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = getCurrentUserId();
    console.log("userId",userId);
    try {
        console.log('Request URL:', `/api/pets/add/${userId}`);
        const response = await fetch(`${API_URL}/api/pets/add/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId:userId,
            name:petData.name,
            kind:petData.kind,
            color:petData.color,
            status:petData.status,     
            description:petData.description
          })
        });
    
        if (!response.ok) {
          throw new Error('Failed to add pet');
        }
        navigate('/profile'); 
      } catch (error) {
        console.error('Error adding pet:', error);
        setError('Failed to add pet. Please try again.');
      }
  };

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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
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
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            name="status"
            className="form-control"
            value={petData.status}
            onChange={handleInputChange}
            required
          >
            <option value="lost">Lost</option>
            <option value="Found">Found</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            name="location"
            className="form-control"
            value={petData.location}
            onChange={handleInputChange}
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
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={petData.description}
            onChange={handleInputChange}
            rows={3}
          />
        </div>

        <div className="mb-3">
          <PurpleButton type="submit">Submit Pet Information</PurpleButton>
          <PurpleButton type="button" onClick={() => navigate('/profile')}>
            Cancel
          </PurpleButton>
        </div>
      </form>
    </div>
    </APIProvider>
);
}

export default AddPet;