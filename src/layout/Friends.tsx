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
import { gql, useMutation, useQuery } from '@apollo/client';
import { Maybe } from '../models';
import { MutationAddFriendArgs, User, UserStatus } from '../models/User';
import { Skeleton } from '@mui/material';
//import { useLocalStorage } from '@mantine/hooks';

const ALL_FRIENDS = gql`
  query getAllFriends {
    allFriends {
      id
      username
      status
    }
  }
`;

const ADD_FRIEND = gql`
  mutation addFriend($friendId: ID!) {
	  addFriend (friendId: $friendId)
  }
`;

interface AllUsersQuery {
  friendsByStatus: Array<Maybe<User>>;
}

const Friends = () => {

  const { loading, data, error } = useQuery<AllUsersQuery>(ALL_FRIENDS, {skip: !localStorage.getItem('token')});
  const addFriend = useMutation<MutationAddFriendArgs>(ADD_FRIEND);

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
      <ListItemText primary={localStorage.getItem('userName')} secondary="Online" />
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
      <Divider variant="inset" component="li" />
      {data?.friendsByStatus?.flatMap(f => f ? [f] : []).sort((f1, _) => f1.status == UserStatus.ONLINE ? 1 : f1.status == UserStatus.AWAY ? 0 : -1).map((f, i) => (
        <React.Fragment key={i}>
          <ListItem>
            {
              loading ? (
                <><Skeleton animation='wave' variant='circular' width={30} height={30} /><Skeleton animation='wave' variant='text' /></>
              ) : (
                <><ListItemAvatar>
                  <Avatar>
                    <ImageIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={f.username} secondary={f.status} /></>
              )}
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
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
        <ListItemText primary="Friend1" secondary="Offline" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <WorkIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend2" secondary="Offline" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend3" secondary="Offline" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend4" secondary="Offline" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend5" secondary="Offline" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend6" secondary="Offline" />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <BeachAccessIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Friend7" secondary="Offline" />
      </ListItem>
    </List>
  );
};

export default Friends;