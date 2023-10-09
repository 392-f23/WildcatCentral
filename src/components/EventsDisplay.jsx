import React, { useState, useEffect } from 'react';
import EventCard from './EventCard';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from "@mui/material/MenuItem";


const EventsDisplay = ({ events }) => {
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    setSelectedCategory('');
    // Step 1: Extract Unique Category Names
    const allCategories = events.flatMap(event => event.categoryNames);
    const unique = [...new Set(allCategories)];
    setUniqueCategories(unique);
  }, [events]);

  // Step 3: Filter Events
  const filteredEvents = events.filter(event =>
    selectedCategory ? event.categoryNames.includes(selectedCategory) : true
  );

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

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
        <div className='w-full p-6 pb-0'>
          <FormControl fullWidth>
            <InputLabel id="category-select-label" sx={{ color: '#fff', fontSize: '1.2rem' }}>Categories</InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              value={selectedCategory}
              label="Categories"
              onChange={handleCategoryChange}
              sx={{
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#fff',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#fff',
                },
                '&:hover': {
                  borderColor: '#fff',
                },
              }}
            >
              <MenuItem value="">
                <em>All Categories</em>
              </MenuItem>
              {uniqueCategories.map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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