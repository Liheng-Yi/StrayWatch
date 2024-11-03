import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Upload } from 'lucide-react';
import './styles.css';
interface Location {
  lat: number;
  lng: number;
}

const SpotInfo = () => {
  const [SpotInfo, setSpotInfo] = useState<google.maps.places.Autocomplete | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    petName: '',
    petType: '',
    lastSeenAddress: '',
    email: '',
    phone: '',
    image: null as File | null
  });

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'formatted_address'],
      types: ['address'],
      componentRestrictions: { country: 'us' }
    };

    setSpotInfo(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!SpotInfo) return;

    SpotInfo.addListener('place_changed', () => {
      setSelectedPlace(SpotInfo.getPlace());
    });
  }, [SpotInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (input: React.ChangeEvent<HTMLInputElement> | File) => {
    const file = input instanceof File ? input : input.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
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
    // Handle form submission here
    console.log('Form submitted:', formData);
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

            <div className="row mb-3">
              <div className="col-md-4">
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
                  <option value="">Select pet type</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  Phone<span className="text-primary"></span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-4">
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
      height: '280px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
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
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fff'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f4effa'}
    onClick={() => fileInputRef.current?.click()}
  >
    <input
      ref={fileInputRef}
      type="file"
      style={{ display: 'none' }}
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
        style={{ objectFit: 'cover' }}
      />
    ) : (
      <>
        <i className="" ></i>
        <h3 className="fs-4 fw-semibold text-dark mb-2">
          Photo Upload
        </h3>
        <p className="text-secondary">
          Drag and drop to upload or{' '}
          <span className="text-secondary text-decoration-underline">browse</span>
        </p>
      </>
    )}
  </div>
</div>
            

            <div className="text-center">
              <button type="submit" className="lost-found-button w-50">
                REPORT FOUND PET
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SpotInfo;