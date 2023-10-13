import React, { useState } from "react";
import "./App.css";
import { NextUIProvider } from "@nextui-org/react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import Banner from "./components/Banner";
import FetchedData from "./data/events.json";
import EventsDisplay from "./components/EventsDisplay";
import EditEventModal from "./components/EditEventModal";
import useEventStore from "./stores/eventStore";
import { useAuthState } from "./utilities/firebase";
import FavouriteEvent from "./components/FavouriteEvent";

const JsonData = {
  "School Org": FetchedData["value"],
  "Individual Events": [
    {
      name: "Learn to Crochet Meeting",
      id: "WC-1",
      organizationName: "Knitwestern",
      categoryNames: ["Crafts"],
      startsOn: "2023-10-07T00:30:00+00:00",
      endsOn: "2023-10-07T03:30:00+00:00",
      location: "Harris Hall L28",
      description: "We'll be teaching how to crochet at these meetings!",
      image:
        "https://se-images.campuslabs.com/clink/images/a8b8a0e2-811d-46d6-9eb6-aa1515049ef615459ef0-ced0-46f4-afbe-eaaedbd5b660.png",
    },
    {
      name: "Learn to Knit Meeting",
      id: "WC-2",
      organizationName: "Knitwestern",
      categoryNames: ["Crafts"],
      location: "Harris Hall 107",
      startsOn: "2023-11-07T00:30:00+00:00",
      endsOn: "2023-11-07T03:30:00+00:00",
      description: "We will be teaching how to knit at all these meetings!",
      image:
        "https://media.istockphoto.com/id/1128343736/photo/close-up-on-womans-hands-knitting.jpg?s=612x612&w=0&k=20&c=O4hzRWflSHG12Edl7AhKDH7iqSUD2NrGdAntLxxtXh4=",
    },
    {
      name: "Hindu YUVA GBM",
      id: "WC-3",
      organizationName: "Hindu YUVA",
      categoryNames: ["Religion"],
      startsOn: "2023-12-07T00:30:00+00:00",
      endsOn: "2023-12-07T03:30:00+00:00",
      location: "Parkes Hall 122",
      description:
        "Please join us for our second general body meeting of the quarter, featuring games, discussions, and food!",
      image:
        "https://se-images.campuslabs.com/clink/images/a8b8a0e2-811d-46d6-9eb6-aa1515049ef615459ef0-ced0-46f4-afbe-eaaedbd5b660.png?preset=med-w",
    },
    {
      name: "Karaoke Night",
      id: "WC-4",
      organizationName: "Platypus Affiliated Society",
      categoryNames: ["Music"],
      startsOn: "2024-5-07T00:30:00+00:00",
      endsOn: "2024-5-07T03:30:00+00:00",
      location: "Kresge Hall 880 Campus Dr, Evanston, IL",
      description:
        "Fun karaoke with friends and free food this Friday night? What more could you ask for! Check in with us in Kresge 2319, and each group can sign up for a room on the Kresge 2nd floor to themselves for a certain time to sing whatever songs you want.",
      image:
        "https://se-images.campuslabs.com/clink/images/e6ad4193-1b9d-4266-9715-121a64e26d21e1bfe766-f58e-42bf-a273-ae616ce1087b.png",
    },
  ],
};

const App = () => {
  const [selectedEventType, setSelectedEventType] = useState("School Org");
  const setEvents = useEventStore((state) => state.setEvents);
  const eventsList = useEventStore((state) => state.events);
  const setCatagories = useEventStore((state) => state.setCatagories);
  const [user] = useAuthState();
  const [favoriteEvents, setFavoriteEvents] = useState([]); // Add state for favorite events
  const [currentPage, setCurrentPage] = useState("School Org"); // Add state for current page

  const toggleFavorite = (event) => {
    // Function to toggle favorite events
    if (favoriteEvents.includes(event)) {
      setFavoriteEvents(favoriteEvents.filter((e) => e !== event));
    } else {
      setFavoriteEvents([...favoriteEvents, event]);
    }
  };

  // When the app loads, we want to fetch the data from the "API"
  React.useEffect(() => {
    const pulledData = JsonData;
    setEvents(pulledData);
    const allCategories = pulledData[selectedEventType].flatMap(
      (event) => event.categoryNames
    );
    const uniqueCats = [...new Set(allCategories)];
    setCatagories(uniqueCats);
  }, [setEvents, setCatagories, selectedEventType]);

  if (!eventsList) {
    return <div>Loading...</div>;
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <NextUIProvider>
        <div className="App">
          <Banner setSelectedEventType={setCurrentPage} user={user} />{" "}
          {currentPage !== "Favorited Events" ? (
            <EventsDisplay
              events={eventsList[currentPage]}
              favoriteEvents={favoriteEvents}
              toggleFavorite={toggleFavorite}
            />
          ) : (
            <FavouriteEvent
              favoriteEvents={favoriteEvents}
              toggleFavorite={toggleFavorite}
            />
          )}
          <EventsDisplay events={eventsList[selectedEventType]} />
          <EditEventModal selectedEventType={selectedEventType} user={user} />
          <footer className="w-full p-8">
            <p className="text-center text-default-500 text-sm">
              Northwestern University
            </p>
            <p className="text-center text-default-500 text-sm">
              © 2023 Wildcat Central
            </p>
          </footer>
        </div>
      </NextUIProvider>
    </LocalizationProvider>
  );
};

export default App;
