import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { writeToDb, getDbData } from "../utilities/firebase";
import useEventStore from "../stores/eventStore";
import 'leaflet/dist/leaflet.css';
L.Icon.Default.imagePath='images/'

const fetchCoordinatesFromName = async (locationName) => {
    const viewbox = "-91.5,36.8,-87.0,42.7";

    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${locationName}&limit=1&viewbox=${viewbox}&bounded=1`);
    const data = await response.json();

    if (data && data.length > 0) {
        return {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
        };
    }

    return null;
};

const EventsMapPage = () => {

    //const [events, setEvents] = useState([]);
    const setEvents = useEventStore((state) => state.setEvents);
    const eventsList = useEventStore((state) => state.events);
    //console.log("events: ", eventsList);
    const allEvents = [...eventsList["Individual Events"], ...eventsList["School Org"]];
    //console.log("allevents: ", allEvents);
    const [fetchedCoords, setFetchedCoords] = useState({});

    useEffect(() => {
        getDbData("/events").then((data) => {
            // Assuming the data is an array of events
            // If the structure is different, you might need to adjust this
            setEvents(data);
            //console.log("events: ", eventsList);
            

        }).catch((error) => {
            console.log("Error fetching events:", error);
        });
    }, []);
    useEffect(() => {
        allEvents.forEach(async (event) => {
            if (!event.latitude && !event.longitude && event.location) {
                const coords = await fetchCoordinatesFromName(event.location);
                if (coords) {
                    setFetchedCoords(prevCoords => ({
                        ...prevCoords,
                        [event.id]: coords
                    }));
                }
            }
        });
    }, [allEvents]);
    

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            <MapContainer
                // Some default center coordinates, can be modified
                center={[42.051030, -87.673880]}
                zoom={15}
                style={{ width: '100%', height: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                
                {allEvents && allEvents.map(event => {

                    console.log("Processing event:", event);


                    const latitude = event.latitude || (fetchedCoords[event.id] && fetchedCoords[event.id].latitude);
                    const longitude = event.longitude || (fetchedCoords[event.id] && fetchedCoords[event.id].longitude);

                    console.log("Event:", event.name, "Latitude:", latitude, "Longitude:", longitude);

                    if (latitude && longitude) {

                        console.log("showing marker for event ", event.name);

                        return (
                            <Marker 
                                position={[latitude, longitude]}
                                key={event.id}
                            >
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
}

export default EventsMapPage;
