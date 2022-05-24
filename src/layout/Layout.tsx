import * as React from 'react';
import Box from '@mui/material/Box';
import { READ_USERNAME, WithChildren } from '../utils/utils';
import { lazy, Suspense, useEffect } from 'react';
import { Skeleton, useMediaQuery, useTheme } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';
import { hideNotification, showNotification } from '@mantine/notifications';
import { Button } from '@mantine/core';
import { gql, useSubscription } from '@apollo/client';
import { LobbyInvite } from '../models/Lobby';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { User } from '../models/User';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

// Do this explicitly if you need the component to have children!
// eslint-disable-next-line @typescript-eslint/ban-types
type LayoutProps = WithChildren<{}>;

const INVITATION_SUBSCRIPTION = gql`
  subscription subscribeInvitations {
    lobbyInvites {
      lobbyId
      senderId
    }
  }
`;

const Layout = ({ children }: LayoutProps) => {

  const Header = lazy(() => import('./Header'));
  const FriendsList = lazy(() => import('./FriendsList'));

  const navigate = useNavigate();
  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size
  const dispatch = useAppDispatch();
  const open = useAppSelector(state => state.drawer.isOpen);

  useEffect(() => {
    if (smallScreen) dispatch({ type: 'drawer/setState', action: false });
  }, [dispatch, smallScreen]);

  const acceptInvite = (invite: LobbyInvite) => {
    hideNotification('invite-' + invite.senderId);
    navigate('/lobby/' + invite.lobbyId);
  };

  const showInvitation = (invite: LobbyInvite) => {
    const { username: friendName } = api.readFragment<User>({
      fragment: READ_USERNAME,
      id: 'User:' + invite.senderId
    }) ?? { username: 'unknown' };
    showNotification({
      id: 'invite-' + invite.senderId,
      title: 'Lobby Invite',
      message: <>Hey there from {friendName}! 🤥<br /><Button onClick={() => acceptInvite(invite)}>Join</Button></>,
      autoClose: false,
      //icon: <Cross1Icon />,
      styles: (_) => ({
        root: {
          backgroundColor: theme.palette.background.default,
          borderColor: theme.palette.divider,

          '&::before': { backgroundColor: theme.palette.common.white },
        },

        title: { color: theme.palette.common.white },
        description: { color: theme.palette.common.white },
        closeButton: {
          color: theme.palette.common.white,
          '&:hover': { backgroundColor: theme.palette.action.hover },
        },
      })
    });
  };

  useSubscription<{ lobbyInvites: LobbyInvite }>(INVITATION_SUBSCRIPTION, {
    onSubscriptionData: data => {
      if (data.subscriptionData.data) {
        showInvitation(data.subscriptionData.data.lobbyInvites);
      }
    },
    skip: !localStorage.getItem('token')
    //shouldResubscribe: true
  });

  return (
    <Box sx={{display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Suspense fallback={<Skeleton variant="rectangular"><MuiAppBar /></Skeleton>}>
        <Header />
      </Suspense>
      {(!smallScreen || open) && <Suspense fallback={<Skeleton variant="rectangular"><MuiDrawer /></Skeleton>}>
        <FriendsList />
      </Suspense>}
      <Box
        component="main"
        sx={{
          width: '100%',
          height: 'calc(100% - 75px)',
          pb: '30px',
          transform: 'translate(0, 75px)',
          overflowY: 'scroll',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {display: 'none' },
          scrollbarWidth: 'none',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;