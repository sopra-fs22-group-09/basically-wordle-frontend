import * as React from 'react';
import { styled } from '@mui/material/styles';
import FaceIcon from '@mui/icons-material/Face';
import { Avatar, IconButton, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { NavigationBar } from './NavigationBar';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect, useState } from 'react';

const Header = () => {
  const open = useAppSelector(state => state.drawer.isOpen);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size
  const muiFix = !useMediaQuery(theme.breakpoints.up('sm')); //screen smaller than defined size
  const toggleDrawer = () => dispatch({ type: 'drawer/toggle' });
  const [drawerWidth, setDrawerWidth] = useState('240px');
  interface AppBarProps extends MuiAppBarProps {open?: boolean;}
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth})`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  useEffect(() => setDrawerWidth(smallScreen ? '100vw' : '240px'), [smallScreen]);

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        {!open &&
          <IconButton onClick={toggleDrawer} sx={{ml: muiFix ? '-8px' : '-16px'}}>
            <Avatar sx={{ outline: 'white solid 5px' }}><FaceIcon /></Avatar>
          </IconButton>}
        <NavigationBar />
      </Toolbar>
    </AppBar>
  );
};

export default Header;