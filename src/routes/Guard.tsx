import * as React from 'react';
import { WithChildren } from '../utils/utils';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { useEffect } from 'react';

export const DefaultRoute = () => {
  return (
    <Navigate to={'/'} />
  );
};

// eslint-disable-next-line @typescript-eslint/ban-types
type GuardProps = WithChildren<{}>;

const Guard = ({ children }: GuardProps) => {

  //const forceUpdate = useForceUpdate();

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const href = window.location.href;
  const token = localStorage.getItem('token');

  useEffect(() => {
    switch (location.pathname) {
    case '/login':
      if (!token) {
        dispatch({ type: 'modal/setState', payload: { isOpen: true, modalWindow: 'login' } });
        return;
      }
      break;
    case '/register':
      if (!token) {
        dispatch({type: 'modal/setState', payload: {isOpen: true, modalWindow: 'register'}});
      }
      return;
    case '/reset':
      dispatch({type: 'modal/setState', payload: {isOpen: true, modalWindow: 'reset'}});
      return;
    case '/reset/tokenEntry':
      dispatch({type: 'modal/setState', payload: {isOpen: true, modalWindow: 'tokenEntry'}});
      /*default:
        if (location.pathname.startsWith('/reset/')) {
          dispatch({ type: 'modal/setState', payload: { isOpen: true, modalWindow: 'tokenEntry' } });
        }*/
      return;
    }
    // FIXME: Fix this!
    if (!token && !href.includes('/lobby')) {
      navigate('/login');
      //window.location.reload();
      //forceUpdate();
    }

    //return () => ;
  }, [dispatch, location.pathname, navigate, token, href]);

  return (
    <>
      {children}
    </>
  );
};

export default Guard;