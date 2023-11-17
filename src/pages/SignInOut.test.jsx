import { render, fireEvent, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Banner from '../components/Banner';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import * as firebaseUtils from '../utilities/firebase';

vi.mock('react-router-dom', () => ({ useNavigate: vi.fn() }));
vi.mock('../utilities/firebase', () => ({
  useAuthState: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  useDbData: vi.fn(() => [null, false, null])
}));

// Create a default MUI theme
const theme = createTheme();

describe('Banner Component', () => {
  beforeEach(() => {
    firebaseUtils.useAuthState.mockImplementation(() => [null]);
    firebaseUtils.useDbData.mockImplementation(() => [null, false, null]);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('calls signInWithGoogle when the login button is clicked', () => {
    render(
      <ThemeProvider theme={theme}>
        <Banner />
      </ThemeProvider>
    );
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    expect(firebaseUtils.signInWithGoogle).toHaveBeenCalled();
  });
});
