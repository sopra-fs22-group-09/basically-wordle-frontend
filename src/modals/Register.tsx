import * as React from 'react';
import { User } from '../models/User';
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
import { gql, useMutation } from '@apollo/client';
import { useAppDispatch } from '../redux/hooks';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '@mantine/core';
import PasswordStrength from '../components/passwordStrengthMeter';
import ModalTemplate from '../components/modal';

export type RegisterInput = {
  username: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}

export type MutationRegisterArgs = {
  input: RegisterInput;
};

interface RegisterType {
  register: User;
}

const ADD_USER = gql`
  mutation signUp($input: RegisterInput!) {
    register(input: $input) {
      id
      username
      email
      #verified
    }
  }
`;

const Register = () => {
  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [addUser, { loading, error }] = useMutation<RegisterType, MutationRegisterArgs>(ADD_USER);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await addUser({
      variables: {
        input: {
          username: formData.get('username'),
          email: formData.get('email'),
          password: formData.get('password')
        }
      },
      onCompleted(data) {
        if (data.register) {
          localStorage.setItem('userId', data.register.id);
          localStorage.setItem('userName', data.register.username);
        }
      }
    }).then(async () => {
      dispatch({type: 'modal/setState', payload: {isOpen: false}});
      if (!smallScreen) dispatch({ type: 'drawer/setState' , payload: {isOpen: true}});
      navigate('/');
    });
  };

  return (
    <ModalTemplate maxWidth="690px" name="register">
      <LoadingOverlay style={{ borderRadius: '4px' }} loaderProps={{ size: 'lg', variant: 'dots' }} overlayColor="#2C2E33" visible={loading}/>
      <Avatar sx={{ m: 'auto', bgcolor: 'primary.main' }}><LockOutlinedIcon /></Avatar>
      <Typography variant="h1" sx={{fontSize: '32px', mt: '10px'}}>Sign Up</Typography>
      {error && <Alert sx={{ mt: '10px' }} variant="filled" severity="error">{error.message}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{mt: '20px'}}>
        <TextField required fullWidth id="username" label="Username" name="username" autoComplete="username"/>
        <TextField required fullWidth id="email" type="email" label="Email Address" name="email" autoComplete="email" sx={{mt: '20px'}}/>
        <PasswordStrength />
        <Button type="submit" fullWidth variant="contained" sx={{mt: '20px'}}>Sign Up</Button>
      </Box>
      <Box sx={{mt: '20px'}}>
        <Link href="/reset" variant="body1" sx={{float: smallScreen ? 'none' : 'left'}}>Forgot your password?</Link>
        <Link href="/" variant="body1" sx={{display: 'block', float: smallScreen ? 'none' : 'right', mt: smallScreen ? '20px' : 'auto'}}>You have an account? Sign In</Link>
      </Box>
    </ModalTemplate>
  );
};

export default Register;