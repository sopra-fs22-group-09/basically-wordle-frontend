import * as React from 'react';
import {User} from '../models/User';
import {Alert, Avatar, Box, Button, Grid, Link, Modal, TextField, Typography} from '@mui/material';
import {gql, useMutation} from '@apollo/client';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

interface RegistrationFields {
  username: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}

interface RegistrationData {
  user: RegistrationFields;
}

interface RegisterType {
  register: User;
}

const ADD_USER = gql`
      mutation signUp($user: RegisterInput!) {
        register(input: $user) {
		      id
		      username
          email
          #verified
	      }
      }
    `;

const Register = () => {
  
  const dispatch = useAppDispatch();

  const open = useAppSelector(state => state.modal.isOpen && state.modal.modalWindow == 'register');
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [addUser, { data, loading, error }] = useMutation<RegisterType, RegistrationData>(ADD_USER);

  const closeModal = () => {
    dispatch({ type: 'modal/setState', payload: {isOpen: false} });
  };
  const swapModal = (newModal: string) => {
    dispatch({ type: 'modal/setState', payload: {isOpen: true, modalWindow: newModal } });
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    addUser({
      variables: {
        user: {
          username: formData.get('username'),
          email: formData.get('email'),
          password: formData.get('password') }
      },
      onCompleted(data) {
        if (data.register) {
          localStorage.setItem('userId', data.register.id as string);
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
            Sign up
          </Typography>
          {(!loading && error) &&
              <Alert sx={{ mt: 3, minWidth: 1, maxWidth: 1 }} variant="filled" severity="error">{error.message}</Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  type="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="">
              <Grid item>
                <Link component="button" variant="body2" onClick={() => swapModal('login')}>
                  Already have an account? Sign In
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default Register;