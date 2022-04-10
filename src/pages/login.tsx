import * as React from 'react';
import { Alert, Avatar, Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { gql, useMutation } from '@apollo/client';
import { User } from '../models/User';
import { LoadingOverlay } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
//import { gql, useSubscription } from '@apollo/client';

const Login = () => {

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

  interface Login {
    username: FormDataEntryValue | null;
    password: FormDataEntryValue | null;
  }

  interface LoginData {
    user: Login;
  }

  const navigate = useNavigate(); 
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [loginUser, { data, loading, error }] = useMutation<User, LoginData>(LOGIN_USER);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    loginUser({
      variables: {
        user: {
          username: formData.get('username'),
          password: formData.get('password') }
      },
      onCompleted(user: User) {
        if (user) {
          localStorage.setItem('token', user.token as string);
          localStorage.setItem('userId', user.id as string);
          navigate('/');
        }
      }
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        {(!loading && error) && <Alert sx={{ mt: 3, minWidth: 1, maxWidth: 1 }} variant="filled" severity="error">{error.message}</Alert>}
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
          {/*<FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />*/}
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
              <Link href="/reset" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                {'Don\'t have an account? Sign Up'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );

  /*const GREETINGS_SUBSCRIPTION = gql`
  subscription {
    greetings
  }
`;

  function LatestGreetings() {
    const { data, loading } = useSubscription<{greetings: string}>(
      GREETINGS_SUBSCRIPTION
    );
    return <>
      <h2>Subscription answer:</h2><br/>
      <h1>
        {(!loading && data?.greetings) ?? 'waiting to receive elements ...'}
      </h1>
    </>;
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: 'whitesmoke',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{ padding: '1rem', backgroundColor: 'primary.light' }}
      >
        <Typography variant='h3'>Login</Typography>
        <Typography variant='caption'>{LatestGreetings()}</Typography>
      </Paper>
    </Box>
  );*/
};

export default Login;