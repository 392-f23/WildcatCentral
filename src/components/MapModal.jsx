import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
L.Icon.Default.imagePath = "images/";

export const fetchCoordinatesFromName = async (locationName) => {
  const viewbox = "-91.5,36.8,-87.0,42.7";

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${locationName}&limit=1&viewbox=${viewbox}&bounded=1`
  );
  const data = await response.json();

  if (data && data.length > 0) {
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  }

  return null;
};

const MapModal = ({
  isOpen,
  onOpenChange,
  latitude,
  longitude,
  locationName,
}) => {
  const [coordinates, setCoordinates] = useState({ latitude, longitude });

  useEffect(() => {
    if (isOpen && !latitude && !longitude && locationName) {
      fetchCoordinatesFromName(locationName).then((coords) => {
        if (coords) {
          setCoordinates(coords);
        }
      });
    }
  }, [isOpen]); // <-- Listening to changes in isOpen

  const shouldDisplayMap =
    coordinates && coordinates.latitude && coordinates.longitude;

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader>{locationName || "Location"}</ModalHeader>
        <ModalBody>
          {shouldDisplayMap ? (
            <MapContainer
              center={[coordinates.latitude, coordinates.longitude]}
              zoom={15}
              style={{ width: "100%", height: "300px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[coordinates.latitude, coordinates.longitude]}
              />
            </MapContainer>
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>
                No location coordinates provided for this event.
                <br />
                Sorry for the inconvenience.
              </p>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MapModal;
