import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useEventStore from "../stores/eventStore";
import { fetchCoordinatesFromName } from "../components/MapModal";
import EventCard from "../components/EventCard";
import { getDbData, writeToDb } from "../utilities/firebase";

const EventsMapPage = () => {
  const eventsList = useEventStore((state) => state.events);
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    if (eventsList) {
      const allEvents = [
        ...eventsList["Individual Events"],
        ...eventsList["School Org"],
      ];
      setAllEvents(allEvents);
    }
  }, [eventsList]);

  const [fetchedCoords, setFetchedCoords] = useState({});
  const user = useEventStore((state) => state.user);
  const favoriteEvents = useEventStore((state) => state.favoriteEvents);
  const setFavoriteEvents = useEventStore((state) => state.setFavoriteEvents);

  const fetchFavorites = async () => {
    if (user && eventsList) {
      const userId = user.uid;
      const path = `/favorites/${userId}/favorites`;
      try {
        const data = await getDbData(path);
        if (data) {
          const eventIDs = Object.values(data);
          const allEvents = Object.values(eventsList).flat();
          const newFavoriteEvents = allEvents.filter(event => eventIDs.includes(event.id.toString()));
          setFavoriteEvents(newFavoriteEvents);
        } else {
          setFavoriteEvents([]);
        }
      } catch (error) {
        console.log("Error fetching favorites:", error);
      }
    } else {
      setFavoriteEvents([]);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user, eventsList]);

  const toggleFavorite = async (event) => {
    if (!user) return;

    const userId = user.uid;
    const path = `/favorites/${userId}`;
    let currentFavorites = favoriteEvents.map(e => e.id);

    if (currentFavorites.includes(event.id)) {
      currentFavorites = currentFavorites.filter((e) => e !== event.id);
      setFavoriteEvents(favoriteEvents.filter((e) => e.id !== event.id));
    } else {
      currentFavorites.push(event.id);
      setFavoriteEvents([...favoriteEvents, event]);
    }

    await writeToDb(path, { favorites: currentFavorites });
  };

  // There's a 1s per second rate limit on the Nominatim API, so we don't want to
  // fetch coordinates for every event like this.
  // useEffect(() => {
  //   allEvents.forEach(async (event) => {
  //     if (!event.latitude && !event.longitude && event.location) {
  //       const coords = await fetchCoordinatesFromName(event.location);
  //       if (coords) {
  //         setFetchedCoords((prevCoords) => ({
  //           ...prevCoords,
  //           [event.id]: coords,
  //         }));
  //       }
  //     }
  //   });
  // }, [allEvents]);

  return (
    <div className="h-screen">
      <MapContainer
        center={[42.05103, -87.67388]}
        zoom={15}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
      >
        <div data-testid="map-container">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </div>
        <ZoomControl position="bottomright" />
        {allEvents &&
          allEvents.map((event) => {
            const latitude =
              event.latitude ||
              (fetchedCoords[event.id] && fetchedCoords[event.id].latitude);
            const longitude =
              event.longitude ||
              (fetchedCoords[event.id] && fetchedCoords[event.id].longitude);

            if (latitude && longitude) {
              return (
                <Marker position={[latitude, longitude]} key={event.id}>
                  <Popup>
                    <EventCard
                      event={event}
                      isFavorite={favoriteEvents.includes(event)}
                      toggleFavorite={() => toggleFavorite(event)}
                    />
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
