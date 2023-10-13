import React, { useState, useEffect } from "react";
import "./App.css";
import { NextUIProvider } from "@nextui-org/react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Banner from "./components/Banner";
import EventsDisplay from "./components/EventsDisplay";
import EditEventModal from "./components/EditEventModal";
import useEventStore from "./stores/eventStore";
import { useAuthState, getDbData } from "./utilities/firebase";

const App = () => {
  const [selectedEventType, setSelectedEventType] = useState("School Org")
  const setEvents = useEventStore((state) => state.setEvents);
  const eventsList = useEventStore((state) => state.events);
  const setCategories = useEventStore((state) => state.setCategories);
  const [user] = useAuthState();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getDbData("/events").then((data) => {
      let pulledData = data;
      if (searchQuery) {
        pulledData[selectedEventType] = pulledData[selectedEventType].filter(event =>
          event.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      setEvents(pulledData);
      const allCategories = data[selectedEventType].flatMap(event => event.categoryNames);
      const uniqueCats = [...new Set(allCategories)];
      // remove undefined value from uniqueCats
      uniqueCats.splice(uniqueCats.indexOf(undefined), 1);
      setCategories(uniqueCats);
    }).catch((error) => {
      console.log(error);
    });
  }, [selectedEventType, searchQuery]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NextUIProvider>
        <div className="App">
          <Banner
            setSelectedEventType={setSelectedEventType}
            setSearchQuery={setSearchQuery}
            user={user}
          />
          {eventsList ? (
            <>
              <EventsDisplay
                events={eventsList[selectedEventType]}
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
