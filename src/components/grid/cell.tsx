import * as React from 'react';
import { Box } from '@mui/material';
import { LetterState } from '../../models/Game';


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
        maxWidth: '60px',
        aspectRatio: '6/1',
        height: '100%',
        maxHeight: '60px',
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