import * as React from 'react';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {User} from '../models/User';
import {gql, useMutation} from '@apollo/client';
import {Alert, Avatar, Box, Button, Grid, Link, Modal, TextField, Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {LoadingOverlay} from '@mantine/core';

interface LoginFields {
  username: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}

interface LoginData {
  user: LoginFields;
}

interface LoginType {
  login: User;
}

const LOGIN_USER = gql`
      mutation signIn($user: LoginInput!) {
        login(input: $user) {
		      id
		      username
          email
          #verified
	      }
      }
    `;

const Login = () => {
  
  const dispatch = useAppDispatch();

  const open = useAppSelector(state => state.modal.isOpen && state.modal.modalWindow == 'login');
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [loginUser, { data, loading, error }] = useMutation<LoginType, LoginData>(LOGIN_USER);

  const closeModal = () => {
    dispatch({ type: 'modal/setState', payload: {isOpen: false} });
  };
  const swapModal = (newModal: string) => {
    dispatch({ type: 'modal/setState', payload: {isOpen: true, modalWindow: newModal } });
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    loginUser({
      variables: {
        user: {
          username: formData.get('username'),
          password: formData.get('password') }
      },
      onCompleted(data) {
        if (data.login) {
          localStorage.setItem('userId', data.login.id as string);
          closeModal();
        }
      }
    });
  };
  
  return (
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
                <Link component="button" variant="body2" onClick={() => swapModal('reset')}>
                  Forgot your password?
                </Link>
              </Grid>
              <Grid item>
                <Link component="button" variant="body2" onClick={() => swapModal('register')}>
                  {'Don\'t have an account? Sign Up'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default Login;