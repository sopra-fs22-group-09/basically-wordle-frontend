import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const Register = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: 'whitesmoke',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{ padding: '1rem', backgroundColor: 'secondary.dark' }}
      >
        <Typography variant='h3' color='white'>Register</Typography>
      </Paper>
    </Box>
  );
};

export default Register;