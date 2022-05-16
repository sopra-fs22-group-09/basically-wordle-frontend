import * as React from 'react';
import { Box } from '@mui/material';
import Row from './row';
import { LetterState } from '../../models/Game';
import { v4 as uuid } from 'uuid';

type GridProps = {
  currentRow?: number
  currentWord?: string
  allGuesses: string[]
  allLetterStates: LetterState[][]
}

const Grid = ({
  currentRow,
  currentWord,
  allGuesses,
  allLetterStates

}: GridProps) => {
  return (
    <Box sx={{minWidth: '200px', maxWidth: '312px', m: 'auto'}}>
      {allGuesses?.map((word, i) => (
        <Row
          word={currentRow === i ? currentWord : allGuesses[i]}
          key={uuid()}
          letterStates={allLetterStates[i] ? allLetterStates[i] : []}
        />
      ))}
    </Box>
  );
};

export default Grid;