import * as React from 'react';
import { WithChildren } from '../utils/utils';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useLayoutEffect } from 'react';
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
  const dispatch = useAppDispatch();
  const open = useAppSelector(state => state.modal.isOpen);

  useLayoutEffect(() => {
    switch (location.pathname) {
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
    
    if (!token && !open) {
      dispatch({ type: 'modal/setState', payload: { isOpen: true, modalWindow: 'login' } });
    }
  });

  return (
    <>
      {children}
    </>
  );
};

export default Guard;