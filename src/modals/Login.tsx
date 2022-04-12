import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {User} from '../models/User';
import {gql, useMutation} from '@apollo/client';
import {Alert, Avatar, Box, Button, Grid, Link, Modal, TextField, Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {LoadingOverlay} from '@mantine/core';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';

export type LoginInput = {
  username: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
};

export type MutationLoginArgs = {
  input: LoginInput;
};

interface LoginType {
  login: User;
}

const LOGIN_USER = gql`
  mutation signIn($input: LoginInput!) {
    login(input: $input) {
      id
      username
      email
      #verified
    }
  }
`;

const Login = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const open = useAppSelector(state => state.modal.isOpen && state.modal.modalWindow == 'login');
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [loginUser, { data, loading, error }] = useMutation<LoginType, MutationLoginArgs>(LOGIN_USER);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    loginUser({
      variables: {
        input: {
          username: formData.get('username'),
          password: formData.get('password') }
      },
      onCompleted(data) {
        if (data.login) {
          localStorage.setItem('userId', data.login.id as string);
          if (location.pathname == '/login') {
            navigate('/');
          }
          dispatch({ type: 'modal/setState', payload: {isOpen: false} });
        }
      }
    });
  };
  
  return (
    <>
      <Modal
        open={open}
      >
        <Box
          sx={{
            display: 'flex',
            position: 'absolute',
            width: '60%',
            height: '60%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'black',
            boxShadow: 24,
          }}
        >
          <Box sx={{ width:'80%', height:'80%', m:'auto', textAlign:'center' }}>
            <Avatar sx={{ m: 'auto', bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign In
            </Typography>
            {(!loading && error) &&
                <Alert sx={{ mt: 3, minWidth: 1, maxWidth: 1 }} variant="filled" severity="error">{error.message}</Alert>}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="username"
                label="Username"
                id="username"
                autoComplete="username"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <LoadingOverlay visible={loading} />
              <Grid container>
                <Grid item xs>
                  <Link component="button" variant="body2" onClick={() => navigate('reset')}>
                    Forgot your password?
                  </Link>
                </Grid>
                <Grid item xs>
                  <Link component="button" variant="body2" onClick={() => navigate('register')}>
                    {'Don\'t have an account? Sign Up'}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Outlet />
    </>
  );
};

export default Login;