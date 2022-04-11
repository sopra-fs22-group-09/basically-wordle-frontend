import * as React from 'react';
import { Avatar, Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { gql, useMutation } from '@apollo/client';
import { User } from '../models/User';
import {useNavigate} from 'react-router-dom';

const Reset = () => {
  const RESET_USER = gql`
      mutation resetUser($user: ResetInput!) {
        reset(input: $user) {
          email
          #verified
	      }
      }
    `;

    interface Reset {
        email: FormDataEntryValue | null;
    }

    interface ResetUser {
      reset: User;
    }

    interface ResetData {
        user: Reset;
    }

    const navigate = useNavigate();
    // eslint-disable-next-line unused-imports/no-unused-vars
    const [resetUser, { data, loading, error }] = useMutation<ResetUser, ResetData>(RESET_USER);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      resetUser({
        variables: {
          user: {
            email: formData.get('email') }
        },
        onCompleted(){
          navigate('/reset/confirmation');
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
              Reset password
          </Typography>
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
                        Request password reset
            </Button>
            <Grid container justifyContent="">
              <Grid item>
                <Link href="/register" variant="body2">
                    No account? Register
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    );
};

export default Reset;