import React, { useState, useRef, useEffect } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface GooglePlacesAutocompleteProps {
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  onError?: (error: string) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
  required?: boolean;
  types?: string[];
  country?: string;
  useCurrentLocation?: boolean;
  fields?: string[];
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  onPlaceSelect,
  onError,
  placeholder = "Enter address",
  className = "form-control",
  defaultValue = "",
  required = false,
  types = ['address'],
  country = 'us',
  useCurrentLocation = false,
  fields = ['geometry', 'formatted_address']
}) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: fields,
      types: types,
      componentRestrictions: { country: country }
    };

    const autocomplete = new places.Autocomplete(inputRef.current, options);
    setPlaceAutocomplete(autocomplete);

    // Set up place_changed listener
    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (onPlaceSelect) {
        onPlaceSelect(place);
      }
    });

    return () => {
      // Cleanup listeners when component unmounts
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [places, types, country, fields, onPlaceSelect]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      onError?.("Geolocation is not supported by your browser");
      return;
    }

    setIsLoadingLocation(true);

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
            onPlaceSelect?.(data.results[0]);
          }
        } catch (error) {
          onError?.("Failed to get address from coordinates");
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        onError?.(
          error.code === 1
            ? "Location access denied. Please enable location services."
            : "Failed to get your location"
        );
        setIsLoadingLocation(false);
      }
    );
  };

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">
        Address<span className='text-danger'>*</span>
      </label>
      <div className="input-group">
        <input
          ref={inputRef}
          type="text"
          className={className}
          placeholder={placeholder}
          defaultValue={defaultValue}
          required={required}
        />
      </div>
      {useCurrentLocation && (
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
      )}
    </div>
  );
};

export default GooglePlacesAutocomplete;