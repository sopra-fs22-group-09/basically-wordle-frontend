import * as React from 'react';
import { Box } from '@mui/material';
import Cell from './cell';
import { LetterState } from '../../models/Game';

type RowProps = {
  word: string
  style?: React.CSSProperties
  letterStates: LetterState[]
}

const Row = ({
  word,
  style,
  letterStates

}: RowProps) => {

  const getColorForLetter = (letter: string, n: number) => {
    if (letterStates[n] === LetterState.CORRECTPOSITION) return 'lightgreen';
    else if (letterStates[n] === LetterState.INWORD) return 'orange';
    else if (letterStates[n] === LetterState.WRONG) return 'black';
    else return 'transparent';
  };

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
      {word?.split('').map((letter, i) => (
        <Cell value={letter} key={letter + i} style={{backgroundColor: `${getColorForLetter(letter, i)}`}} />
      ))}
      {/* TODO do it better (if you find time) */}
      {'     '.substring(0, 5 - word.length).split('').map((_, i) => (
        <Cell key={word + i} />
      ))}
    </Box>
  );
};

export default Row;