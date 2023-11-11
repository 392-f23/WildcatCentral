import React, { useState } from "react";
import EventCard from "./EventCard";
import { Select, SelectItem, Chip } from "@nextui-org/react";
import Masonry from "@mui/lab/Masonry";
import useEventStore from "../stores/eventStore";

const EventsDisplay = ({
  events,
  currentPage,
  searchQuery,
  favoriteEvents,
  toggleFavorite,
}) => {
  const categories = useEventStore((state) => state.categories);
  const [selectedCategory, setSelectedCategory] = useState([]);
  console.log("Categories: ", categories);
  const filterEvents = (events, searchQuery, selectedCategory) => {
    return events.filter((event) => {
      // Filter by searchQuery in name, description, organizationName, and category names
      const nameMatch = event.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const descriptionMatch = event.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const organizationMatch = event.organizationName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Check if event belongs to selectedCategory
      const categoryMatch =
        selectedCategory.length === 0 ||
        (event.categoryNames &&
          event.categoryNames.some((category) =>
            selectedCategory.includes(category)
          ));

      // Return true if any of the conditions match
      return (
        (nameMatch || descriptionMatch || organizationMatch) && categoryMatch
      );
    });
  };

  // Filter Events
  const filteredEvents =
    currentPage === "Favorite Events"
      ? filterEvents(favoriteEvents, searchQuery, selectedCategory)
      : filterEvents(events, searchQuery, selectedCategory);

  return (
    <>
      {/* {categories && ( */}
      <div className="w-full p-6 pb-0 dark text-foreground">
        <div data-testid="category-select">
          <Select
            items={selectedCategory}
            label="Event Categories"
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
            {Array.isArray(categories) &&
              categories.map((category) => (
                <SelectItem
                  key={category}
                  textValue={category}
                  data-testid={`category-option-${category.replace(
                    /\s+/g,
                    "-"
                  )}`}
                >
                  {category}
                </SelectItem>
              ))}
          </Select>
        </div>
      </div>
      {/* )} */}
      <div className="events-grid flex justify-center w-full p-6">
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
        </Masonry>
      </div>
    </>
  );
};
export default EventsDisplay;
