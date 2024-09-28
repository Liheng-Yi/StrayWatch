import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import the necessary images
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Create a new default icon instance using L.icon
const defaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  tooltipAnchor: [16, -28], // point from which the tooltip should open relative to the iconAnchor
});

type Shelter = {
  id: number;
  position: [number, number]; // This specifies that `position` must be a tuple of two numbers
  name: string;
};

const shelters: Shelter[] = [
  { id: 1, position: [37.3327, -121.8853], name: "Shelter 1" },
  { id: 2, position: [37.3387, -121.783], name: "Shelter 2" },
  // add more shelters as needed
];

// Set the default icon for all Marker components
L.Marker.prototype.options.icon = defaultIcon;

const Map: React.FC = () => {
  const mapCenter: [number, number] = [37.3387, -121.8853];
  return (
    <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
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
  );
};

export default Map;
