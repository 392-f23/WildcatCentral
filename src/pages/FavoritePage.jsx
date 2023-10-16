import React from "react";
import EventsDisplayPage from '../components/EventsDisplayPage';
import useEventStore from "../stores/eventStore";

const FavouritesPage = () => {
  const user = useEventStore((state) => state.user);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h1 className="text-white">Please sign in to view your favorite events.</h1>
      </div>
    );
  } else {
    return (
      <EventsDisplayPage selectedEventType="Favorite Events" />
    );
  }
};

export default FavouritesPage;
