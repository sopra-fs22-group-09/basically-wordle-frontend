import * as React from 'react';
import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Slider, Stack, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HelpIcon from '@mui/icons-material/Help';
import { Link } from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import { VolumeDown, VolumeUp } from '@mui/icons-material';
import { gql, useMutation } from '@apollo/client';
import { useAppSelector } from '../redux/hooks';
import { useLocalStorage } from '@mantine/hooks';

interface LogoutType {
  logout: boolean;
}

const LOGOUT_USER = gql`
  mutation {
    logout
  }
`;

export const NavigationBar = () => {
  const [tab, setTab] = useState(0);
  const [logoutUser] = useMutation<LogoutType>(LOGOUT_USER);
  const [token] = useLocalStorage<string>({ key: 'token' });
  const [volume, setVolume] = useLocalStorage<number>({ key: 'volume', defaultValue: 30 });
  const _open = useAppSelector(state => state.drawer.isOpen);

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
  };

  function logout() {
    localStorage.clear();
    logoutUser();
    window.location.reload();

  }

  const toolbar = (
    <Box sx={{width: 300, ml: 'auto', backgroundColor: 'lightgrey', color: 'black', borderRadius: '25px'}}>
      <Stack spacing={1} direction="row" alignItems="center" sx={{ml: 1}}>
        <VolumeDown/>
        <Slider value={volume} onChange={handleVolumeChange}/>
        <VolumeUp/>
        <Stack spacing={-1} direction="row">
          <IconButton sx={{color: 'black'}}>
            <SettingsIcon/>
          </IconButton>
          <IconButton sx={{color: 'black'}}>
            <InfoOutlinedIcon/>
          </IconButton>
          <IconButton onClick={logout} sx={{color: 'black'}}>
            <LogoutIcon/>
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );

  return (
    <>
      <BottomNavigation
        sx={{height: '75px', backgroundColor: 'transparent'}}
        showLabels
        value={tab}
        color="secondary"
        onChange={(event, newTab) => {
          setTab(newTab);
        }}
      >
        <BottomNavigationAction
          label="Home" component={Link} to="/" icon={<HomeIcon/>}
          disabled={!token}
        />
        <Tooltip title="Coming soon!">
          <BottomNavigationAction
            label="Profile" component={Link} to="/profile" icon={<PersonIcon/>}
            disabled={!token} style={!token ? { pointerEvents: 'none' } : {}}
          />
        </Tooltip>
        <Tooltip title="Coming soon!">
          <BottomNavigationAction
            label="Ranked" component={Link} to="/ranked" icon={<EmojiEventsIcon/>}
            disabled={true}
          />
        </Tooltip>
        <BottomNavigationAction
          label="Tutorial" component={Link} to="/tutorial" icon={<HelpIcon/>}
          disabled={!token}
        />
      </BottomNavigation>
      {toolbar}
    </>
  );
};