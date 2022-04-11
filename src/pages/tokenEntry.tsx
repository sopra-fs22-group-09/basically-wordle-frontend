import * as React from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Grid, 
  //Link,
  TextField,
  Typography
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { gql, useMutation } from '@apollo/client';
import { User } from '../models/User';
import { useNavigate } from 'react-router-dom';

const TokenEntry = () => {
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

  interface tokenEntry {
    resetToken: FormDataEntryValue | null;
    password: FormDataEntryValue | null;
  }

  interface tokenEntryData {
    user: tokenEntry;
  }


  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [resetUser, {data, loading, error}] = useMutation<User, tokenEntryData>(RESET_USER_TOKEN);

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
        navigate('/reset/tokenEntry/success');
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
        <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
          <LockOutlinedIcon/>
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset password
        </Typography>
        {(!loading && error) &&
            <Alert sx={{mt: 3, minWidth: 1, maxWidth: 1}} variant="filled" severity="error">{error.message}</Alert>}
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
            sx={{mt: 3, mb: 2}}
          >
            Set new password
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TokenEntry;
