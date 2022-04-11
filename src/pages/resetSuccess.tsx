import * as React from 'react';
import {Avatar, Box, Container, Grid, Link, Typography} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const ResetSuccess = () => {

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
        <Box component="form" sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              You have set a new password successfully! <Link href="/login" variant="body2">
              Sign In </Link>
            </Grid>
            {/*           <Grid item xs={12}>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive inspiration, marketing promotions and updates via email."
            />
          </Grid> */}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetSuccess;