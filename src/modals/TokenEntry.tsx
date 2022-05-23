import {gql, useMutation} from '@apollo/client';
import { useAppSelector } from '../redux/hooks';
import {User} from '../models/User';
import * as React from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useNavigate} from 'react-router-dom';
import { LoadingOverlay } from '@mantine/core';
import PasswordStrength from '../components/passwordStrengthMeter';

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
  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size
  const navigate = useNavigate();
  const open = useAppSelector(state => state.modal.isOpen && state.modal.modalWindow == 'tokenEntry');
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
    <Modal open={open}>
      <Box
        sx={{
          position: 'fixed',
          width: '90vw',
          maxWidth: '540px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          px: smallScreen ? '20px' : '50px',
          py: smallScreen ? '30px' : '50px',
          bgcolor: 'rgba(0, 0, 0, 0.75)',
          boxShadow: '0 0 20px -7px rgba(0, 0, 0, 0.2)',
          border: '1px solid white',
          borderRadius: '15px',
          textAlign: 'center'
        }}
      >
        <LoadingOverlay style={{ borderRadius: '4px' }} loaderProps={{ size: 'lg', variant: 'dots' }} overlayColor="#2C2E33" visible={loading}/>
        <Avatar sx={{ m: 'auto', bgcolor: 'primary.main' }}><LockOutlinedIcon /></Avatar>
        <Typography variant="h1" sx={{fontSize: '32px', mt: '10px'}}>Password Reset</Typography>
        {error && <Alert sx={{ mt: '10px' }} variant="filled" severity="error">{error.message}</Alert>}
        {!data && !loading ?
          <>
            <Alert sx={{ mt: '10px' }} variant="filled" severity="info">You have set a new password successfully!</Alert>
            <Button type="submit" fullWidth variant="contained" sx={{mt: '20px'}} onClick={() => navigate('/')}>Back to login page</Button>
          </>:
          <Box component="form" onSubmit={handleSubmit} sx={{mt: '20px'}}>
            <TextField required fullWidth id="resetToken" label="Reset Code" name="resetToken" defaultValue={window.location.pathname.replace('/reset/tokenEntry', '').replace('/', '')}/>
            <PasswordStrength />
            <Button type="submit" fullWidth variant="contained" sx={{mt: '20px'}}>Set new password</Button>
          </Box>}
      </Box>
    </Modal>
  );
};

export default TokenEntry;