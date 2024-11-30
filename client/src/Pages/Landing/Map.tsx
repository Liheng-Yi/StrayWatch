import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Pet {
  _id: string;
  color: string;
  name: string;
  kind: string;
  status: string;
  location: string;
  picture: string;
  description: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface MapProps {
  pets: Pet[];
}

const Map: React.FC<MapProps> = ({ pets }) => {
  console.log("[landing map], pets:", pets);
  const mapCenter: [number, number] = [37.3387, -121.8853];
  return (
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
              {pets.map((pet) => pet.coordinates && (
                <Marker 
                  key={pet._id} 
                  position={[pet.coordinates.lat, pet.coordinates.lng]}
                >
                  <Popup>
                    <div className="card border-0">
                      <div className="card-body p-2">
                        <h5 className="card-title mb-2">{pet.name}</h5>
                        <img 
                          src={pet.picture || "/api/placeholder/400/320"} 
                          alt={pet.name} 
                          className="img-fluid rounded mb-2"
                          style={{ width: '100%', height: '120px', objectFit: 'cover' }} 
                        />
                        <div className="small">
                          <p className="mb-1">
                            <strong>Status:</strong> 
                            <span className={`ms-1 badge ${pet.status === 'Lost' ? 'bg-danger' : 'bg-success'}`}>
                              {pet.status}
                            </span>
                          </p>
                          <p className="mb-1"><strong>Type:</strong> {pet.kind}</p>
                          <p className="mb-1"><strong>Color:</strong> {pet.color}</p>
                          <p className="mb-1"><strong>Location:</strong> {pet.location}</p>
                          <p className="text-muted mb-0 small">{pet.description}</p>
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
  );
};

export default Map;
