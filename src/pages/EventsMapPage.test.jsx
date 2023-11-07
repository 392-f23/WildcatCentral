import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";

import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import EventsMapPage from './EventsMapPage';
import useEventStore from '../stores/eventStore';
import { getDbData, writeToDb } from '../utilities/firebase';

console.log("asd");

vi.mock('../stores/eventStore', () => {
    const mockEvents = {
        'Individual Events': [{ id: 1, name: 'Event 1', latitude: 42.0, longitude: -87.0, organizationName: ['Org 1'] }],
        'School Org': [{ id: 2, name: 'Event 2', latitude: 41.0, longitude: -86.0, organizationName: ['Org 2'] }],
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

describe('<EventsMapPage />', () => {
    it('renders map and markers for events with coordinates', () => {
        render(<EventsMapPage />);
        expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });

    it('fetches and displays events on mount', async () => {
        render(<EventsMapPage />);

        // Now find all markers and click them to open the popup and check if the event name is displayed
        const markers = screen.getAllByAltText('Marker');
        for (let i = 0; i < markers.length; i++) {
            fireEvent.click(markers[i]);
            await waitFor(() => {
                expect(screen.getByText(`Event ${i + 1}`)).toBeInTheDocument();
            });
        }
    });

    it('allows toggling of favorite status for an event when logged in', async () => {
        getDbData.mockResolvedValue({ '1': 'Event 1' }); // Mock that the event with id '1' is a favorite

        render(<EventsMapPage />);

        // First click the marker to open the popup, the marker is a img with alt text 'Marker'
        // There might be multiple markers, so we need to get the one that is a child of the leaflet-marker-pane
        const markers = screen.getAllByAltText('Marker');
        let marker;
        for (let i = 0; i < markers.length; i++) {
            if (markers[i].closest('.leaflet-marker-pane')) {
                marker = markers[i];
                break;
            }
        }
        fireEvent.click(marker);

        // aria-label is add to favorites
        const toggleButton = screen.getByLabelText('add to favorites');
        fireEvent.click(toggleButton);

        // expect that the setFavoriteEvents function from the store is called with the correct event (1)
        expect(useEventStore().setFavoriteEvents).toHaveBeenCalledWith([{ id: 1, name: 'Event 1', latitude: 42.0, longitude: -87.0, organizationName: ['Org 1'] }]);
    });
});