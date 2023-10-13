import React, { useState, useEffect } from "react";
import "./App.css";
import { NextUIProvider } from "@nextui-org/react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import Banner from "./components/Banner";
import EventsDisplay from "./components/EventsDisplay";
import EditEventModal from "./components/EditEventModal";
import useEventStore from "./stores/eventStore";
import { useAuthState } from "./utilities/firebase";
import { getDbData } from "./utilities/firebase";

const App = () => {
  const [selectedEventType, setSelectedEventType] = useState("School Org")
  const setEvents = useEventStore((state) => state.setEvents);
  const eventsList = useEventStore((state) => state.events);
  const setCategories = useEventStore((state) => state.setCategories);
  const [user] = useAuthState();

  useEffect(() => {
    if (user) {
      getDbData("/").then((data) => {
        setEvents(data['events']);
        const allCategories = data['events'][selectedEventType].flatMap(event => event.categoryNames);
        const uniqueCats = [...new Set(allCategories)];
        // remove undefined value from uniqueCats
        uniqueCats.splice(uniqueCats.indexOf(undefined), 1);
        setCategories(uniqueCats);
      }).catch((error) => {
        console.log(error);
      });
    }
  }, [user]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NextUIProvider>
        <div className="App">
          <Banner
            setSelectedEventType={setSelectedEventType}
            user={user}
          />
          {user && eventsList ? (
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
              <p className="text-lg font-bold text-white">Please log in to view events</p>
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
