import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import PurpleButton from '../../Components/UI/lightPurpleButton';
import ContactModal, { ContactFormData } from '../../Components/util/Contact';

interface Pet {
  _id: string;
  color: string;
  name: string;
  kind: string;
  status: string;
  location: string;
  picture: string;
  description: string;
  lat: string;
  lng: string;
}

interface MapProps {
  pets: Pet[];
}

const Map: React.FC<MapProps> = ({ pets }) => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const handleContactSubmit = (formData: ContactFormData) => {
    console.log('Contact form submitted:', formData);
    alert('Message sent! (To be implemented)');
  };

  console.log("[landing map], pets:", pets);

  const mapCenter: [number, number] = [37.3387, -121.8853];
  return (
    <>
      <div className="row mt-5">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body p-0" style={{ height: '400px' }}>
              <MapContainer
                center={mapCenter}
                scrollWheelZoom={true}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {pets.map((pet) => pet.lat && pet.lng && (
                  <Marker 
                    key={pet._id} 
                    position={[parseFloat(pet.lat), parseFloat(pet.lng)]}
                  >
                    <Popup>
                      <div className="card border-0" style={{ maxWidth: '160px' }}>
                        <div className="card-body p-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="card-title mb-0" style={{ fontSize: '0.9rem', lineHeight: '1.1' }}>{pet.name}</h6>
                            <span className={`badge ${pet.status === 'Lost' ? 'bg-danger' : 'bg-success'}`} style={{ fontSize: '0.7rem' }}>
                              {pet.status}
                            </span>
                          </div>
                          <img
                            src={pet.picture || "/api/placeholder/400/320"} 
                            alt={pet.name} 
                            className="img-fluid rounded mb-2"
                            style={{ width: '100%', height: '100px', objectFit: 'cover' }} 
                          />
                          <div style={{ fontSize: '0.75rem', lineHeight: '1.1' }}>
                            <p className="mb-1 mt-0"><strong>Color:</strong> {pet.color}</p>
                            <p className="mb-1 text-muted" style={{ maxHeight: '2.4em', overflow: 'hidden' }}>{pet.description}</p>
                            <PurpleButton 
                              variant="solid" 
                              className="w-100 py-0"
                              style={{ fontSize: '0.75rem' }}
                              onClick={() => {
                                setSelectedPet(pet);
                                setShowContactModal(true);
                              }}
                            >
                              Contact Owner
                            </PurpleButton>
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        petName={selectedPet?.name || ''}
        onSubmit={handleContactSubmit}
      />
    </>
  );
};

export default Map;
