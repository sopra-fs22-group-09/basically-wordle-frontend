import {gql, useMutation} from '@apollo/client';
import {User} from '../models/User';
import * as React from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useNavigate} from 'react-router-dom';
import { LoadingOverlay } from '@mantine/core';
import PasswordStrength from '../components/passwordStrengthMeter';
import ModalTemplate from '../components/modal';
import { useAppDispatch } from '../redux/hooks';

export type ResetTokenInput = {
  resetToken: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
};

export type MutationResetWithTokenArgs = {
  input: ResetTokenInput;
};

const RESET_USER_TOKEN = gql`
  mutation tokenEntry($input: ResetTokenInput!) {
    resetWithToken(input: $input) {
      id
      username
      email
      #verified
    }
  }
`;

const TokenEntry = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [resetUser, {data, loading, error}] = useMutation<User, MutationResetWithTokenArgs>(RESET_USER_TOKEN);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    resetUser({
      variables: {
        input: {
          resetToken: formData.get('resetToken'),
          password: formData.get('password')
        }
      }
    });
  };

  return (
    <ModalTemplate maxWidth="540px" name="tokenEntry">
      <LoadingOverlay style={{ borderRadius: '4px' }} loaderProps={{ size: 'lg', variant: 'dots' }} overlayColor="#2C2E33" visible={loading}/>
      <Avatar sx={{ m: 'auto', bgcolor: 'primary.main' }}><LockOutlinedIcon /></Avatar>
      <Typography variant="h1" sx={{fontSize: '32px', mt: '10px'}}>Password Reset</Typography>
      {error && <Alert sx={{ mt: '10px' }} variant="filled" severity="error">{error.message}</Alert>}
      {data && !loading ?
        <>
          <Alert sx={{ mt: '10px' }} variant="filled" severity="info">You have set a new password successfully!</Alert>
          <Button type="submit" fullWidth variant="contained" sx={{mt: '20px'}} onClick={() => {dispatch({type: 'modal/setState', payload: {isOpen: false}}); navigate('/');}}>Back to login page</Button>
        </>:
        <Box component="form" onSubmit={handleSubmit} sx={{mt: '20px'}}>
          <TextField required fullWidth id="resetToken" label="Reset Code" name="resetToken" defaultValue={window.location.pathname.replace('/reset/tokenEntry', '').replace('/', '')}/>
          <PasswordStrength />
          <Button type="submit" fullWidth variant="contained" sx={{mt: '20px'}}>Set new password</Button>
        </Box>}
    </ModalTemplate>
  );
};

export default TokenEntry;