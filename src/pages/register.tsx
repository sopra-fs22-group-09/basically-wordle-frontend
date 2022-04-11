import * as React from 'react';
import { Alert, Avatar, Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { gql, useMutation } from '@apollo/client';
import { User } from '../models/User';
import { useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '@mantine/core';
import PasswordStrength from '../components/passwordStrengthMeter';

const Register = () => {
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

  interface Registration {
    username: FormDataEntryValue | null;
    email: FormDataEntryValue | null;
    password: FormDataEntryValue | null;
  }

  interface RegisterType {
    register: User;
  }

  interface RegistrationData {
    user: Registration; 
  }
 
  const navigate = useNavigate(); 
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [addUser, { data, loading, error }] = useMutation<RegisterType, RegistrationData>(ADD_USER);

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
          navigate('/');
        }
      }
    });
  };   
   
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          mt: 10,
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
      Sign up
        </Typography>
        {(!loading && error) && <Alert sx={{ mt: 3, minWidth: 1, maxWidth: 1 }} variant="filled" severity="error">{error.message}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, padding: '20px' }}>
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
              <PasswordStrength />
            </Grid>
            {/*           <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive inspiration, marketing promotions and updates via email."
            />
          </Grid> */}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
        Sign Up
          </Button>
          <LoadingOverlay
            style={{ borderRadius: '4px' }}
            loaderProps={{ size: 'lg', variant: 'dots' }}
            overlayColor="#2C2E33"
            visible={loading} />
          <Grid container justifyContent="">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign In
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box> 
    </Container>
  );
};

export default Register;