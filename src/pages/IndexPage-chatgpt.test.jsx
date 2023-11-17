import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import EventsDisplay from '../components/EventsDisplayPage';
describe('EventsDisplayPage Tests', () => {
    beforeEach(() => {
      // Reset mocks before each test
      vi.resetAllMocks();
    });
  
    it('should add event to favorite when heart icon is clicked', async () => {
      // Mock data
      const mockEvent = {
        id: 'event1',
        name: 'Sample Event',
        // other event properties
      };
      const mockEvents = [mockEvent];
      const mockFavoriteEvents = [];
  
      // Render the EventsDisplay component with mock data
      render(
        <EventsDisplay
          events={mockEvents}
          currentPage="All Events"
          searchQuery=""
          favoriteEvents={mockFavoriteEvents}
          toggleFavorite={(event) => {
            // logic to add event to favorites
          }}
        />
      );
  
      // Simulate clicking the heart icon
      fireEvent.click(screen.getByTestId('heart-icon-event1'));
  
      // Check if the event is added to favorites
      expect(mockFavoriteEvents.includes(mockEvent)).toBe(true);
    });
  });
  