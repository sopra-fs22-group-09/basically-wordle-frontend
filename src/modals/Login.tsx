import * as React from 'react';
import { useAppDispatch } from '../redux/hooks';
import { User } from '../models/User';
import { gql, useMutation } from '@apollo/client';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Link,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { LoadingOverlay } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import ModalTemplate from '../components/modal';

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
  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginUser, { loading, error }] = useMutation<LoginType, MutationLoginArgs>(LOGIN_USER);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await loginUser({
      variables: {
        input: {
          username: formData.get('username'),
          password: formData.get('password')
        }
      },
      onCompleted(data) {
        if (data.login) {
          localStorage.setItem('userId', data.login.id);
          localStorage.setItem('userName', data.login.username);
        }
      }
    }).then(async () => {
      dispatch({type: 'modal/setState', payload: {isOpen: false}});
      navigate('/');
    });
  };

  return (
    <ModalTemplate maxWidth="690px" name="login">
      <LoadingOverlay style={{ borderRadius: '4px' }} loaderProps={{ size: 'lg', variant: 'dots' }} overlayColor="#2C2E33" visible={loading}/>
      <Avatar sx={{ m: 'auto', bgcolor: 'primary.main' }}><LockOutlinedIcon /></Avatar>
      <Typography variant="h1" sx={{fontSize: '32px', mt: '10px'}}>Sign In</Typography>
      {error && <Alert sx={{ mt: '10px' }} variant="filled" severity="error">{error.message}</Alert>}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField margin="normal" required fullWidth name="username" label="Username" id="username" autoComplete="username" />
        <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" />
        <Button type="submit" fullWidth variant="contained" sx={{mt: '10px'}}>Sign In</Button>
      </Box>
      <Box sx={{mt: '20px'}}>
        <Link href='/reset' variant="body1" sx={{float: smallScreen ? 'none' : 'left'}}>Forgot your password?</Link>
        <Link href='/register' variant="body1" sx={{display: 'block', float: smallScreen ? 'none' : 'right', mt: smallScreen ? '20px' : 'auto'}}>Don&apos;t have an account? Sign Up</Link>
      </Box>
    </ModalTemplate>
  );
};

export default Login;