import * as React from 'react';
import { CssBaseline, Box, Container } from '@mui/material';
import { WithChildren } from '../../utils/utils';
import { Footer } from './Footer';
import { Navigation } from './Navigation';
import { Friends } from './Friends';

// Do this explicitly if you need the component to have children!
// eslint-disable-next-line @typescript-eslint/ban-types
type LayoutProps = WithChildren<{}>;

const Layout = ({ children }: LayoutProps) => {

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
        }}>
        <CssBaseline />
        <Box>
          <Friends />
        </Box>
        <Box
          component="main"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            maxWidth: '100vw',
            flexGrow: 1,
          }}>
          <Navigation />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {children}
          </Container>
        </Box>
      </Box>
      <Footer />
    </>
    
    
    
  /*    <>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          minHeight: '100vh',
          maxWidth: '100vw',
          flexGrow: 1,
        }}
      >
        <Navigation />
        <Friends />
        {children}
        <Footer />
      </Box>
    </>*/
  );
};

export default Layout;