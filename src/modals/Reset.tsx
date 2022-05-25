import * as React from 'react';
import {User} from '../models/User';
import {gql, useMutation} from '@apollo/client';
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
import { useAppDispatch } from '../redux/hooks';

export type ResetInput = {
  email: FormDataEntryValue | null;
};

export type MutationResetArgs = {
  input: ResetInput;
};

interface ResetUser {
  reset: User;
}

const RESET_USER = gql`
  mutation resetUser($input: ResetInput!) {
    reset(input: $input) {
      email
      #verified
    }
  }
`;

const Reset = () => {
  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [resetUser, { data, loading, error }] = useMutation<ResetUser, MutationResetArgs>(RESET_USER);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    resetUser({
      variables: {
        input: {
          email: formData.get('email') }
      }
    });
  };

  return (
    <ModalTemplate maxWidth="600px" name="reset">
      <LoadingOverlay style={{ borderRadius: '4px' }} loaderProps={{ size: 'lg', variant: 'dots' }} overlayColor="#2C2E33" visible={loading}/>
      <Avatar sx={{ m: 'auto', bgcolor: 'primary.main' }}><LockOutlinedIcon /></Avatar>
      <Typography variant="h1" sx={{fontSize: '32px', mt: '10px'}}>Password Reset</Typography>
      {error && <Alert sx={{ mt: '10px' }} variant="filled" severity="error">{error.message}</Alert>}
      {data && !loading ?
        <>
          <Alert sx={{ mt: '10px' }} variant="filled" severity="info">Check your Email for a password reset link!</Alert>
          <Button type="submit" fullWidth variant="contained" sx={{mt: '20px'}} onClick={() => {dispatch({type: 'modal/setState', payload: {isOpen: false}}); navigate('/');}}>Back to login page</Button>
        </>:
        <>
          <Box component="form" onSubmit={handleSubmit} sx={{mt: '20px'}}>
            <TextField required fullWidth id="email" type="email" label="Email Address" name="email" autoComplete="email" />
            <Button type="submit" fullWidth variant="contained" sx={{mt: '20px'}}>Request password reset</Button>
          </Box>
          <Box sx={{mt: '20px'}}>
            <Link href="/" variant="body1" sx={{float: smallScreen ? 'none' : 'left'}}>You have an account? Sign In</Link>
            <Link href='/register' variant="body1" sx={{display: 'block', float: smallScreen ? 'none' : 'right', mt: smallScreen ? '20px' : 'auto'}}>Don&apos;t have an account? Sign Up</Link>
          </Box>
        </>}
    </ModalTemplate>
  );
};

export default Reset;