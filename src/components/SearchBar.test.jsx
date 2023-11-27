import EventCard from '../components/EventCard';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useEventStore from '../stores/eventStore';
import { getDbData, writeToDb } from '../utilities/firebase';
import SearchBar from './SearchBar';
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
    const mockSetSearchQuery = vi.fn();

    const setCategories = vi.fn();

    const categories = ['Information/Mock Session 1', 'Information/Mock Session 2'];


    const useEventStore = vi.fn((selector) => {
        if (typeof selector === 'function') {
            // Call the selector with the mock state
            return selector({ events: mockEvents, favoriteEvents: mockFavorites, setFavoriteEvents, user: { uid: 'user1' }, setSearchQuery: mockSetSearchQuery, setCategories, categories });
        }
        return { events: mockEvents, favoriteEvents: mockFavorites, setFavoriteEvents, user: { uid: 'user1' }, setSearchQuery: mockSetSearchQuery, setCategories, categories };
    });

    return { default: useEventStore };
});

vi.mock('../utilities/firebase', () => ({
    getDbData: vi.fn(),
    writeToDb: vi.fn(),
}));

describe('<SearchBar />', () => {
    it('search bar', async () => {
      const mockHandleSearch = vi.fn();
      render(<SearchBar handleSearch={mockHandleSearch} />);
      const inputElement = screen.getByPlaceholderText('Search…');
      fireEvent.change(inputElement, { target: { value: 'Event 1' } });
  
      expect(mockHandleSearch).toHaveBeenCalledWith('Event 1');
    });
  });
