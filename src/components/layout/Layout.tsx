import * as React from 'react';
import Box from '@mui/material/Box';
//import Divider from '@mui/material/Divider';
//import MenuIcon from '@mui/icons-material/Menu';
//import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { WithChildren } from '../../utils/utils';
import Header from './Header';
import FriendsList from './FriendsList';

// Do this explicitly if you need the component to have children!
// eslint-disable-next-line @typescript-eslint/ban-types
type LayoutProps = WithChildren<{}>;

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Header />
      <FriendsList />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 9.75,
          //minHeight: '100vh', //TODO: Figure out how to get windows size - footer size
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