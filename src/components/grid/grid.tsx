import * as React from 'react';
import { Box } from '@mui/material';
import Row from './row';

type GridProps = {
  currentRow: number
  style?: React.CSSProperties
}

const Grid = ({
  currentRow,
  style,

}: GridProps) => {

  return (
    <Box
      sx={{
        m: 'auto',
        ...style
      }}
    >
      <Row word={'loool'} />
      <Row word={'loool'} />
      <Row word={'a'} />
      <Row word={'a'} />
      <Row word={'a'} />
      <Row word={'a'} />
    </Box>
  );
};

export default Grid;