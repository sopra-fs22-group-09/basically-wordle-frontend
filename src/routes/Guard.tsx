import * as React from 'react';
import {WithChildren} from '../utils/utils';
import {Navigate, useLocation, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
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
  const open = useAppSelector(state => state.modal.isOpen);

  useEffect(() => {
    if (!localStorage.getItem('token') && !open) {
      navigate('/login');
      dispatch({ type: 'modal/setState', payload: {isOpen: true, modalWindow: 'login'} });
    }

    switch (location.pathname) {
    case '/login':
      return;
    case '/register':
      if (!localStorage.getItem('token')) {
        dispatch({ type: 'modal/setState', payload: {isOpen: true, modalWindow: 'register'} });
      }
      return;
    case '/reset':
      dispatch({ type: 'modal/setState', payload: {isOpen: true, modalWindow: 'reset'} });
      return;
    }
  }, [location, navigate, dispatch, open]);

  return (
    <>
      {children}
    </>
  );
};

export default Guard;