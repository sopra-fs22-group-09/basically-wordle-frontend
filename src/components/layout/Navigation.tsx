import * as React from 'react';
import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HelpIcon from '@mui/icons-material/Help';
import { Link } from 'react-router-dom';

export const Navigation = () => {
  
  const [value, setValue] = useState(0);

  return(
    <BottomNavigation
      sx={{float: 'left', height: 75}}
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
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
          disabled={!localStorage.getItem('token')}
        />
      </Tooltip>
      <Tooltip title='Coming soon!'>
        <BottomNavigationAction
          label="Tutorial" component={Link} to='/tutorial' icon={<HelpIcon />}
          disabled={!localStorage.getItem('token')}
        />
      </Tooltip>
    </BottomNavigation>
  );
};