import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import FaceIcon from '@mui/icons-material/Face';
import PersonIcon from '@mui/icons-material/Person';
import ImageIcon from '@mui/icons-material/Image';
import WorkIcon from '@mui/icons-material/Work';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

export const Friends = () => {

  const myProfile = (
    <ListItem
      sx={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'primary.dark',
        zIndex: 1,
        height: 75
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ outline: 'white solid 5px' }}>
          <FaceIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary="Me" secondary="Online" />
      <IconButton
        color="inherit"
        onClick={() => {alert('Still waiting to be implemented...');}} /*TODO: Show notification menu*/
      >
        <Badge badgeContent={'99+'} color="primary" >
          <NotificationsIcon />
        </Badge>
      </IconButton>
    </ListItem>
  );

  return (
    <List
      sx={{
        mt: -1,
        height: '100vh',
        overflowY: 'scroll',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      {myProfile}
      <ListItem>
        <ListItemAvatar>
          <Avatar sx={{ outline:'green solid 5px' }}>
            <PersonIcon/>
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="It's Britney Bitch" secondary="Online" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend1" secondary="Online" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <WorkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend2" secondary="Online" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend3" secondary="Online" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend4" secondary="Online" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend5" secondary="Online" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend6" secondary="Online" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend7" secondary="Online" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend8" secondary="Online" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend9" secondary="Online" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend10" secondary="Online" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend11" secondary="Online" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend12" secondary="Online" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend13" secondary="Online" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend14" secondary="Online" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend15" secondary="Online" />
      </ListItem>
    </List>
  );
}