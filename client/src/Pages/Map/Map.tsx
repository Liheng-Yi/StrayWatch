import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.css';
import { useEffect, useState } from 'react';
import './shelterForm';
import ShelterList from './shelterList';
import { Modal } from 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ShelterForm from './shelterForm';

// Import the necessary images
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

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
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container-fluid">
      {/* Map Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="map-container position-relative" style={{ height: '500px' }}>
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
            
            {/* Bootstrap Floating Action Button */}
            <button
              className="btn rounded-circle position-fixed"
              style={{
                bottom: '2rem',
                right: '2rem',
                width: '4rem',
                height: '4rem',
                backgroundColor: '#6f42c1', // Purple color
                color: 'white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => setShowForm(true)}
              title="Add New Shelter"
            >
              New Shelter
            </button>
          </div>
        </div>
      </div>

      {/* Shelter List */}
      <div className="row">
        <div className="col-12">
          <ShelterList />
        </div>
      </div>

      {/* Bootstrap Modal */}
      <div 
        className={`modal fade ${showForm ? 'show' : ''}`} 
        id="shelterFormModal"
        tabIndex={-1}
        aria-labelledby="shelterFormModalLabel"
        aria-hidden={!showForm}
        style={{ display: showForm ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="shelterFormModalLabel">Add New Shelter</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowForm(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ShelterForm onClose={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      {showForm && (
        <div 
          className="modal-backdrop fade show" 
          onClick={() => setShowForm(false)}
        ></div>
      )}
    </div>
  );
};

export default Map;