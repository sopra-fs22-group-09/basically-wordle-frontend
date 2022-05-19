import * as React from 'react';
import { Box } from '@mui/material';
import Row from './row';
import { LetterState } from '../../models/Game';

type GridProps = {
  currentRow?: number
  currentWord?: string
  allGuesses: string[]
  allLetterStates: LetterState[][]
  style?: React.CSSProperties
}

const Grid = ({
  currentRow,
  currentWord,
  allGuesses,
  allLetterStates,
  style

}: GridProps) => {
  return (
    <Box sx={{minWidth: '200px', maxWidth: '312px', m: 'auto', ...style}}>
      {allGuesses?.map((word, i) => (
        <Row
          key={i}
          word={currentRow === i ? currentWord : allGuesses[i]}
          letterStates={allLetterStates[i] ? allLetterStates[i] : []}
        />
      ))}
    </Box>
  );
};

export default Grid;