import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
//import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
//import MenuIcon from '@mui/icons-material/Menu';
//import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';

import { WithChildren } from '../../utils/utils';
import { Navigation } from './Navigation';
import { Friends } from './Friends';
//import Footer from './Footer';
import Avatar from '@mui/material/Avatar';
import FaceIcon from '@mui/icons-material/Face';
import Badge from '@mui/material/Badge';

// Do this explicitly if you need the component to have children!
// eslint-disable-next-line @typescript-eslint/ban-types
type LayoutProps = WithChildren<{}>;

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

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const Layout = ({ children }: LayoutProps) => {

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{display: 'flex'}}>
      <AppBar position="absolute" open={open}>
        <Toolbar>
          {!open &&
            <Badge badgeContent={''} color="secondary" sx={{ml: -1, mr: 4}}>
              <Avatar sx={{ outline: 'white solid 5px' }}>
                <FaceIcon />
              </Avatar>
            </Badge>
          }
          <Navigation/>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Friends/>
        <IconButton onClick={toggleDrawer}
          sx={{
            position:'absolute',
            top:'50%',
            right:'0px',
            transform:'translateY(-50%)'
          }}
        >
          {open ? <ArrowBackIosOutlinedIcon/> : <ArrowForwardIosOutlinedIcon />}
        </IconButton>
        <IconButton onClick={() => {parent.scroll(0, 10000)}}
          sx={{
            position:'absolute',
            bottom:'15px',
            left:'50%',
            transform:'translateX(-50%)'
          }}
        >
          <ArrowDropDownCircleOutlinedIcon />
        </IconButton>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 9.75,
          minHeight: '100vh', //TODO: Figure out how to get windows size - footer size
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