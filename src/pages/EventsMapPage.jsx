import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getDbData } from "../utilities/firebase";
import useEventStore from "../stores/eventStore";
import { fetchCoordinatesFromName } from "../components/MapModal";

const EventsMapPage = () => {
  const setEvents = useEventStore((state) => state.setEvents);
  const eventsList = useEventStore((state) => state.events);
  //console.log("events: ", eventsList);
  const allEvents = [
    ...eventsList["Individual Events"],
    ...eventsList["School Org"],
  ];
  //console.log("allevents: ", allEvents);
  const [fetchedCoords, setFetchedCoords] = useState({});

  useEffect(() => {
    getDbData("/events")
      .then((data) => {
        setEvents(data);
        //console.log("events: ", eventsList);
      })
      .catch((error) => {
        console.log("Error fetching events:", error);
      });
  }, []);
  useEffect(() => {
    allEvents.forEach(async (event) => {
      if (!event.latitude && !event.longitude && event.location) {
        const coords = await fetchCoordinatesFromName(event.location);
        if (coords) {
          setFetchedCoords((prevCoords) => ({
            ...prevCoords,
            [event.id]: coords,
          }));
        }
      }
    });
  }, [allEvents]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <MapContainer
        center={[42.05103, -87.67388]}
        zoom={15}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {allEvents &&
          allEvents.map((event) => {
            console.log("Processing event:", event);

            const latitude =
              event.latitude ||
              (fetchedCoords[event.id] && fetchedCoords[event.id].latitude);
            const longitude =
              event.longitude ||
              (fetchedCoords[event.id] && fetchedCoords[event.id].longitude);

            console.log(
              "Event:",
              event.name,
              "Latitude:",
              latitude,
              "Longitude:",
              longitude
            );

            if (latitude && longitude) {
              console.log("showing marker for event ", event.name);

              return (
                <Marker position={[latitude, longitude]} key={event.id}>
                  <Popup>
                    {event.name} {/* or other event details */}
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
      </MapContainer>
    </div>
  );
};

export default EventsMapPage;
