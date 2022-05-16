import * as React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Key from './key';
import { useEffect } from 'react';

type KeyboardProps = {
  onChar: (value: string) => void
  onDelete: () => void
  onEnter: () => void
  letterOnCorrectPosition: string;
  letterInWord: string;
  letterNotInWord: string;
}

const Keyboard = ({
  onChar,
  onDelete,
  onEnter,
  letterOnCorrectPosition,
  letterInWord,
  letterNotInWord
}: KeyboardProps) => {
  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size
  
  const getColorForLetter = (letter: string) => {
    if (letterOnCorrectPosition.includes(letter)) return theme.additional.GameColoring.colors.correctPosition;
    else if (letterInWord.includes(letter)) return theme.additional.GameColoring.colors.inWord;
    else if (letterNotInWord.includes(letter)) return theme.additional.GameColoring.colors.notInWord;
    else return theme.additional.GameColoring.colors.notUsed;
  };

  const onClick = (value: string) => {
    document.getElementById(document.activeElement ? document.activeElement.id : 'app')?.blur();
    if (value === 'Enter') onEnter();
    else if (value === 'Del') onDelete();
    else onChar(value);
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') onEnter();
      else if (e.code === 'Backspace' || e.code === 'Delete') onDelete();
      else if (e.key.length === 1 && e.key >= 'a' && e.key <= 'z') onChar(e.key.toUpperCase());
    };
    window.addEventListener('keyup', listener);
    return () => {window.removeEventListener('keyup', listener);};
  }, [onEnter, onDelete, onChar]);

  return (
    <Box sx={{maxWidth: '700px', mt: '2%', mb: '5%', mx: 'auto'}}>
      <Box>
        {['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'].map((key) => (
          <Key value={key} key={key} onClick={onClick} style={{ backgroundColor: `${getColorForLetter(key)}`}}/>
        ))}
      </Box>
      <Box>
        {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
          <Key value={key} key={key} onClick={onClick} style={{ backgroundColor: `${getColorForLetter(key)}` }}/>
        ))}
      </Box>
      <Box>
        <Key value='Del' onClick={onClick} style={{ width: smallScreen ? '10%' : '14%', backgroundColor: `${getColorForLetter('Delete')}` }}/>
        {['Y', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
          <Key value={key} key={key} onClick={onClick} style={{ backgroundColor: `${getColorForLetter(key)}` }}/>
        ))}
        <Key value='Enter' onClick={onClick} style={{ width: smallScreen ? '10%' : '14%', backgroundColor: `${getColorForLetter('Enter')}` }}/>
      </Box>
    </Box>
  );
};

export default Keyboard;