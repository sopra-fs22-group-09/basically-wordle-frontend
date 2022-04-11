import {gql, useMutation} from '@apollo/client';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {User} from '../models/User';
import * as React from 'react';
import {Alert, Avatar, Box, Button, Grid, Link, Modal, TextField, Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

interface tokenEntry {
  resetToken: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
}

interface tokenEntryData {
  user: tokenEntry;
}

const RESET_USER_TOKEN = gql`
    mutation tokenEntry($user: ResetTokenInput!) {
      resetWithToken(input: $user) {
        id
        username
        email
        #verified
      }
    }
  `;

const TokenEntry = () => {

  const dispatch = useAppDispatch();

  const open = useAppSelector(state => state.modal.isOpen && state.modal.modalWindow == 'tokenEntry');
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [resetUser, {data, loading, error}] = useMutation<User, tokenEntryData>(RESET_USER_TOKEN);

  const closeModal = () => {
    dispatch({ type: 'modal/setState', payload: {isOpen: false} });
  };
  const swapModal = (newModal: string) => {
    dispatch({ type: 'modal/setState', payload: {isOpen: true, modalWindow: newModal } });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    resetUser({
      variables: {
        user: {
          resetToken: formData.get('resetToken'),
          password: formData.get('password')
        }
      },
      onCompleted() {
        //navigate('/reset/tokenEntry/success');
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
          <Avatar sx={{m: 'auto', bgcolor: 'secondary.main'}}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Reset password
          </Typography>
          {(!loading && error) &&
              <Alert sx={{mt: 3, minWidth: 1, maxWidth: 1}} variant="filled" severity="error">
                {error.message}
              </Alert>}
          {(data && !loading) &&
              <Alert sx={{mt: 3, minWidth: 1, maxWidth: 1}} variant="filled" severity="info">
                  You have set a new password successfully!
              </Alert>
          }
          <Box component="form" onSubmit={handleSubmit} sx={{mt: 3}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="resetToken"
                  label="Reset Code"
                  name="resetToken"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="New Password"
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
              sx={{mt: 3, mb: 3}}
            >
              Set new password
            </Button>
            {(data && !loading) &&
                <Link component='button' variant="body2" onClick={() => swapModal('login')}>Sign In</Link>
            }
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default TokenEntry;