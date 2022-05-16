import * as React from 'react';
import { createTheme, CssBaseline, ThemeProvider, Typography } from '@mui/material';
import { routes as appRoutes } from './routes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Guard from './routes/Guard';
import { lazy, Suspense } from 'react';
import { Orbit } from '@uiball/loaders';
import LoaderCenterer from './components/loader';
import { Footer } from '@mantine/core';

function App() {
  // define theme
  const theme = createTheme({
    additional: {
      UiBallLoader: {
        colors: {
          main: '#234F20'
        }
      },
      GameColoring: {
        colors: {
          correctPosition: '#00b300',
          inWord: 'orange',
          notInWord: 'black',
          notUsed: '#808080',
        }
      }
    },
    breakpoints: {
      values: {
        mobile: 1000,
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      }
    },
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

  const Layout = lazy(() => import('./layout/Layout'));
  const Login = lazy(() => import('./modals/Login'));
  const Register = lazy(() => import('./modals/Register'));
  const Reset = lazy(() => import('./modals/Reset'));
  const TokenEntry = lazy(() => import('./modals/TokenEntry'));
  const LobbyConfirmation = lazy(() => import('./modals/LobbyConfirmation'));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Router>
        <Suspense fallback={<LoaderCenterer><Orbit size={35} color={theme.additional.UiBallLoader.colors.main} /></LoaderCenterer>}>
          <Register />
          <Login />
          <Reset />
          <TokenEntry />
          <LobbyConfirmation />
          <Guard>
            <Suspense fallback={<LoaderCenterer><Orbit size={35} color={theme.additional.UiBallLoader.colors.main} /></LoaderCenterer>}>
              <Layout>
                <Suspense fallback={<LoaderCenterer><Orbit size={35} color={theme.additional.UiBallLoader.colors.main} /></LoaderCenterer>}>
                  <Routes>
                    {appRoutes
                      .filter(r => r.enabled)
                      .map((route) => (
                        <Route key={route.key} path={route.path} element={ <route.component />} />
                      ))
                    }
                  </Routes>
                </Suspense>
              </Layout>
            </Suspense>
            <Footer sx={{position: 'fixed', backgroundColor: 'rgba(50, 50, 50, 0.8)', textAlign: 'center', border: 'none', boxShadow: '0 -4px 8px 0 rgb(0 0 0 / 40%), 0 -6px 20px 0 rgb(0 0 0 / 50%)'}} height={'25px'}>
              <Typography>Build: {process.env.REACT_APP_GIT_REV} ({process.env.NODE_ENV})</Typography>
            </Footer>
          </Guard>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
