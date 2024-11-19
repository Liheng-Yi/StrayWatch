import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.css';
import { useEffect, useState } from 'react';
import './shelterForm';

// Import the necessary images
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import ShelterForm from './shelterForm';

// Create a new default icon instance using L.icon
const defaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
});

type Shelter = {
  id: number;
  position: [number, number];
  name: string;
};

const shelters: Shelter[] = [
  { id: 1, position: [37.3327, -121.8853], name: "Shelter 1" },
  { id: 2, position: [37.3387, -121.783], name: "Shelter 2" },
];

// Set the default icon for all Marker components
L.Marker.prototype.options.icon = defaultIcon;

const Map: React.FC = () => {
  const mapCenter: [number, number] = [37.3387, -121.8853];
  
  return (
    <div className="container-fluid">
      {/* Map Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="map-container" style={{ height: '500px' }}>
            <MapContainer 
              center={mapCenter} 
              zoom={13} 
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%' }}
              className="rounded shadow-sm"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {shelters.map(shelter => (
                <Marker key={shelter.id} position={shelter.position}>
                  <Popup>{shelter.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
      
      {/* Form Section */}
      <div className="row justify-content-center">
        <div className="col-md-6">
          <ShelterForm />
        </div>
      </div>
    </div>
  );
};

export default Map;