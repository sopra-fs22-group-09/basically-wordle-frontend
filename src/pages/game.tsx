import * as React from 'react';
import { Box } from '@mui/material';
import Keyboard from '../components/keyboard/keyboard';
import { useState } from 'react';

const Game = () => {
  const [letterOnCorrectPosition, setLetterOnCorrectPosition] = useState('');
  const [letterInWord, setLetterInWord] = useState('');
  const [letterNotInWord, setLetterNotInWord] = useState('');

  const onChar = (value: string) => {
    alert('Your pressed ' + value + '.');
  };

  const onDelete = () => {
    alert('You pressed delete.');
  };

  const onEnter = () => {
    alert('You pressed enter.');
  };

  return (
    <Box sx={{
      width:'90%',
      mx:'auto',
      mt:'2.5%',
      textAlign: 'center'
    }}>
      <Keyboard onChar={onChar} 
        onDelete={onDelete} 
        onEnter={onEnter}
        letterOnCorrectPosition={letterOnCorrectPosition}
        letterInWord={letterInWord} 
        letterNotInWord={letterNotInWord}
      />
    </Box>
  );
};

export default Game;