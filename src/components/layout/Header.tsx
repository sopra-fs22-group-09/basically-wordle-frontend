import * as React from 'react';
import { styled } from '@mui/material/styles';
import FaceIcon from '@mui/icons-material/Face';
import { Avatar, Badge, Toolbar } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { NavigationBar } from './NavigationBar';
import { useAppSelector } from '../../redux/hooks';

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

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
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Header = () => {
  const open = useAppSelector(state => state.drawer.isOpen)

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        {!open &&
          <Badge badgeContent={'99+'} color="primary" sx={{ml: -1, mr: 4}}>
            <Avatar sx={{ outline: 'white solid 5px' }}>
              <FaceIcon />
            </Avatar>
          </Badge>}
        <NavigationBar />
      </Toolbar>
    </AppBar>
  );
};

export default Header;