import * as React from 'react';
import LobbyOverview from './LobbyOverview';

const Home = () => {
  return (
    <LobbyOverview />

  /*<Box>
      <Paper
        sx={{ padding: '1rem', backgroundColor: 'secondary.light', width: '80%', textAlign: 'center', m: 'auto', mb: '100px' }}
      >
        <Typography variant='h1' color={'secondary.dark'}>Home</Typography>
        <Typography paragraph={true} color={'secondary.dark'}>This is a {process.env.NODE_ENV} environment.</Typography>
      </Paper>
      <Paper
        sx={{ padding: '1rem', backgroundColor: 'secondary.light', width: '60%', textAlign: 'center', m: 'auto', mb: '100px' }}
      >
        <Typography variant='h2' color={'secondary.dark'}>Home</Typography>
        <Typography paragraph={true} color={'secondary.dark'}>This is a {process.env.NODE_ENV} environment.</Typography>
      </Paper>
      <Paper
        sx={{ padding: '1rem', backgroundColor: 'secondary.light', width: '40%', textAlign: 'center', m: 'auto', mb: '100px'  }}
      >
        <Typography variant='h3' color={'secondary.dark'}>Home</Typography>
        <Typography paragraph={true} color={'secondary.dark'}>This is a {process.env.NODE_ENV} environment.</Typography>
      </Paper>
      <Paper
        sx={{ padding: '1rem', backgroundColor: 'secondary.light', width: '20%', textAlign: 'center', m: 'auto' }}
      >
        <Typography variant='h4' color={'secondary.dark'}>Home</Typography>
        <Typography paragraph={true} color={'secondary.dark'}>This is a {process.env.NODE_ENV} environment.</Typography>
      </Paper>
    </Box>*/
  );
};

export default Home;