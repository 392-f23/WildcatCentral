import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { NextUIProvider } from "@nextui-org/react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Root from './routes/root';
import IndexPage from './pages/IndexPage';
import ErrorPage from './pages/ErrorPage';
import IndividualEventsPage from './pages/IndividualEventsPage';
import FavoritePage from './pages/FavoritePage';
import EventsMapPage from './pages/EventsMapPage';
import NewEventPage from './pages/NewEventPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4E2A84'
    },
    darkbackground: {
      main: '#fff',
      contrastText: '#000'
    },
    contrast: {
      main: '#6D28D9',
      light: '#fff',
      dark: '#4c1d95',
      contrastText: '#fff'
    },
  }
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <IndexPage /> },
      /* existing routes */
      {
        path: "individual-events",
        element: <IndividualEventsPage />
      },
      {
        path: "favorites",
        element: <FavoritePage />,
      },
      {
        path: "map-view",
        element: <EventsMapPage />,
      },
      {
        path: "newevent",
        element: <NewEventPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <NextUIProvider>
          <RouterProvider router={router} />
        </NextUIProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
);
