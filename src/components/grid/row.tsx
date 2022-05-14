import * as React from 'react';
import { Box, useTheme } from '@mui/material';
import Cell from './cell';
import { LetterState } from '../../models/Game';
import { v4 as uuid } from 'uuid';

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
  const theme = useTheme();

  const getColorForLetter = (n: number) => {
    if (letterStates[n] === LetterState.CORRECTPOSITION) return theme.additional.GameColoring.colors.correctPosition;
    else if (letterStates[n] === LetterState.INWORD) return theme.additional.GameColoring.colors.inWord;
    else if (letterStates[n] === LetterState.WRONG) return theme.additional.GameColoring.colors.notInWord;
    else return 'transparent';
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
        <Cell value={letter} key={uuid()} style={{backgroundColor: `${getColorForLetter(i)}`}} />
      ))}
      {/* TODO do it better (if you find time) */}
      {'     '.substring(0, 5 - (word ? word.length : 0)).split('').map((_, i) => (
        <Cell key={uuid()} style={{backgroundColor: `${getColorForLetter(i)}`}} />
      ))}
    </Box>
  );
};

export default Row;