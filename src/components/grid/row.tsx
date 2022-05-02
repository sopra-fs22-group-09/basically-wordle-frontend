import * as React from 'react';
import { Box } from '@mui/material';
import Cell from './cell';
import { LetterState } from '../../models/Game';

type RowProps = {
  word?: string
  style?: React.CSSProperties
  letterStates: LetterState[]
}

const Row = ({
  word,
  style,
  letterStates

}: RowProps) => {

  const getColorForLetter = (letter: string, n: number) => {
    if (letterStates[n] === LetterState.CORRECTPOSITION) return '#00b300';
    else if (letterStates[n] === LetterState.INWORD) return 'orange';
    else if (letterStates[n] === LetterState.WRONG) return 'black';
    else return '#808080';
  };

  return (
    <Box
      sx={{
        my: '2px',
        mx: 'auto',
        maxWidth: '100%',
        aspectRatio: '6/1',
        height: '16%',
        maxHeight: '60px',
        textAlign: 'center',
        clear: 'both',
        ...style
      }}
    >
      {word?.split('').map((letter, i) => (
        <Cell value={letter} key={letter + i} style={{backgroundColor: `${getColorForLetter(letter, i)}`}} />
      ))}
      {/* TODO do it better (if you find time) */}
      {'     '.substring(0, 5 - (word ? word.length : 0)).split('').map((_, i) => (
        <Cell key={5+i} />
      ))}
    </Box>
  );
};

export default Row;