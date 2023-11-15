import EventCard from '../components/EventCard';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { LocalizationProvider, AdapterDateFns } from '@mui/x-date-pickers';
import EventEditor from '../components/EventEditor'; // Adjust the import path

import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import IndexPage from './IndexPage';
import IndividualEventsPage from './IndividualEventsPage';
import useEventStore from '../stores/eventStore';
import { getDbData, writeToDb } from '../utilities/firebase';
import NewEventPage from './NewEventPage';
import { useNavigate } from 'react-router-dom';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';

it('renders DateTimePicker correctly', () => {
    render(
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
                label="Starts On"
                value={new Date()} // Use a valid date
                onChange={() => {}}
                renderInput={(params) => <TextField {...params} data-testid="startdate" />}
            />
        </LocalizationProvider>
    );

    screen.debug(); // Check if DateTimePicker is rendered
});

// mock useNavigate (vi)
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

vi.mock('@mui/x-date-pickers/DateTimePicker', () => ({
    // Mock implementation or return a simple dummy component
    DateTimePicker: vi.fn(),
    /*return {
      __esModule: true,
      DateTimePicker: ({ value, onChange, label }) => (
        <input 
          type="text" 
          value={value} 
          onChange={e => onChange(e.target.value)} 
          aria-label={label}
        />
      ),
    };*/
  }));

  vi.mock('./LocationPicker', () => ({
    __esModule: true,
    default: ({ onLocationChange }) => (
      <button onClick={() => onLocationChange({ lat: 40.7128, lng: -74.0060 })}>
        Mock Location Picker
      </button>
    ),
  }));
  

vi.mock('../stores/eventStore', () => {
  const mockEvents = {
    'Individual Events': [{
      id: 1,
      name: 'Event 1',
      description: 'This is the description of a mock event.',
      latitude: 0,
      longitude: 0,
      organizationName: 'Org 1',
      categoryNames: [
        "Information/Mock Session 1"
      ],
    }],
    'School Org': [{
      id: 2,
      name: 'Event 2',
      description: 'This is the description of a mock event.',
      latitude: 0,
      longitude: 0,
      organizationName: 'Org 2',
      categoryNames: [
        "Information/Mock Session 2"
      ],
    }],
  };

  const mockFavorites = [];
  const setFavoriteEvents = vi.fn();

  const setCategories = vi.fn();

  const addEvent = vi.fn(); //mocking the add event capability
  const addcategory = vi.fn();

  const searchQuery = '';
  const categories = ['Information/Mock Session 1', 'Information/Mock Session 2'];

  const useEventStore = vi.fn((selector) => {
    if (typeof selector === 'function') {
      // Call the selector with the mock state
      return selector({ events: mockEvents, favoriteEvents: mockFavorites, setFavoriteEvents, user: { uid: 'user1' }, searchQuery: searchQuery, setCategories, categories });
    }
    return { events: mockEvents, favoriteEvents: mockFavorites, setFavoriteEvents, user: { uid: 'user1' }, searchQuery: searchQuery, setCategories, categories };
  });

  return { default: useEventStore };
});

vi.mock('../utilities/firebase', async () => {
    const actual = await vi.importActual('../utilities/firebase');
    
    return {
      ...actual, // include all actual exports
      getDbData: vi.fn(), // mock getDbData
      writeToDb: vi.fn(), // mock writeToDb
      // Add any other mocks or overrides here
    };
  });
  

