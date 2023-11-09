import EventCard from '../components/EventCard';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import IndexPage from './IndexPage';
import IndividualEventsPage from './IndividualEventsPage';
import useEventStore from '../stores/eventStore';
import { getDbData, writeToDb } from '../utilities/firebase';
import EventsMapPage from './EventsMapPage';
import { useNavigate } from 'react-router-dom';

// mock useNavigate (vi)
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
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

vi.mock('../utilities/firebase', () => ({
  getDbData: vi.fn(),
  writeToDb: vi.fn(),
}));

describe('<IndexPage />', () => {
  // reset the setFavoriteEvents mock after each test
  afterEach(() => {
    useEventStore().setFavoriteEvents.mockClear();
  });

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
    expect(useEventStore().setFavoriteEvents).toHaveBeenCalledWith([{
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

  });

});
