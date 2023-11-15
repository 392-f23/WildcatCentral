// individualEvents.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import EventsMapPage from './EventsMapPage';
import useEventStore from '../stores/eventStore';

// Mock your event store
vi.mock('../stores/eventStore', () => {
  const mockEvents = {
    'Individual Events': [
      { id: 1, name: 'Event 1', latitude: 42.0, longitude: -87.0, organizationName: ['Individual Org 1'] }
    ],
    'School Org': [
        { id: 1, name: 'Event 1', latitude: 42.0, longitude: -87.0, organizationName: ['School Org 1'] }
    ],
    // ... other event categories
  };

  const useEventStore = vi.fn((selector) => {
    if (typeof selector === 'function') {
      // Call the selector with the mock state
      return selector({
        events: mockEvents,
        // ... other mock state properties
      });
    }
    return {
      events: mockEvents,
      // ... other mock return values
    };
  });

  return { default: useEventStore };
});

describe('Individual Events on EventsMapPage', () => {
  it('displays only individual events markers when individual events option is selected', async () => {
    render(<EventsMapPage />);
    
    // Simulate the user selecting 'Individual Events'
    // Replace 'individual-events-filter' with your actual filter element's test id or text
    fireEvent.click(screen.getByTestId('individual-events-filter'));

    await waitFor(() => {
      // Verify that only individual event markers are present
      const markers = screen.getAllByAltText('Marker');
      markers.forEach(marker => {
        fireEvent.click(marker);
        // Verify the popup content belongs to individual events
        expect(screen.getByText('Individual Org 1')).toBeInTheDocument();
      });

      // Optionally, assert that non-individual events are not present if needed
      // expect(screen.queryByText('Non-Individual Event')).not.toBeInTheDocument();
    });
  });

  // Add any additional tests relevant to individual events here
});
