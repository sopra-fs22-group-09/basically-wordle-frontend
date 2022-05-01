import * as React from 'react';
import { Box } from '@mui/material';
import Cell from './cell';

type RowProps = {
  word: string
  style?: React.CSSProperties
}

const Row = ({
  word,
  style,

}: RowProps) => {

  return (
    <Box
      sx={{
        m: '2px',
        width: '100%',
        minWidth: '24.5px',
        height: '60px',
        clear: 'both',
        ...style
      }}
    >
      {word.split('').map((letter, i) => (
        <Cell value={letter} key={letter + i} />
      ))}
      {/* TODO do it better (if you find time) */}
      {'     '.substring(0, 5 - word.length).split('').map((_, i) => (
        <Cell key={word + i} />
      ))}
    </Box>
  );
};

export default Row;