import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { Select, SelectItem, Chip } from "@nextui-org/react";
import Masonry from "@mui/lab/Masonry";
import FavouriteEvent from "./FavouriteEvent";
const EventsDisplay = ({ events }) => {
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [favoriteEvents, setFavoriteEvents] = useState([]);

  useEffect(() => {
    setSelectedCategory([]);
    if (events) {
      const allCategories = events.flatMap((event) => event.categoryNames);
      const unique = [...new Set(allCategories)];
      setUniqueCategories(unique);
    }
  }, [events]);

  const toggleFavorite = (event) => {
    console.log("Events in toggleFavorite", event);

    setFavoriteEvents((prevFavoriteEvents) => {
      console.log(
        "Favorite Events in toggleFavorite before",
        prevFavoriteEvents
      );

      const isAlreadyFavorite = prevFavoriteEvents.some(
        (favEvent) => favEvent.id === event.id
      );

      let updatedFavorites;
      if (isAlreadyFavorite) {
        updatedFavorites = prevFavoriteEvents.filter(
          (favEvent) => favEvent.id !== event.id
        );
      } else {
        updatedFavorites = [...prevFavoriteEvents, event];
      }

      console.log("Favorite Events in toggleFavorite after", updatedFavorites);
      return updatedFavorites;
    });
  };

  const filteredEvents = (events || []).filter((event) => {
    // console.log("event", event);
    if (selectedCategory.length === 0) {
      return true;
    } else {
      return event.categoryNames.some((category) =>
        selectedCategory.includes(category)
      );
    }
  });

  return (
    <>
      {uniqueCategories.length > 1 && (
        <div className="w-full p-6 pb-0 dark text-foreground">
          <Select
            items={selectedCategory}
            label="Categories"
            variant="bordered"
            isMultiline={true}
            selectionMode="multiple"
            placeholder="Select Categories"
            labelPlacement="outside"
            className="dark"
            classNames={{
              trigger: "min-h-unit-12 py-2",
            }}
            onChange={(e) => setSelectedCategory(e.target.value)}
            renderValue={(items) => {
              return (
                <div className="flex flex-wrap gap-2 dark">
                  {items.map((item) => (
                    <Chip key={item.key}>{item.textValue}</Chip>
                  ))}
                </div>
              );
            }}
          >
            {uniqueCategories.map((category) => (
              <SelectItem key={category} textValue={category}>
                {category}
              </SelectItem>
            ))}
          </Select>
        </div>
      )}

      {/* Render Filtered Events */}
      <div className="events-grid flex justify-center w-full p-4">
        <Masonry columns={{ xs: 1, sm: 3, md: 4, lg: 5, xl: 6 }} spacing={2}>
          {filteredEvents.map((event) => (
            <div key={event.id} className="event-card flex justify-center">
              <EventCard
                event={event}
                key={event.id}
                isFavorite={favoriteEvents.includes(event)}
                toggleFavorite={() => toggleFavorite(event)}
              />
            </div>
          ))}
          <FavouriteEvent
            favoriteEvents={favoriteEvents}
            toggleFavorite={toggleFavorite}
          />
        </Masonry>
      </div>
    </>
  );
};
export default EventsDisplay;
