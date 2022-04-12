import * as React from 'react';
import {WithChildren} from '../utils/utils';
import {useLocation} from 'react-router-dom';
import {useAppDispatch} from '../redux/hooks';
import {useEffect} from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
type LayoutProps = WithChildren<{}>;

const Guard = ({ children }: LayoutProps) => {
  
  const dispatch = useAppDispatch();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname == '/login') {
      dispatch({ type: 'modal/setState', payload: {isOpen: true, modalWindow: 'login'} });
      return;
    }
    if (location.pathname == '/register') {
      dispatch({ type: 'modal/setState', payload: {isOpen: true, modalWindow: 'register'} });
      return;
    }
    if (location.pathname == '/reset') {
      dispatch({ type: 'modal/setState', payload: {isOpen: true, modalWindow: 'reset'} });
      return;
    }
    if (!localStorage.getItem('token')) {
      dispatch({ type: 'modal/setState', payload: {isOpen: true, modalWindow: 'login'} });
    }
  }, [dispatch, location]);

  return (
    <>
      {children}
    </>
  );
};

export default Guard;