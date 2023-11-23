import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Banner from '../components/Banner';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as firebaseUtils from '../utilities/firebase';

vi.mock('react-router-dom', () => ({ useNavigate: vi.fn() }));
vi.mock('../utilities/firebase', () => ({
  useAuthState: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
  useDbData: vi.fn(() => [null, false, null])
}));

const theme = createTheme({
  palette: {
    mode: 'light',
    light: {
    },
    dark: {
      background: {
        paper: '#121212',
        default: '#121212'
      },
      text: {
        primary: '#fff',
        secondary: '#fff'
      }
    },
  },
});

describe('Banner Component', () => {
  beforeEach(() => {
    firebaseUtils.useAuthState.mockImplementation(() => [null]);
    firebaseUtils.useDbData.mockImplementation(() => [null, false, null]);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  // it('calls signInWithGoogle when the login button is clicked', () => {
  //   render(
  //     <ThemeProvider theme={theme}>
  //       <Banner />
  //     </ThemeProvider>
  //   );

  //   const loginButton = screen.findByText('LOGIN');
  //   fireEvent.click(loginButton);
  //   expect(firebaseUtils.signInWithGoogle).toHaveBeenCalled();
  // });

  it('calls signOut when the logout button is clicked', async () => {
    const mockUser = { displayName: 'Test User', photoURL: 'test_photo.jpg' };
    firebaseUtils.useAuthState.mockImplementation(() => [mockUser]);

    render(
      <ThemeProvider theme={theme}>
        <Banner />
      </ThemeProvider>
    );

    const userAvatarButton = screen.getByLabelText('Open settings');
    fireEvent.click(userAvatarButton);

    const logoutButton = await screen.findByText('Sign Out');
    fireEvent.click(logoutButton);
    expect(firebaseUtils.signOut).toHaveBeenCalled();
  });
});
