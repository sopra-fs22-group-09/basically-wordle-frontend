import * as React from 'react';
import { Box } from '@mui/material';

type CellProps = {
  value?: string
  style?: React.CSSProperties
}

const Cell = ({
  value,
  style,

}: CellProps) => {
  return (
    <Box
      sx={{
        width: '18%',
        minHeight: '100%',
        verticalAlign: 'middle',
        aspectRatio: '1/1',
        m: '2px',
        py: '2%',
        border: '2px solid white',
        borderRadius: '5px',
        fontWeight: 'bold',
        fontSize: '24px',
        textAlign: 'center',
        display: 'inline-block',
        ...style
      }}
    >
      {value}
    </Box>
  );
};

export default Cell;