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
  const setCatagories = useEventStore((state) => state.setCatagories);
  const [user] = useAuthState();

  useEffect(() => {
    if (user) {
      getDbData("/").then((data) => {
        setEvents(data['events']);
        const allCategories = pulledData[selectedEventType].flatMap(event => event.categoryNames);
        const uniqueCats = [...new Set(allCategories)];
        setCatagories(uniqueCats);
      }).catch((error) => {
        console.log(error);
      });
    }
  }, [user]);


  if (!eventsList) {
    return <div>Loading...</div>;
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NextUIProvider>
        <div className="App">
          <Banner
            setSelectedEventType={setSelectedEventType}
            user={user}
          />
          <EventsDisplay
            events={eventsList[selectedEventType]}
          />
          <EditEventModal
            selectedEventType={selectedEventType}
            user={user}
          />
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
