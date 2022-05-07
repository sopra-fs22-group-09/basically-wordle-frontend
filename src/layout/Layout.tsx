import * as React from 'react';
import Box from '@mui/material/Box';
import { WithChildren } from '../utils/utils';
import { lazy, Suspense } from 'react';
import { Skeleton } from '@mui/material';
import MuiAppBar from '@mui/material/AppBar';
import MuiDrawer from '@mui/material/Drawer';

// Do this explicitly if you need the component to have children!
// eslint-disable-next-line @typescript-eslint/ban-types
type LayoutProps = WithChildren<{}>;

const Layout = ({ children }: LayoutProps) => {

  const Header = lazy(() => import('./Header'));
  const FriendsList = lazy(() => import('./FriendsList'));
  
  return (
    <Box sx={{display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Suspense fallback={<Skeleton variant='rectangular'><MuiAppBar /></Skeleton>}>
        <Header />
      </Suspense>
      <Suspense fallback={<Skeleton variant='rectangular' width='240px'><MuiDrawer /></Skeleton>}>
        <FriendsList />
      </Suspense>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: 'calc(100% - 75px)',
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