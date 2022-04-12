import * as React from 'react';
import {WithChildren} from '../utils/utils';
import {Navigate, useLocation, useNavigate} from 'react-router-dom';
import {useAppDispatch} from '../redux/hooks';
import {useEffect} from 'react';

export const DefaultRoute = () => {
  return (
    <Navigate to={'/'} />
  );
};

// eslint-disable-next-line @typescript-eslint/ban-types
type LayoutProps = WithChildren<{}>;

const Guard = ({ children }: LayoutProps) => {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    switch (location.pathname) {
    case '/login':
      if (localStorage.getItem('token')) {
        navigate('/');
        return;
      }
      dispatch({ type: 'modal/setState', payload: {isOpen: true, modalWindow: 'login'} });
      return;
    case '/register':
      if (localStorage.getItem('token')) {
        navigate('/');
        return;
      }
      dispatch({ type: 'modal/setState', payload: {isOpen: true, modalWindow: 'register'} });
      return;
    case '/reset':
      // if (localStorage.getItem('token')) {
      //   navigate('/');
      //   return;
      // }
      dispatch({ type: 'modal/setState', payload: {isOpen: true, modalWindow: 'reset'} });
      return;
    }
    
    if (!localStorage.getItem('token')) {
      dispatch({ type: 'modal/setState', payload: {isOpen: true, modalWindow: 'login'} });
    }
  }, [location, navigate, dispatch]);

  return (
    <>
      {children}
    </>
  );
};

export default Guard;