import React from 'react';
import { createTheme, CssBaseline} from '@mui/material';
import { routes as appRoutes } from './routes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ThemeProvider } from '@mui/material/styles';

function App() {
  // define theme
  const theme = createTheme({
    palette: {
      primary: {
        light: '#63b8ff',
        main: '#0989e3',
        dark: '#005db0',
        contrastText: '#000',
      },
      secondary: {
        main: '#4db6ac',
        light: '#82e9de',
        dark: '#00867d',
        contrastText: '#000',
      },
      mode: 'dark'
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            {appRoutes.filter(r => r.enabled).map((route) => (
              <Route key={route.key} path={route.path} element={<route.component />} />
            ))}
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
