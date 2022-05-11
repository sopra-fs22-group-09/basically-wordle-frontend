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
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Maybe } from '../models';
import { User, UserStatus } from '../models/User';
import { Button, Skeleton } from '@mui/material';
//import { useEffect } from 'react';
import { MutationInviteToLobbyArgs } from '../models/Lobby';
import { useMatch } from 'react-router-dom';
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

const LOBBY_INVITE = gql`
  mutation sendLobbyInvite($input: LobbyInviteInput!) {
    inviteToLobby (input: $input)
  }
`;

interface AllUsersQuery {
  allFriends: Array<Maybe<User>>;
}

const Friends = () => {

  const { loading, data } = useQuery<AllUsersQuery>(ALL_FRIENDS, {skip: !localStorage.getItem('token')});
  const [sendLobbyInvite] = useMutation<{ inviteToLobby: boolean }, MutationInviteToLobbyArgs>(LOBBY_INVITE);

  const match = useMatch('/lobby/:id');

  const inviteToLobby = (userId: string, lobbyId: string) => {
    sendLobbyInvite({
      variables: {
        input: {
          lobbyId: lobbyId,
          recipientId: userId
        }
      }
    });
  };

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
      {
        loading ? (
          <><Skeleton animation='pulse' variant='circular' width={40} height={40} /><Skeleton animation='wave' variant='text' sx={{ml: '15px'}} width={120} /></>
        ) : (
          <>
            <ListItemAvatar>
              <Avatar sx={{ outline: 'white solid 5px' }}>
                <FaceIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={localStorage.getItem('userName')} secondary="Online" />
            <IconButton
              color="inherit"
              onClick={() => { alert('Still waiting to be implemented...'); } } /*TODO: Show notification menu*/
            >
              <Badge badgeContent={'99+'} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </>
        )
      }
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
      {data?.allFriends.flatMap(f => f ? [f] : []).sort((f1, _) => f1.status == UserStatus.ONLINE ? 1 : f1.status == UserStatus.AWAY ? 0 : -1).map((f, i) => (
        <React.Fragment key={i}>
          <ListItem>
            {
              loading ? (
                <><Skeleton animation='pulse' variant='circular' width={40} height={40} /><Skeleton animation='wave' variant='text' sx={{ml: '15px'}} width={120} /></>
              ) : (
                <><ListItemAvatar>
                  <Avatar sx={{ outline: f.status == UserStatus.ONLINE ? 'green solid 5px' : f.status == UserStatus.AWAY ? 'orange solid 5px'
                    : f.status == UserStatus.INGAME ? 'red solid 5px' : '' }}>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={f.username} secondary={f.status.charAt(0) + f.status.substring(1).toLowerCase()} />
                {/* TODO: only if creating non-solo lobby */
                  match && (f.status == UserStatus.ONLINE || f.status == UserStatus.AWAY) &&
                  <Button onClick={() => inviteToLobby(f.id, match.params.id as string)}>Invite</Button>
                }</>
              )
            }
          </ListItem>
          <Divider variant="inset" component="li" />
        </React.Fragment>
      ))}
      {/* TODO: Remove this asap! */}
      <ListItem>
        {
          loading ? (
            <><Skeleton animation='pulse' variant='circular' width={40} height={40} /><Skeleton animation='wave' variant='text' sx={{ml: '15px'}} width={120} /></>
          ) : (
            <><ListItemAvatar>
              <Avatar sx={{ outline: 'orange solid 5px' }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar><ListItemText primary="It's Britney Bitch" secondary="Away" /></>
          )
        }
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        {
          loading ? (
            <><Skeleton animation='pulse' variant='circular' width={40} height={40} /><Skeleton animation='wave' variant='text' sx={{ml: '15px'}} width={120} /></>
          ) : (
            <><ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar><ListItemText primary="Friend1" secondary="Offline" /></>
          )
        }
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        {
          loading ? (
            <><Skeleton animation='pulse' variant='circular' width={40} height={40} /><Skeleton animation='wave' variant='text' sx={{ml: '15px'}} width={120} /></>
          ) : (
            <><ListItemAvatar>
              <Avatar>
                <WorkIcon />
              </Avatar>
            </ListItemAvatar><ListItemText primary="Friend2" secondary="Offline" /></>
          )
        }
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        {
          loading ? (
            <><Skeleton animation='pulse' variant='circular' width={40} height={40} /><Skeleton animation='wave' variant='text' sx={{ml: '15px'}} width={120} /></>
          ) : (
            <><ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar><ListItemText primary="Friend3" secondary="Offline" /></>
          )
        }
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        {
          loading ? (
            <><Skeleton animation='pulse' variant='circular' width={40} height={40} /><Skeleton animation='wave' variant='text' sx={{ml: '15px'}} width={120} /></>
          ) : (
            <><ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar><ListItemText primary="Friend4" secondary="Offline" /></>
          )
        }
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        {
          loading ? (
            <><Skeleton animation='pulse' variant='circular' width={40} height={40} /><Skeleton animation='wave' variant='text' sx={{ml: '15px'}} width={120} /></>
          ) : (
            <><ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar><ListItemText primary="Friend5" secondary="Offline" /></>
          )
        }
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        {
          loading ? (
            <><Skeleton animation='pulse' variant='circular' width={40} height={40} /><Skeleton animation='wave' variant='text' sx={{ml: '15px'}} width={120} /></>
          ) : (
            <><ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar><ListItemText primary="Friend6" secondary="Offline" /></>
          )
        }
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        {
          loading ? (
            <><Skeleton animation='pulse' variant='circular' width={40} height={40} /><Skeleton animation='wave' variant='text' sx={{ml: '15px'}} width={120} /></>
          ) : (
            <><ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar><ListItemText primary="Friend7" secondary="Offline" /></>
          )
        }
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem>
        {
          loading ? (
            <><Skeleton animation='pulse' variant='circular' width={40} height={40} /><Skeleton animation='wave' variant='text' sx={{ml: '15px'}} width={120} /></>
          ) : (
            <><ListItemAvatar>
              <Avatar>
                <ImageIcon />
              </Avatar>
            </ListItemAvatar><ListItemText primary="Friend8" secondary="Offline" /></>
          )
        }
      </ListItem>
    </List>
  );
};

export default Friends;