import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
L.Icon.Default.imagePath = "images/";

const nuLocation = { lat: 42.0565, lng: -87.6753 };

const LocationPicker = ({ initialLocation, onLocationChange }) => {
  const [location, setLocation] = React.useState(initialLocation);

  if (!initialLocation) {
    initialLocation = nuLocation;
  }

  const Markers = () => {
    useMapEvents({
      click: (e) => {
        const newLocation = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        };
        setLocation(newLocation);
        onLocationChange(newLocation);
      }
    });
    return location ? <Marker position={location} draggable /> : null;
  };

  return (
    <MapContainer center={initialLocation} zoom={13} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Markers />
    </MapContainer>
  );
};

export default LocationPicker;
