import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import ErrorPage from './ErrorPage';

const navigate = vi.fn();

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => navigate,
  useRouteError: () => ({ message: 'Mocked Error' }),
}));

describe('<ErrorPage />', () => {
  test('renders the error message', () => {
    render(<ErrorPage />);
    expect(screen.getByText('Oops!')).toBeInTheDocument();
    expect(screen.getByText('Sorry, an unexpected error has occurred.')).toBeInTheDocument();
    expect(screen.getByText('Mocked Error')).toBeInTheDocument();
  });

  test('navigates back home when the button is clicked', () => {
    render(<ErrorPage />);
    fireEvent.click(screen.getByText('Return to Home'));
    expect(navigate).toHaveBeenCalledWith('/');
  });
});
