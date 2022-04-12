import * as React from 'react';
import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Slider, Stack, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HelpIcon from '@mui/icons-material/Help';
import {Link, useNavigate} from 'react-router-dom';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import { VolumeDown, VolumeUp } from '@mui/icons-material';
import { logout } from '../utils/utils';

export const NavigationBar = () => {
  
  const [tab, setTab] = useState(0);
  const [volume, setVolume] = React.useState<number>(30);

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    setVolume(newValue as number);
    localStorage.setItem('volume', String(newValue)); //TODO Necessary?
  };

  const toolbar = (
    <Box sx={{ width: 300, ml: 'auto', backgroundColor: 'lightgrey', color: 'black', borderRadius: '25px' }}>
      <Stack spacing={1} direction="row" alignItems="center" sx={{ ml: 1 }} >
        <VolumeDown />
        <Slider value={volume} onChange={handleVolumeChange} />
        <VolumeUp />
        <Stack spacing={-1} direction="row">
          <IconButton sx={{color: 'black'}}>
            <SettingsIcon />
          </IconButton>
          <IconButton sx={{color: 'black'}}>
            <InfoOutlinedIcon />
          </IconButton>
          <IconButton onClick={logout} sx={{color: 'black'}}>
            <LogoutIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );

  return(
    <>
      <BottomNavigation
        sx={{height: '75px', backgroundColor: 'transparent' }}
        showLabels
        value={tab}
        color="secondary"
        onChange={(event, newTab) => {
          setTab(newTab);
        }}
      >
        <BottomNavigationAction
          label="Home" component={Link} to='/' icon={<HomeIcon />}
          disabled={!localStorage.getItem('token')}
        />
        <Tooltip title='Coming soon!'>
          <BottomNavigationAction
            label="Profile" component={Link} to='/profile' icon={<PersonIcon />}
            disabled={!localStorage.getItem('token')}
          />
        </Tooltip>
        <Tooltip title='Coming soon!'>
          <BottomNavigationAction
            label="Ranked" component={Link} to='/ranked' icon={<EmojiEventsIcon />}
            disabled={true} //{!localStorage.getItem('token')}
          />
        </Tooltip>
        <Tooltip title='Coming soon!'>
          <BottomNavigationAction
            label="Tutorial" component={Link} to='/tutorial' icon={<HelpIcon />}
            disabled={true} //{!localStorage.getItem('token')}
          />
        </Tooltip>
      </BottomNavigation>
      {toolbar}
    </>
  );
};