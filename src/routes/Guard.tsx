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
    switch (location.pathname) {
    case '/login':
      navigate('/');
      dispatch({ type: 'modal/setState', payload: {isOpen: true, modalWindow: 'login'} });
      return;
    case '/register':
      navigate('/');
      dispatch({ type: 'modal/setState', payload: {isOpen: true, modalWindow: 'register'} });
      return;
    case '/reset':
      //  navigate('/');
      dispatch({ type: 'modal/setState', payload: {isOpen: true, modalWindow: 'reset'} });
      return;
    }
    
    if (!localStorage.getItem('token') && !open) { //TODO !open does not work, redirection still happens on wrong username/pw combination
      navigate('/');
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