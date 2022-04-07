import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';

const Profile = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: 'gray',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper elevation={3} sx={{ padding: '1rem', backgroundColor: 'primary.dark' }}>
        <Typography variant="h3" color="white">
          Profile
        </Typography>
      </Paper>
    </Box>
  );
};

export default Profile;
