import * as React from 'react';
import { useEffect, useState } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HelpIcon from '@mui/icons-material/Help';
import { Link } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { gql, useApolloClient, useMutation } from '@apollo/client';

interface LogoutType {
  logout: boolean;
}

const LOGOUT_USER = gql`
  mutation {
    logout
  }
`;

export const NavigationBar = () => {
  const [tab, setTab] = useState(window.location.pathname === '/tutorial' ? 1 : window.location.pathname === '/about' ? 2 : 0);
  const [logoutUser] = useMutation<LogoutType>(LOGOUT_USER);
  const token = localStorage.getItem('token');
  const client = useApolloClient();

  useEffect(() => {
    const unsubscribe = client.onResetStore(async () => {
      localStorage.clear();
    });
    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    await logoutUser().then(async () => {
      await client.resetStore();
      window.location.reload();
    });
  }

  return (
    <>
      <BottomNavigation sx={{height: '75px', backgroundColor: 'transparent'}} showLabels value={tab} color="secondary" onChange={(event, newTab) => setTab(newTab)}>
        <BottomNavigationAction label="Home" component={Link} to="/" icon={<HomeIcon/>} disabled={!token}/>
        <BottomNavigationAction label="Tutorial" component={Link} to="/tutorial" icon={<HelpIcon/>} disabled={!token}/>
        <BottomNavigationAction label="About" component={Link} to="/about" icon={<InfoIcon/>} disabled={!token}/>
      </BottomNavigation>
      <IconButton onClick={logout} sx={{ml: 'auto'}}>
        <LogoutIcon/>
      </IconButton>
    </>
  );
};