import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const Profile = () => {
  return (
    <Box
      sx={{
        width:'90%',
        mx:'auto',
        mt: '2.5%',
        textAlign: 'center'
      }}
    >
      <Paper
        sx={{ padding: '1rem', backgroundColor: 'primary.dark', width: '80%', textAlign: 'center', m: 'auto', mb: '100px' }}
      >
        <Typography variant='h1' color={'primary.light'}>Profile</Typography>
        <Typography paragraph={true} color={'primary.light'}>This is a {process.env.NODE_ENV} environment.</Typography>
      </Paper>
      <Paper
        sx={{ padding: '1rem', backgroundColor: 'primary.dark', width: '60%', textAlign: 'center', m: 'auto', mb: '100px' }}
      >
        <Typography variant='h2' color={'primary.light'}>Profile</Typography>
        <Typography paragraph={true} color={'primary.light'}>This is a {process.env.NODE_ENV} environment.</Typography>
      </Paper>
      <Paper
        sx={{ padding: '1rem', backgroundColor: 'primary.dark', width: '40%', textAlign: 'center', m: 'auto', mb: '100px'  }}
      >
        <Typography variant='h3' color={'primary.light'}>Profile</Typography>
        <Typography paragraph={true} color={'primary.light'}>This is a {process.env.NODE_ENV} environment.</Typography>
      </Paper>
      <Paper
        sx={{ padding: '1rem', backgroundColor: 'primary.dark', width: '20%', textAlign: 'center', m: 'auto' }}
      >
        <Typography variant='h4' color={'primary.light'}>Profile</Typography>
        <Typography paragraph={true} color={'primary.light'}>This is a {process.env.NODE_ENV} environment.</Typography>
      </Paper>
    </Box>
  );
};

export default Profile;
