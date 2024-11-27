import React, { useState, useEffect, useRef } from 'react';
import PurpleButton from '../../../Components/UI/lightPurpleButton';
import GooglePlacesAutocomplete from '../../../Components/UI/AddressAutocomplete';
import { registerShelter } from './client';

interface ShelterFormProps {
  onClose: () => void;
}

const ShelterForm = ({ onClose }: ShelterFormProps) => {
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    shelterName: '',
    shelterAddress: '',
    shelterPhone: '',
    shelterEmail: '',
    shelterWebsite: '',
    verified: false
  });

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Fill form data with dummy data for debugging
  useEffect(() => {
    setFormData({
      shelterName: 'Debug Shelter',
      shelterAddress: '123 Debug St, Debug City, DB 12345',
      shelterPhone: '(123) 456-7890',
      shelterEmail: 'debug@shelter.com',
      shelterWebsite: 'https://www.debugshelter.com',
      verified: false
    });
  }, []);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    setSelectedPlace(place);
    setFormData(prev => ({
      ...prev,
      shelterAddress: place.formatted_address || '',
      shelterPhone: place.formatted_phone_number || '',
      shelterWebsite: place.website || ''
    }));
  };

  const handleLocationError = (error: string) => {
    setLocationError(error);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (!selectedPlace?.geometry?.location) {
        setLocationError('Please select a valid address');
        return;
      }

      // Get the lat/lng values by calling the methods
      const lat = typeof selectedPlace.geometry.location.lat === 'function' 
        ? selectedPlace.geometry.location.lat() 
        : selectedPlace.geometry.location.lat;
      
      const lng = typeof selectedPlace.geometry.location.lng === 'function' 
        ? selectedPlace.geometry.location.lng() 
        : selectedPlace.geometry.location.lng;

      const location = {
        type: 'Point',
        coordinates: [lng, lat]
      };

      const shelterData = {
        ...formData,
        location
      };
      
      await registerShelter(shelterData);
      
      // Reset form
      setFormData({
        shelterName: '',
        shelterAddress: '',
        shelterPhone: '',
        shelterEmail: '',
        shelterWebsite: '',
        verified: false
      });
      setSelectedPlace(null);
      onClose(); // Close the form after successful registration
    } catch (error) {
      console.error('Error details:', error);
      setLocationError(error instanceof Error ? error.message : 'Failed to register shelter');
    }
  };

  return (
    <div className="container py-5" ref={formRef}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title text-center mb-4">Register Your Shelter</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  {/* Basic Information Section */}
                  <div className="col-12">
                    <h5 className="border-bottom pb-2 mb-3">Basic Information</h5>
                  </div>
                  <div className="col-12">
                    <label className="form-label">
                      Shelter Name <span className='text-danger'>*</span>
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
                      <GooglePlacesAutocomplete
                        onPlaceSelect={handlePlaceSelect}
                        onError={handleLocationError}
                        placeholder="Search for shelter address"
                        required={true}
                        useCurrentLocation={true}
                        types={['establishment']}
                        fields={['geometry', 'formatted_address', 'name', 'website', 'formatted_phone_number']}
                      />
                      {locationError && (
                        <div className="text-danger small mt-1">
                          {locationError}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact Information Section */}
                  <div className="col-12 mt-4">
                    <h5 className="border-bottom pb-2 mb-3">Contact Information</h5>
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