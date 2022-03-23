import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { gql, useSubscription } from '@apollo/client';

const Login = () => {
  const GREETINGS_SUBSCRIPTION = gql`
  subscription {
    greetings
  }
`;

  function LatestGreetings() {
    const { data, loading } = useSubscription<{greetings: string}>(
      GREETINGS_SUBSCRIPTION
    );
    return <>
      <h2>Subscription answer:</h2><br/>
      <h1>
        {!loading && data?.greetings ? data?.greetings : 'waiting to receive elements ...'}
      </h1>
    </>;
  }

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
        sx={{ padding: '1rem', backgroundColor: 'primary.light' }}
      >
        <Typography variant='h3'>Login</Typography>
        <Typography variant='caption'>{LatestGreetings()}</Typography>
      </Paper>
    </Box>
  );
};

export default Login;