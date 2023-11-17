import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, beforeEach, vi } from 'vitest';
import AppSpeedDial from './SpeedDial-ChatGPT';

// Mocks
const navigate = vi.fn();

// Mock implementation of useNavigate
vi.mock('react-router-dom', () => ({
    ...vi.importActual('react-router-dom'),
    useNavigate: () => navigate
}));

describe('<AppSpeedDial />', () => {
    beforeEach(() => {
        // Reset the mock before each test
        navigate.mockClear();
    });

    test('navigates to /favorites when Favorites is clicked', async () => {
        render(<AppSpeedDial />);
        fireEvent.click(screen.getByRole('button'));
        const favoriteButton = await screen.findByTestId('favorites-button');
        fireEvent.click(favoriteButton);
        expect(navigate).toHaveBeenCalledWith('/favorites');
    });

    test('navigates to /newevent when New Event is clicked', async () => {
        render(<AppSpeedDial />);
        fireEvent.click(screen.getByRole('button'));
        const newEventButton = await screen.findByTestId('newevent-button');
        fireEvent.click(newEventButton);
        expect(navigate).toHaveBeenCalledWith('/newevent');
    });
});
