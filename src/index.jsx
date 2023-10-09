import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4E2A84'
    },
    darkbackground: {
      main: '#fff',
      contrastText: '#000'
    },
    contrast: {
      main: '#6D28D9',
      light: '#fff',
      dark: '#4c1d95',
      contrastText: '#fff'
    },
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
