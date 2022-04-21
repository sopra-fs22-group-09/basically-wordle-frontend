import * as React from 'react';
import { WithChildren } from '../utils/utils';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks';
import { useEffect } from 'react';
import { useLocalStorage } from '@mantine/hooks';

export const DefaultRoute = () => {
  return (
    <Navigate to={'/'} />
  );
};

// eslint-disable-next-line @typescript-eslint/ban-types
type LayoutProps = WithChildren<{}>;

const Guard = ({ children }: LayoutProps) => {

  const [token] = useLocalStorage<string>({ key: 'token' });

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    switch (location.pathname) {
    case '/login':
      if (!token) {
        dispatch({ type: 'modal/setState', payload: { isOpen: true, modalWindow: 'login' } });
      }
      return;
    case '/register':
      if (!token) {
        dispatch({ type: 'modal/setState', payload: { isOpen: true, modalWindow: 'register' } });
      }
      return;
    case '/reset':
      dispatch({ type: 'modal/setState', payload: { isOpen: true, modalWindow: 'reset' } });
      return;
    case '/reset/tokenEntry':
      dispatch({ type: 'modal/setState', payload: { isOpen: true, modalWindow: 'tokenEntry' } });
      /*default:
      if (location.pathname.startsWith('/reset/')) {
        dispatch({ type: 'modal/setState', payload: { isOpen: true, modalWindow: 'tokenEntry' } });
      }*/
      return;
    }
    
    if (!token) {
      navigate('/login');
      window.location.reload();
    }
  });

  return (
    <>
      {children}
    </>
  );
};

export default Guard;