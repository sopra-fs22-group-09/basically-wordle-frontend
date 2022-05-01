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
        width: '60px',
        height: '60px',
        m: '2px',
        p: '10px 0',
        border: '2px solid white',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '24px',
        textAlign: 'center',
        float: 'left',
        ...style
      }}
    >
      {value}
    </Box>
  );
};

export default Cell;