import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const Home = () => {
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
        sx={{ padding: '1rem', backgroundColor: 'secondary.light' }}
      >
        <Typography variant='h3'>Home</Typography>
        <p>This is a {process.env.NODE_ENV} environment.</p>
      </Paper>
    </Box>
  );
};

export default Home;