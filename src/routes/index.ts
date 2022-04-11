import { FC } from 'react';
import { Route } from 'react-router-dom';
import Home from '../pages/home';
import Login from '../pages/login';
import Profile from '../pages/profile';
import Register from '../pages/register';
import Reset from '../pages/reset';
import Confirmation from '../pages/confirmation';
import Lobby from '../pages/lobby';
import TokenEntry from '../pages/tokenEntry';
import ResetSuccess from '../pages/resetSuccess';

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */

// interface
interface Route {
  key: string,
  title: string,
  path: string,
  enabled: boolean,
  // eslint-disable-next-line @typescript-eslint/ban-types
  component: FC<{}>
}

export const routes: Array<Route> = [
  {
    key: 'home-route',
    title: 'Home',
    path: '/',
    enabled: true,
    component: Home
  },
  {
    key: 'login-route',
    title: 'Login',
    path: '/login',
    enabled: true,
    component: Login
  },
  {
    key: 'registration-route',
    title: 'Register',
    path: '/register',
    enabled: true,
    component: Register
  },
  {
    key: 'lobby-route',
    title: 'Lobby',
    path: '/lobby',
    enabled: true,
    component: Lobby
  },
  {
    key: 'profile-route',
    title: 'Profile',
    path: '/profile',
    enabled: true,
    component: Profile
  },
  {
    key: 'password-reset-route',
    title: 'Password Reset',
    path: '/reset',
    enabled: true,
    component: Reset
  },
  {
    key: 'password-reset-success-route',
    title: 'Success',
    path: '/reset/tokenEntry/success',
    enabled: true,
    component: ResetSuccess
  },
  {
    key: 'token-entry-route',
    title: 'Password Reset',
    path: '/reset/tokenEntry',
    enabled: true,
    component: TokenEntry
  },
  {
    key: 'password-reset-confirmation-route',
    title: 'Password Reset Confirmation',
    path: '/reset/confirmation',
    enabled: true,
    component: Confirmation
  }
];
