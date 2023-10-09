import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import EventCard from './EventCard';
import { Select, SelectItem, Chip } from "@nextui-org/react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EventsDisplay = ({ events }) => {
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);

  useEffect(() => {
    setSelectedCategory([]);
    // Step 1: Extract Unique Category Names
    const allCategories = events.flatMap(event => event.categoryNames);
    const unique = [...new Set(allCategories)];
    setUniqueCategories(unique);
  }, [events]);

  // Step 3: Filter Events
  const filteredEvents = events.filter(event => {
    if (selectedCategory.length === 0) {
      return true;
    } else {
      return event.categoryNames.some(category => selectedCategory.includes(category));
    }
  });

  const theme = useTheme();

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
                key={category}
                textValue={category}
              >
                {category}
              </SelectItem>
            ))}
          </Select>
        </div>
      )}

      {/* Render Filtered Events */}
      <div className="events-grid gap-4 grid p-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 w-full justify-center">
        {filteredEvents.map(event => (
          <div key={event.id} className="event-card">
            {/* Render event details */}
            <EventCard event={event} key={event.id} />
            {/* ...other event details */}
          </div>
        ))}
      </div>
    </>
  );
}

export default EventsDisplay;