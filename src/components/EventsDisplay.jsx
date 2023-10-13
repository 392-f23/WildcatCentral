import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import { Select, SelectItem, Chip } from "@nextui-org/react";
import Masonry from '@mui/lab/Masonry';

import useEventStore from '../stores/eventStore';

const EventsDisplay = ({ events }) => {
  const uniqueCategories = useEventStore((state) => state.categories);
  const [selectedCategory, setSelectedCategory] = useState([]);

  // Step 3: Filter Events
  const filteredEvents = events.filter(event => {
    if (selectedCategory.length === 0) {
      return true;
    } else {
      return event.categoryNames.some(category => selectedCategory.includes(category));
    }
  });

  return (
    <>
      {/* Step 2: Populate Dropdown */}
      {/* <select
        value={selectedCategory}
        onChange={e => setSelectedCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        {uniqueCategories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select> */}

      {uniqueCategories.length > 1 && (
        <div className='w-full p-6 pb-0 dark text-foreground'>
          <Select
            items={selectedCategory}
            label="Categories"
            variant="bordered"
            isMultiline={true}
            selectionMode="multiple"
            placeholder="Select Categories"
            labelPlacement="outside"
            className='dark'
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
            {uniqueCategories.map(category => (
              <SelectItem
                key={`category-${category}`}
                textValue={category}
              >
                {category}
              </SelectItem>
            ))}
          </Select>
        </div>
      )}

      {/* Render Filtered Events */}
      <div className="events-grid flex justify-center w-full p-4">
      <Masonry columns={{ xs: 1, sm: 3, md: 4, lg: 5, xl: 6 }} spacing={2}>
        {filteredEvents.map(event => (
          <div key={event.id} className="event-card flex justify-center">
            {/* Render event details */}
            <EventCard event={event}/>
            {/* ...other event details */}
          </div>
        ))}
      </Masonry>
      </div>
    </>
  );
}

export default EventsDisplay;