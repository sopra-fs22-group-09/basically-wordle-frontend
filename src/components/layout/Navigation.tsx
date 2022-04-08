import * as React from 'react';
import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import HelpIcon from '@mui/icons-material/Help';
import { Link } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import IconButton from '@mui/material/IconButton';

export const Navigation = () => {
  
  const [value, setValue] = useState(0);

  return(
    <>
      <BottomNavigation
        sx={{height: '75px', backgroundColor: 'transparent', m: 'auto'}}
        showLabels
        value={value}
        color="secondary"
        onChange={(event, newValue) => {
          setValue(newValue);
          console.log(value);
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
      <IconButton
        color="inherit"
        onClick={() => {alert('Still waiting to be implemented...');}} /*TODO: Show notification menu*/
      >
        <Badge badgeContent={'99+'} color="primary" >
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </>
  );
};