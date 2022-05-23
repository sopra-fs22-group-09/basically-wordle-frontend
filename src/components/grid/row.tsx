import * as React from 'react';
import { Box, useTheme } from '@mui/material';
import Cell from './cell';
import { LetterState } from '../../models/Game';

type RowProps = {
  word?: string
  letterStates: LetterState[]
  shake?: boolean
}

const Row = ({
  word,
  letterStates,
  shake


}: RowProps) => {
  const theme = useTheme();

  const getColorForLetter = (n: number) => {
    if (letterStates[n] === LetterState.CORRECTPOSITION) return theme.additional.GameColoring.colors.correctPosition;
    else if (letterStates[n] === LetterState.INWORD) return theme.additional.GameColoring.colors.inWord;
    else if (letterStates[n] === LetterState.WRONG) return theme.additional.GameColoring.colors.notInWord;
    else return 'transparent';
  };

  const emptyCells = (amount: number) => {
    const tmp = [];
    let i: number;
    for (i = 0; i < amount; ++i) tmp.push(<Cell key={'empty' + i} style={{backgroundColor: `${getColorForLetter(i)}`}} />);
    return tmp;
  };

  return (
    <Box className={shake ? 'shake' : undefined}>
      {word?.split('').map((letter, i) => (<Cell key={'notEmpty' + i} value={letter} style={{backgroundColor: `${getColorForLetter(i)}`}} />))}
      {emptyCells(5 - (word ? word.length : 0))}
    </Box>
  );
};

export default Row;