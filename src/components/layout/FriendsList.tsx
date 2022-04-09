import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import { Friends } from './Friends';
import { IconButton } from '@mui/material';

import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';

const drawerWidth = 240;

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

const FriendsList = () => {
  const open = useAppSelector(state => state.drawer.isOpen)
  const dispatch = useAppDispatch()

  const toggleDrawer = () => {
    // Use Redux state for this.
    dispatch({ type: 'drawer/toggle' })
  };

  return (
    <Drawer variant="permanent" open={open}>
      <Friends />
      <IconButton onClick={toggleDrawer}
        sx={{
          position: 'absolute',
          top: '50%',
          right: '0px',
          transform: 'translateY(-50%)'
        }}
      >
        {open ? <ArrowBackIosOutlinedIcon /> : <ArrowForwardIosOutlinedIcon />}
      </IconButton>
      <IconButton onClick={() => { alert('They see me scrollin\''); } } // TODO: Scroll feature
        sx={{
          position: 'absolute',
          bottom: '15px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      >
        <ArrowDropDownCircleOutlinedIcon />
      </IconButton>
    </Drawer>
  );
};

export default FriendsList;