import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import ErrorPage from './ErrorPage';
import { useRouteError } from 'react-router-dom';

// Mocks
const navigate = vi.fn();
const consoleError = vi.spyOn(console, 'error');

// Mock implementation of useRouteError and useNavigate
vi.mock('react-router-dom', () => ({
    ...vi.importActual('react-router-dom'),
    useNavigate: () => navigate,
    useRouteError: vi.fn().mockReturnValue({ message: 'Mocked Error', statusText: 'Mocked Status' }),
}));

describe('<ErrorPage />', () => {
    beforeEach(() => {
        // Reset the mocks before each test
        navigate.mockClear();
        consoleError.mockClear();
        useRouteError.mockClear();
    });

    test('renders the error message', () => {
        render(<ErrorPage />);
        expect(screen.getByText('Oops!')).toBeInTheDocument();
        expect(screen.getByText('Sorry, an unexpected error has occurred.')).toBeInTheDocument();
        expect(screen.getByText(/Mocked Error|Mocked Status/)).toBeInTheDocument();
    });

    test('displays different error text when different error is received', () => {
        useRouteError.mockReturnValueOnce({ message: 'Different Error' });
        render(<ErrorPage />);
        expect(screen.getByText('Different Error')).toBeInTheDocument();
    });

    test('navigates back home when the button is clicked', () => {
        render(<ErrorPage />);
        fireEvent.click(screen.getByText('Return to Home'));
        expect(navigate).toHaveBeenCalledWith('/');
    });

    test('logs the error to the console', () => {
        render(<ErrorPage />);
        expect(consoleError).toHaveBeenCalledWith({ message: 'Mocked Error', statusText: 'Mocked Status' });
    });

    test('checks the presence of footer and its content', () => {
        render(<ErrorPage />);
        expect(screen.getByText('© 2023 Wildcat Central')).toBeInTheDocument();
        expect(screen.getByText('Northwestern University')).toBeInTheDocument();
    });
});
