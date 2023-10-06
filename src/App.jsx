import { useState } from 'react';
import './App.css';
import EventCard from './components/EventCard';
import { Grid } from '@mui/material';

const JsonData = [
  {
    "name" : "Karaoke Night",
    "date" : "2023-10-06 19:30:00",
    "timezone" : "CDT",
    "location" : "Kresge Hall 880 Campus Dr, Evanston, IL",
    "description" : "Fun karaoke with friends and free food this Friday night? What more could you ask for! Check in with us in Kresge 2319, and each group can sign up for a room on the Kresge 2nd floor to themselves for a certain time to sing whatever songs you want.",
    "image" : "https://se-images.campuslabs.com/clink/images/e6ad4193-1b9d-4266-9715-121a64e26d21e1bfe766-f58e-42bf-a273-ae616ce1087b.png"
  },
  {
    "name" : "Learn to Crochet Meeting",
    "date" : "2023-10-31 19:00:00", 
    "timezone" : "CDT",
    "location" : "Harris Hall L28",
    "description" : "We'll be teaching how to crochet at these meetings!",
    "image" : "https://se-images.campuslabs.com/clink/images/a8b8a0e2-811d-46d6-9eb6-aa1515049ef615459ef0-ced0-46f4-afbe-eaaedbd5b660.png"
  },
  {
    "name": "Learn to Knit Meeting",
    "date": "2023-10-08 13:30:00",
    "timezone": "CDT",
    "location": "Harris Hall 107",
    "description": "We will be teaching how to knit at all these meetings!",
    "image": "https://media.istockphoto.com/id/1128343736/photo/close-up-on-womans-hands-knitting.jpg?s=612x612&w=0&k=20&c=O4hzRWflSHG12Edl7AhKDH7iqSUD2NrGdAntLxxtXh4="}
  ,
  {
    "name" : "Hindu YUVA GBM",
    "date" : "2023-10-06 02:38:18",
    "timezone" : "CDT",
    "location" : "Parkes Hall 122",
    "description" : "Please join us for our second general body meeting of the quarter, featuring games, discussions, and food!",
    "image" : "https://se-images.campuslabs.com/clink/images/a8b8a0e2-811d-46d6-9eb6-aa1515049ef615459ef0-ced0-46f4-afbe-eaaedbd5b660.png?preset=med-w"
  }
]

const App = () => {

  return (
    <div className="App">
      <header className="App-header">
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {JsonData.map((event) => (
            <EventCard event={event} />
          ))}
        </Grid>
      </header>
    </div>
  );
};

export default App;
