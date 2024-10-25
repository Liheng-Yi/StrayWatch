import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  APIProvider,
  // unsed imports for map
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

interface PlaceAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

const LostPetForm = () => {
  const navigate = useNavigate();
  const [selectedPlace, setSelectedPlace] = 
    useState<google.maps.places.PlaceResult | null>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Report Lost Pet</h1>
        <button 
          onClick={handleBack}
          className="mb-6 text-blue-500 hover:text-blue-600"
        >
          ← Back to Main Page
        </button>
      </div>
      
      <APIProvider
        apiKey={(() => {
          console.log("API Key:", process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
          return process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? "";
        })()}
        solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
      >
        <div className="h-96 mb-6 rounded-lg overflow-hidden">
              <div className="m-2">
                <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
              </div>

        </div>
      </APIProvider>
    </div>
  );
};

const MapHandler = ({ place, marker }: MapHandlerProps) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !place || !marker) return;

    if (place.geometry?.viewport) {
      map.fitBounds(place.geometry?.viewport);
    }
    marker.position = place.geometry?.location;
  }, [map, place, marker]);

  return null;
};

const PlaceAutocomplete = ({ onPlaceSelect }: PlaceAutocompleteProps) => {
  const [placeAutocomplete, setPlaceAutocomplete] = 
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

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

  return (
    <div className="w-full">
      <label htmlFor="address" className="block text-sm font-medium mb-2">
        Where did your pet get lost?
      </label>
      <p className="text-sm text-gray-500 mb-2">
        Please provide a specific street address. We will never share your exact location.
      </p>
      <input
        ref={inputRef}
        type="text"
        id="address"
        name="address"
        className="w-full p-2 border rounded-lg shadow-sm"
        placeholder="Enter address"
        required
      />
    </div>
  );
};

export default LostPetForm;
