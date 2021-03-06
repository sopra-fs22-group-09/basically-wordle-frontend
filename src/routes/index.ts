import { FC, lazy } from 'react';
import { Route } from 'react-router-dom';
import { DefaultRoute } from './Guard';

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

const Home = lazy(() => import('../pages/home'));
const Profile = lazy(() => import('../pages/profile'));
const Tutorial = lazy(() => import('../pages/tutorial'));
const About = lazy(() => import('../pages/about'));
//const Game = lazy(() => import('../pages/game'));
const Lobby = lazy(() => import('../components/lobby'));

export const routes: Array<Route> = [
  {
    key: 'home-route',
    title: 'Home',
    path: '/',
    enabled: true,
    component: Home,
  },
  {
    key: 'lobby-route',
    title: 'Lobby',
    path: '/lobby/:id',
    enabled: true,
    component: Lobby
  },
  /*  {
    key: 'game-route',
    title: 'Game',
    path: '/game/:id',
    enabled: true,
    component: Game
  },*/
  {
    key: 'profile-route',
    title: 'Profile',
    path: '/profile',
    enabled: false,
    component: Profile
  },
  {
    key: 'tutorial-route',
    title: 'Tutorial',
    path: '/tutorial',
    enabled: true,
    component: Tutorial
  },
  {
    key: 'about-route',
    title: 'About',
    path: '/about',
    enabled: true,
    component: About
  },
  {
    key: 'login-route',
    title: 'Login',
    path: '/login',
    enabled: !localStorage.getItem('token'),
    component: Home,
  },
  {
    key: 'register-route',
    title: 'Register',
    path: '/register',
    enabled: !localStorage.getItem('token'),
    component: Home,
  },
  {
    key: 'reset-route',
    title: 'Password Reset',
    path: '/reset',
    enabled: true,
    component: Home,
  },
  {
    key: 'token-entry-route',
    title: 'Token Entry',
    //path: '/reset/:token',
    path: '/reset/tokenEntry',
    enabled: true,
    component: Home,
  },
  {
    key: 'unmapped',
    title: 'Unmapped Page',
    path: '*',
    enabled: true,
    component: DefaultRoute,
  },
];