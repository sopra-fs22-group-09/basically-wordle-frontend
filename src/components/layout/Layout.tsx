import * as React from 'react';
import { CssBaseline, Box } from '@mui/material';
import { WithChildren } from '../../utils/utils';
import { Footer } from './Footer';

// Do this explicitly if you need the component to have children!
// eslint-disable-next-line @typescript-eslint/ban-types
type LayoutProps = WithChildren<{}>;

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
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
        {/*<Navbar />*/}
        {children}
        <Footer />
      </Box>
    </>
  );
};

export default Layout;