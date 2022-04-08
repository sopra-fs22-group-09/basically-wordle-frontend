import * as React from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'secondary.main',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        position: 'fixed',
        bottom: '0',
        zIndex: '1200', //Don't ask, zIndex of friend list is 1199 --> Can be omitted once main container size is adjusted
      }}
    >
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="center">
          <Grid item xs={12}>
            <Typography color="black" variant="h5">
              Basically Wordle.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="textSecondary" variant="subtitle1">
              SoPra FS22 - {new Date().getFullYear()}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;