import React, { useState } from "react";
import "./App.css";
import EventList from "./components/EventList";
import { NextUIProvider } from "@nextui-org/react";
import Banner from "./components/Banner";
import FetchedData from "./data/events.json";

const JsonData = {"School Org" : FetchedData["value"],
"Individual Events" : [
  {
    name: "Learn to Crochet Meeting",
    id: "WC-1",
    organizationName: "Knitwestern",
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
    "startsOn": "2024-5-07T00:30:00+00:00",
    "endsOn": "2024-5-07T03:30:00+00:00",
    location: "Kresge Hall 880 Campus Dr, Evanston, IL",
    description:
      "Fun karaoke with friends and free food this Friday night? What more could you ask for! Check in with us in Kresge 2319, and each group can sign up for a room on the Kresge 2nd floor to themselves for a certain time to sing whatever songs you want.",
    image:
      "https://se-images.campuslabs.com/clink/images/e6ad4193-1b9d-4266-9715-121a64e26d21e1bfe766-f58e-42bf-a273-ae616ce1087b.png",
  }
],
};


const App = () => {
  const [selectedEventTitle, setSelectedEventTitle] = useState("School Org")
  
  return (
    <NextUIProvider>
      <div className="App">
        <Banner setSelectedEventType={setSelectedEventTitle} />
        <EventList events={JsonData[selectedEventTitle]} />
      </div>
    </NextUIProvider>
  );
};

export default App;
