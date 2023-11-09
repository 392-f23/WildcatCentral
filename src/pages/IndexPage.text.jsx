import EventCard from '../components/EventCard';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import IndexPage from './IndexPage';
import IndividualEventsPage from './IndividualEventsPage';
import useEventStore from '../stores/eventStore';
import { getDbData, writeToDb } from '../utilities/firebase';
import EventsMapPage from './EventsMapPage';

console.log("asd");

vi.mock('../stores/eventStore', () => {
    const mockEvents = {
        'Individual Events': [{ 
          id: 1, 
          name: 'Event 1', 
          latitude: 0, 
          longitude: 0, 
          organizationName: ['Org 1'] }],
        'School Org': [{ 
          id: 2, 
          name: 'Event 2', 
          latitude: 0, 
          longitude: 0, 
          organizationName: ['Org 2'] }],
    };

    const mockFavorites = [];
    const setFavoriteEvents = vi.fn();

    const useEventStore = vi.fn((selector) => {
        if (typeof selector === 'function') {
            // Call the selector with the mock state
            return selector({ events: mockEvents, favoriteEvents: mockFavorites, setFavoriteEvents, user: { uid: 'user1' } });
        }
        return { events: mockEvents, favoriteEvents: mockFavorites, setFavoriteEvents, user: { uid: 'user1' } };
    });

    return { default: useEventStore };
});

vi.mock('../utilities/firebase', () => ({
    getDbData: vi.fn(),
    writeToDb: vi.fn(),
  }));

describe('Individual Events Page', () => {
    it('given user login and favorite icon is clicked item is added to favorites', async () => {
        getDbData.mockResolvedValue({ '1': 'Event 1' }); // Event 1 should be added to favorites

        //console.log("got here???")

        render(<IndividualEventsPage />); //page with individual events

        // aria-label is add to favorites
        const toggleButton = screen.getByLabelText('add to favorites');
        fireEvent.click(toggleButton);

        //console.log("added to favorites");

        // expect that the setFavoriteEvents function from the store is called once with the correct event
        expect(useEventStore().setFavoriteEvents).toHaveBeenCalledTimes(1);
        expect(useEventStore().setFavoriteEvents).toHaveBeenCalledWith([{ id: 1, name: 'Event 1', latitude: 0, longitude: 0, organizationName: ['Org 1'] }]);

    });
});
describe('<IndexPage />', () => {
  it('given user login and favorite icon is clicked item is added to favorites', async () => {
      getDbData.mockResolvedValue({ '2': 'Event 2' }); // Event 2 should be added to favorites

      render(<IndexPage />); //page with school organization events

      // aria-label is add to favorites
      const toggleButton = screen.getByLabelText('add to favorites');
      fireEvent.click(toggleButton);

      // expect that the setFavoriteEvents function from the store is called once with the correct event
      expect(useEventStore().setFavoriteEvents).toHaveBeenCalledTimes(1);
      expect(useEventStore().setFavoriteEvents).toHaveBeenCalledWith([{ id: 2, name: 'Event 2', latitude: 0, longitude: 0, organizationName: ['Org 2'] }]);

  });
});
//import {useEventStore} from '../stores/useEventStore';

// mocking event store and its methods
/*vi.mock('../stores/useEventStore', () => ({
  useEventStore: vi.fn(() => ({
    user: {
      uid: 'user123',
      name: 'Jane Doe',
      email: 'jane.doe@gmail.com'
    },
    toggleFavorite: vi.fn(),
  })),
}));

const exEvent = {
            "id": "123",
            "institutionId": 0,
            "organizationId": 123,
            "organizationIds": [],
            "branchId": 345,
            "branchIds": [],
            "organizationName": "Example Org",
            "organizationProfilePicture": "example.png",
            "organizationNames": [],
            "name": "Example Event",
            "description": "<p>This is the description of a mock event.</p>",
            "location": "Testing room",
            "startsOn": "2023-10-12T21:30:00+00:00",
            "endsOn": "2023-10-13T00:30:00+00:00",
            "imagePath": "example.png",
            "theme": "ExampleTheme",
            "categoryIds": [
                "123"
            ],
            "categoryNames": [
                "Example"
            ],
            "benefitNames": [
                "Benefit"
            ],
            "visibility": "Public",
            "status": "Approved",
            "latitude": "0",
            "longitude": "0",
            "recScore": null,
            "addedOn": "2023-11-06T03:26:50+00:00",
            "fromWildcatConnection": true,
            "image": "example.png",
            "searchScore": 1.0
}

describe('EventCard', () => {
  it('renders with a defined user from the event store', () => {
    // Since we're not testing interaction here, we don't need fireEvent or async

    // Render the EventCard component
    const { getByText } = render(<EventCard event={exEvent} isFavorite={false} toggleFavorite={() => {}} />);

    // Check if the user's name appears in the document, which implies the user is defined
    expect(getByText('Jane Doe')).toBeInTheDocument();
  });

  it('adds event to favorites when the heart icon is clicked', async () => {
    //mock event and toggleFavorite function
    const toggleFavorite = vi.fn();

    //render the EventCard component with the mock event and toggleFavorite
    const { getByLabelText } = render(<EventCard event={exEvent} isFavorite={false} toggleFavorite={toggleFavorite} />);

    //find the heart icon button and click it
    const heartIconButton = getByLabelText('add to favorites');
    fireEvent.click(heartIconButton);

    //assert that toggleFavorite has been called
    expect(toggleFavorite).toHaveBeenCalledTimes(1);
  });
});*/
