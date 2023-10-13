import React from "react";
import Masonry from "@mui/lab/Masonry";
import EventCard from "./EventCard";

const FavoriteEvent = ({ favoriteEvents, toggleFavorite }) => {
  console.log("Favorite Events in FavoriteEvent", favoriteEvents);
  return (
    <div className="favorite-events-page">
      <h1>Favorite Events</h1>
      <div className="events-grid flex justify-center w-full p-4">
        <Masonry columns={{ xs: 1, sm: 3, md: 4, lg: 5, xl: 6 }} spacing={2}>
          {favoriteEvents.map((event) => (
            <div key={event.id} className="event-card flex justify-center">
              <EventCard
                event={event}
                key={event.id}
                isFavorite={true} // Since this page only shows favorite events
                toggleFavorite={() => toggleFavorite(event)}
              />
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default FavoriteEvent;