describe('NewEventPage', () => {
  // reset the setFavoriteEvents mock after each test
  afterEach(() => {
    useEventStore().setFavoriteEvents.mockClear();
    useEventStore().addEvent.mockClear();
  });

  it('should display a new event card with correct data after submission', async () => {
    render(<NewEventPage />);
    screen.debug();
    //render(<EventEditor />);

    const eventName = screen.getByTestId('name');
    const eventDesc = screen.getByTestId('description');
    const eventCats = screen.getByTestId('categories');
    screen.debug(eventName);
    screen.debug(eventDesc);
    screen.debug(eventCats);
    const startDatePicker = screen.getByTestId('startdate');
    const endDatePicker = screen.getByTestId('end-date-picker');
    
    screen.debug(startDatePicker);
    screen.debug(endDatePicker);

    // Simulate user input
    //fireEvent.change(screen.getByLabelText('Name of Your Event'), { target: { value: 'Test Event' } });
    const eventNameInput = screen.getByRole('textbox', { name: /name of your event/i });
    fireEvent.change(eventNameInput, { target: { value: 'Test Event' } });
    const descInput = screen.getByRole('textbox', { name: /description/i });
    fireEvent.change(descInput, { target: { value: 'This is a test event description.' } });

    // example dates
    const startDate = new Date('2023-10-06T10:00:00');
    const endDate = new Date('2023-10-06T12:00:00');

    // find the DateTimePicker inputs
    //const startDateInput = screen.getByRole('textbox', { name: /starts on/i });
    const startDateInput = screen.getByLabelText("Starts On");
    const endDateInput = screen.getByLabelText(/ends on/i);

    // Simulate setting the start and end dates
    fireEvent.change(startDateInput, { target: { value: startDate.toISOString() } });
    fireEvent.change(endDateInput, { target: { value: endDate.toISOString() } });

    // Click the mock location picker button to simulate location selection
    fireEvent.click(screen.getByText('Mock Location Picker'));

    // Add other fields similarly...
    /*const locInput = screen.getByRole('textbox', { name: /location name/i });
    // Mock location selection by directly invoking the onLocationChange callback
    const mockLocation = { lat: 40.7128, lng: -74.0060 }; // Mock latitude and longitude
    const locationPicker = screen.getByTestId('location-picker'); // Adjust this to how you can select your LocationPicker component
    locationPicker.onLocationChange(mockLocation);*/
    //fireEvent.change(screen.getByLabelText('Location Name'), { target: { value: 'Test Location' } });

    // Submit the form
    fireEvent.click(screen.getByText('Submit'));

    // Wait for the new event card to appear
    const newEventCard = await screen.findByText('Test Event');
    expect(newEventCard).toBeInTheDocument();

    expect(useEventStore().addEvent).toHaveBeenCalledTimes(1);

    // Check for other data in the event card
    expect(screen.getByText('This is a test event description.')).toBeInTheDocument();
    // Add other assertions as needed...
  });

  /*it('given user login and favorite icon is clicked item is added to favorites', async () => {
    getDbData.mockResolvedValue({ '1': 'Event 1' }); // Event 1 should be added to favorites

    //console.log("got here???")

    render(<NewEventPage />); //page to add events

    // aria-label is add to favorites
    const toggleButton = screen.getByLabelText('add to favorites');
    fireEvent.click(toggleButton);

    //console.log("added to favorites");

    // expect that the setFavoriteEvents function from the store is called once with the correct event
    expect(useEventStore().addEvent).toHaveBeenCalledTimes(1);
    expect(useEventStore().addEvent).toHaveBeenCalledWith([{
      id: 1,
      name: 'Event 1',
      description: "This is the description of a mock event.",
      latitude: 0,
      longitude: 0,
      organizationName: 'Org 1',
      categoryNames: [
        "Information/Mock Session 1"
      ],
    }]);

  });

  it('given user login and favorite icon is clicked item is added to favorites', async () => {
    getDbData.mockResolvedValue({ '2': 'Event 2' }); // Event 2 should be added to favorites

    render(<IndexPage />); //page with school organization events

    // aria-label is add to favorites
    const toggleButton = screen.getByLabelText('add to favorites');
    fireEvent.click(toggleButton);

    // expect that the setFavoriteEvents function from the store is called once with the correct event
    expect(useEventStore().setFavoriteEvents).toHaveBeenCalledTimes(1);
    expect(useEventStore().setFavoriteEvents).toHaveBeenCalledWith([{
      id: 2,
      name: 'Event 2',
      description: 'This is the description of a mock event.',
      latitude: 0,
      longitude: 0,
      organizationName: 'Org 2',
      categoryNames: [
        "Information/Mock Session 2"
      ],
    }]);

  });*/

});
