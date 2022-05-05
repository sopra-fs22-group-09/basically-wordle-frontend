import * as React from 'react';
import { createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import { routes as appRoutes } from './routes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Guard from './routes/Guard';
import { lazy, Suspense } from 'react';
import { Orbit } from '@uiball/loaders';
import LoaderCenterer from './components/loader';

function App() {
  // define theme
  const theme = createTheme({
    additional: {
      UiBallLoader: {
        colors: {
          main: '#234F20'
        }
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
          </Guard>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
