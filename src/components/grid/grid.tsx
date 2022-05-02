import * as React from 'react';
import { Box } from '@mui/material';
import Row from './row';
import { LetterState } from '../../models/Game';

type GridProps = {
  currentRow?: number
  currentWord?: string
  allGuesses: string[]
  style?: React.CSSProperties
  allLetterStates: LetterState[][]
}

const Grid = ({
  currentRow,
  currentWord,
  allGuesses,
  style,
  allLetterStates

}: GridProps) => {


  return (
    <Box
      sx={{
        m: 'auto',
        width: '100%',
        minWidth: '200px',
        minHeight: '210px',
        ...style
      }}
    >
      {allGuesses?.map((word, i) => (
        <Row
          word={currentRow === i ? currentWord?.toUpperCase() : allGuesses[i]?.toUpperCase()}
          key={i}
          letterStates={allLetterStates[i]}/>
      ))}
    </Box>
  );
};

export default Grid;