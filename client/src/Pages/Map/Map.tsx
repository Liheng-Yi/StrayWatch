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
  _id: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
};

// Set the default icon for all Marker components
L.Marker.prototype.options.icon = defaultIcon;

const Map: React.FC = () => {
  const mapCenter: [number, number] = [37.3387, -121.8853];
  const [showForm, setShowForm] = useState(false);
  const [shelters, setShelters] = useState<Shelter[]>([]);

  const fetchShelters = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/shelters');
      if (!response.ok) {
        throw new Error('Failed to fetch shelters');
      }
      const data = await response.json();
      setShelters(data);
    } catch (error) {
      console.error('Error fetching shelters:', error);
    }
  };

  useEffect(() => {
    fetchShelters();
  }, []);

  const handleShelterAdded = () => {
    fetchShelters();
    setShowForm(false);
  };

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
              {shelters.map(shelter => shelter.location && (
                <Marker 
                  key={shelter._id} 
                  position={[shelter.location.coordinates[1], shelter.location.coordinates[0]]}
                >
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
                backgroundColor: '#6f42c1',
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
          <ShelterList onShelterUpdate={fetchShelters} />
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
              <ShelterForm onClose={handleShelterAdded} />
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