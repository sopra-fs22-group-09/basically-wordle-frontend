import * as React from 'react';
import { Box } from '@mui/material';
import { WithChildren } from '../../utils/utils';

// eslint-disable-next-line @typescript-eslint/ban-types
type LoaderProps = WithChildren<{}>;

const LoaderCenterer = ({ children }: LoaderProps) => {
  return (
    <Box 
      display="flex"
      height="100vh"
      width="100vw"
      alignItems="center"
      justifyContent="center">
      {children}
    </Box>
  );
};

export default LoaderCenterer;