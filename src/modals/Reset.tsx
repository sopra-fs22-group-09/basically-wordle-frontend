import * as React from 'react';
import {User} from '../models/User';
import {gql, useMutation} from '@apollo/client';
import {useAppSelector} from '../redux/hooks';
import {Alert, Avatar, Box, Button, Grid, Link, Modal, TextField, Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

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

  const open = useAppSelector(state => state.modal.isOpen && state.modal.modalWindow == 'reset');
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [resetUser, { data, loading, error }] = useMutation<ResetUser, MutationResetArgs>(RESET_USER);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    resetUser({
      variables: {
        input: {
          email: formData.get('email') }
      },
      onCompleted(){
        //navigate('/reset/confirmation');
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
            Reset password
          </Typography>
          {(data && !loading) &&
              <Alert sx={{ mt: 3, minWidth: 1, maxWidth: 1 }} variant="filled" severity="info">
                  Check your Email for a password reset link!
              </Alert>}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Request password reset
            </Button>
            <Grid container justifyContent="">
              <Grid item xs>
                <Link href='/login' variant="body2">
                  Remember your password?
                </Link>
              </Grid>
              <Grid item xs>
                <Link href='/register' variant="body2">
                  Don&apos;t have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default Reset;