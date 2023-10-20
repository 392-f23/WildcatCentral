import React from "react";
import EventsDisplayPage from '../components/EventsDisplayPage';
import useEventStore from "../stores/eventStore";
import { Navigate } from 'react-router-dom';

const FavoritesPage = () => {
  const user = useEventStore((state) => state.user);

  if (!user) {
    return (
      <Navigate to="/" replace />
    );
  } else {
    return (
      <EventsDisplayPage selectedEventType="Favorite Events" />
    );
  }
};

export default FavoritesPage;
