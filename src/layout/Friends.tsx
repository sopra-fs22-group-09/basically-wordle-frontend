import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import FaceIcon from '@mui/icons-material/Face';
import PersonIcon from '@mui/icons-material/Person';
import Divider from '@mui/material/Divider';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Maybe } from '../models';
import { User, UserStatus } from '../models/User';
import { Button, Skeleton } from '@mui/material';
import { useEffect } from 'react';
import { MutationInviteToLobbyArgs } from '../models/Lobby';
import { useMatch } from 'react-router-dom';

const ALL_FRIENDS = gql`
  query getAllFriends {
    allFriends {
      id
      username
      status
    }
  }
`;

const UPDATE_FRIENDS_SUBSCRIPTION = gql`
  subscription getFriendsUpdates {
    friendsUpdates {
      id
      username
      status
    }
  }
`;

const LOBBY_INVITE = gql`
  mutation sendLobbyInvite($input: LobbyInviteInput!) {
    inviteToLobby(input: $input)
  }
`;

interface AllFriendsQuery {
  allFriends: Array<Maybe<User>>;
}

interface FriendsUpdatesSubscription {
  friendsUpdates: User;
}

const Friends = () => {
  const token = localStorage.getItem('token');
  const { loading, data, subscribeToMore } = useQuery<AllFriendsQuery>(ALL_FRIENDS, {
    skip: !token,
  });
  const [sendLobbyInvite] = useMutation<{ inviteToLobby: boolean }, MutationInviteToLobbyArgs>(LOBBY_INVITE);

  const match = useMatch('/lobby/:id');

  useEffect(() => {
    if (token) {
      const unsubscribe = subscribeToMore<FriendsUpdatesSubscription>({
        document: UPDATE_FRIENDS_SUBSCRIPTION,
      });
      return () => unsubscribe();
    }
  }, [subscribeToMore, token]);

  const inviteToLobby = (userId: string, lobbyId: string) => {
    sendLobbyInvite({
      variables: {
        input: {
          lobbyId: lobbyId,
          recipientId: userId,
        },
      },
    });
  };

  const myProfile = (
    <ListItem sx={{ position: 'sticky', top: '0', backgroundColor: 'primary.dark', zIndex: 1, height: '75px' }}>
      {loading ? (
        <>
          <Skeleton animation="pulse" variant="circular" width={40} height={40} />
          <Skeleton animation="wave" variant="text" sx={{ ml: '15px' }} width={120} />
        </>
      ) : (
        <>
          <ListItemAvatar
            sx={{ border: 'white solid 5px', borderRadius: '50%', minWidth: '0', ml: '-7px', mr: '12px' }}
          >
            <Avatar>
              <FaceIcon />
            </Avatar>
          </ListItemAvatar>
          {localStorage.getItem('userName') && <ListItemText primary={localStorage.getItem('userName')} secondary="Online" />}
        </>
      )}
    </ListItem>
  );

  return (
    <List sx={{mt: '-8px', height: '100vh', overflowY: 'auto', overflowX: 'hidden', '&::-webkit-scrollbar': { display: 'none' }, scrollbarWidth: 'none'}}>
      {myProfile}
      {/* I don't get the sorting */}
      {data?.allFriends
        .flatMap((f) => (f ? [f] : []))
        .sort((f1, _) => (f1.status == UserStatus.ONLINE ? 1 : f1.status == UserStatus.AWAY ? 0 : -1))
        .map((f, i) => (
          <React.Fragment key={i}>
            <ListItem sx={{ pl: '9px' }}>
              {loading ? (
                <>
                  <Skeleton animation="pulse" variant="circular" width={40} height={40} />
                  <Skeleton animation="wave" variant="text" sx={{ ml: '15px' }} width={120} />
                </>
              ) : (
                <>
                  <ListItemAvatar
                    sx={{
                      border:
                        f.status == UserStatus.ONLINE
                          ? 'green solid 5px'
                          : f.status == UserStatus.AWAY
                            ? 'orange solid 5px'
                            : f.status == UserStatus.INGAME || f.status == UserStatus.CREATING_LOBBY
                              ? 'red solid 5px'
                              : 'transparent solid 5px',
                      borderRadius: '50%', minWidth: '0', mr: '12px'
                    }}
                  >
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={f.username}
                    secondary={f.status.charAt(0) + f.status.substring(1).toLowerCase().replace('_', ' ')}
                  />
                  {
                    /* TODO: only if creating non-solo lobby */
                    match && (f.status == UserStatus.ONLINE || f.status == UserStatus.AWAY) && (
                      <Button onClick={() => inviteToLobby(f.id, match.params.id as string)}>Invite</Button>
                    )
                  }
                </>
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
    </List>
  );
};

export default Friends;
