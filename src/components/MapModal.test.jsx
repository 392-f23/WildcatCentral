import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import MapModal, { fetchCoordinatesFromName } from './MapModal';

vi.mock('./MapModal', async () => {
    const actual = await vi.importActual('./MapModal');
    
    return {
      default: actual.default,
      fetchCoordinatesFromName: vi.fn(() => Promise.resolve({
          latitude: 40.748817,
          longitude: -73.985428
      })),
    };
});

describe('<MapModal />', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('shows a message when no coordinates or location name are provided', () => {
        render(<MapModal isOpen={true} />);

        expect(screen.getByText(/No location coordinates provided for this event/i)).toBeInTheDocument();
    });

    it('displays the map with coordinates when provided', async () => {
        const latitude = 40.748817;
        const longitude = -73.985428;

        render(<MapModal isOpen={true} latitude={latitude} longitude={longitude} locationName="Empire State Building" />);

        expect(screen.getByText('Empire State Building')).toBeInTheDocument();
        // You should add more expectations here to check if the map is displayed correctly
    });

    it('handles the error if fetching coordinates fails', async () => {
        fetchCoordinatesFromName.mockImplementationOnce(() => Promise.reject(new Error('Failed to fetch')));
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        render(<MapModal isOpen={true} locationName="Nonexistent Place" />);

        await waitFor(() => {
            expect(screen.getByText(/Sorry for the inconvenience/i)).toBeInTheDocument();
        });

        consoleSpy.mockRestore();
    });

    it('does not display the map when isOpen is false', () => {
        render(<MapModal isOpen={false} />);

        expect(screen.queryByTestId('map-container')).not.toBeInTheDocument();
    });

    it('displays the map with a marker when given coordinates', async () => {
        const latitude = 40.748817;
        const longitude = -73.985428;

        render(<MapModal isOpen={true} latitude={latitude} longitude={longitude} />);

        await waitFor(() => {
            const mapContainer = screen.getByTestId('map-container');
            const marker = within(mapContainer).getByAltText('Marker');
            expect(mapContainer).toBeInTheDocument();
            expect(marker).toBeInTheDocument();
        });
    });
});
