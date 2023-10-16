import React, { useState, useEffect } from "react";
import EventCard from "./EventCard";
import { Select, SelectItem, Chip } from "@nextui-org/react";
import Masonry from '@mui/lab/Masonry';
import useEventStore from "../stores/eventStore";

const pages = ["School Org", "Individual Events", "Favourite Events"];

const EventsDisplay = ({ events, currentPage, searchQuery, favoriteEvents, toggleFavorite}) => {
  const categories = useEventStore(state => state.categories);
  const [selectedCategory, setSelectedCategory] = useState([]);

  // Filter Events
  const filteredEvents = currentPage === "Favourite Events"
  ? favoriteEvents
  : events.filter(event => {
      // Filter by searchQuery in name, description, organizationName, and category names
      const nameMatch = event.name.toLowerCase().includes(searchQuery.toLowerCase());
      const descriptionMatch = event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const organizationMatch = event.organizationName.toLowerCase().includes(searchQuery.toLowerCase());

      // Check if event belongs to selectedCategory
      const categoryMatch = selectedCategory.length === 0 || (
        event.categoryNames &&
        event.categoryNames.some(category => selectedCategory.includes(category))
      );

      // Return true if any of the conditions match
      return (nameMatch || descriptionMatch || organizationMatch) && categoryMatch;
  });


  return (
    <>
      {categories.length > 1 && (
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
            
            {categories.map((category) => (
              <SelectItem key={category} textValue={category}>
                {category}
              </SelectItem>
            ))}
          </Select>

        </div>
      )}

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
        </Masonry>
      </div>
    </>
  );
};
export default EventsDisplay;
