import * as React from 'react';
import { Box } from '@mui/material';
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
  
  const getColorForLetter = (letter: string) => {
    if (letterOnCorrectPosition.toUpperCase().includes(letter.toUpperCase())) return 'lightgreen';
    else if (letterInWord.toUpperCase().includes(letter.toUpperCase())) return 'orange';
    else if (letterNotInWord.toUpperCase().includes(letter.toUpperCase())) return 'black';
    else return 'gray';
  };

  const onClick = (value: string) => {
    if (value === 'Enter') onEnter();
    else if (value === 'Delete') onDelete();
    else onChar(value);
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.code === 'Enter') onEnter();
      else if (e.code === 'Backspace') onDelete();
      else {
        const key = e.key.toLowerCase();
        if (key.length === 1 && key >= 'a' && key <= 'z') onChar(key);
      }
    };
    window.addEventListener('keyup', listener);
    return () => {
      window.removeEventListener('keyup', listener);
    };
  }, [onEnter, onDelete, onChar]);

  return (
    <Box sx={{minWidth: '380px'}}>
      <Box>
        {['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            style={{
              backgroundColor: `${getColorForLetter(key)}`,
            }}
          />
        ))}
      </Box>
      <Box>
        {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            style={{
              backgroundColor: `${getColorForLetter(key)}`,
            }}
          />
        ))}
      </Box>
      <Box>
        <Key
          value="Delete"
          onClick={onClick}
          style={{
            width: '12%',
            minWidth: '60px',
            backgroundColor: `${getColorForLetter('Delete')}`
          }}
        />
        {['Y', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
          <Key
            value={key}
            key={key}
            onClick={onClick}
            style={{
              backgroundColor: `${getColorForLetter(key)}`,
            }}
          />
        ))}
        <Key
          value="Enter"
          onClick={onClick}
          style={{
            width: '12%',
            minWidth: '60px',
            backgroundColor: `${getColorForLetter('Enter')}`
          }}
        />
      </Box>
    </Box>
  );
};

export default Keyboard;