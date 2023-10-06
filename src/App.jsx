import { useState } from "react";
import "./App.css";
import EventCard from "./components/EventCard";
import { Grid } from "@mui/material";
import Banner from "./components/Banner";
import {NextUIProvider} from "@nextui-org/react";
import EventPage from "./components/EventPage";

const App = () => {
  return (
    <NextUIProvider>
    <EventPage />
    </NextUIProvider>
  );
};

export default App;
