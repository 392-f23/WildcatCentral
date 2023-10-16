import React, { useState, useEffect } from "react";
import "./App.css";
import { NextUIProvider } from "@nextui-org/react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import Banner from "./components/Banner";
import EventsDisplay from "./components/EventsDisplay";
import EditEventModal from "./components/EditEventModal";
import useEventStore from "./stores/eventStore";
import { useAuthState, getDbData} from "./utilities/firebase";
import FavouriteEvent from "./components/FavouriteEvent";




const App = () => {
  const [selectedEventType, setSelectedEventType] = useState("School Org");
  const setEvents = useEventStore((state) => state.setEvents);
  const eventsList = useEventStore((state) => state.events);
  const setCategories = useEventStore((state) => state.setCategories);
  const [user] = useAuthState();
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteEvents, setFavoriteEvents] = useState([]); // Add state for favorite events
  //const [currentPage, setCurrentPage] = useState("School Org"); // Add state for current page

  const handleSelectedEventTypeChange = (newEventType) => {
    console.log("Changing selected event type to:", newEventType);
    setSelectedEventType(newEventType);
  };

  const toggleFavorite = (event) => {
    // Function to toggle favorite events
    if (favoriteEvents.includes(event)) {
      setFavoriteEvents(favoriteEvents.filter((e) => e !== event));
    } else {
      setFavoriteEvents([...favoriteEvents, event]);
    }
  };

  useEffect(() => {
    if (selectedEventType !== "Favorited Events") {
      // Fetch data and set categories when not on the "Favorite Events" page
      getDbData("/events").then((data) => {
        let pulledData = data;
        setEvents(pulledData);
  
        const selectedEventData = data[selectedEventType];
        const allCategories = selectedEventData?.flatMap(event => event.categoryNames) || [];
  
        console.log("cats:", allCategories);
  
        const uniqueCats = [...new Set(allCategories)];
        // remove undefined value from uniqueCats
        uniqueCats.splice(uniqueCats.indexOf(undefined), 1);
        setCategories(uniqueCats);
      }).catch((error) => {
        console.log(error);
      });
    }
  }, [selectedEventType, searchQuery]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NextUIProvider>
        <div className="App">
          <Banner
            user={user}
            setSelectedEventType={handleSelectedEventTypeChange}
            setSearchQuery={setSearchQuery}
          />

          {eventsList ? (
            <>
              <EventsDisplay
                events={eventsList[selectedEventType] || []}
                currentPage={selectedEventType}
                searchQuery={searchQuery}
                favoriteEvents={favoriteEvents}
                toggleFavorite={toggleFavorite}
              />
              <EditEventModal
                selectedEventType={selectedEventType}
                user={user}
              />
            </>
          ) : (
            <div className="text-center mt-8">
              <p className="text-lg font-bold text-white">Loading...Paws for a moment</p>
            </div>
          )}




          <footer className="w-full p-8">
          <p className="text-center text-default-500 text-sm">Northwestern University</p>
          <p className="text-center text-default-500 text-sm">© 2023 Wildcat Central</p>
        </footer>
        </div>
      </NextUIProvider>
    </LocalizationProvider>
  );
};

export default App;
