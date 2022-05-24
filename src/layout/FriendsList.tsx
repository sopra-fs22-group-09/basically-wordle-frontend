import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import { IconButton, Skeleton, useMediaQuery, useTheme } from '@mui/material';

import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { lazy, Suspense, useEffect, useState } from 'react';

const FriendsList = () => {
  const Friends = lazy(() => import('./Friends'));
  const open = useAppSelector(state => state.drawer.isOpen);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size
  const toggleDrawer = () => dispatch({ type: 'drawer/toggle' }); // TODO Use Redux state for this.
  const [drawerWidth, setDrawerWidth] = useState('240px');
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

  useEffect(() => setDrawerWidth(smallScreen ? '100vw' : '240px'), [smallScreen]);

  return (
    <Drawer variant="permanent" open={open}>
      <Suspense fallback={<Skeleton variant='rectangular' height='75px'></Skeleton>}>
        <Friends />
      </Suspense>
      <IconButton onClick={toggleDrawer} sx={{position: 'absolute', top: '50%', right: '0px', transform: 'translateY(-50%)'}}>
        {open ? <ArrowBackIosOutlinedIcon /> : <ArrowForwardIosOutlinedIcon />}
      </IconButton>
    </Drawer>
  );
};

export default FriendsList;