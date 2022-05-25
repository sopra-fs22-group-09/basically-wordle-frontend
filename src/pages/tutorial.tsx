import * as React from 'react';
import { lazy, Suspense, useState } from 'react';
import { Alert, Box, Button, Typography, useMediaQuery, useTheme, } from '@mui/material';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import LoaderCenterer from '../components/loader';
import { Orbit } from '@uiball/loaders';
import { LetterState } from '../models/Game';

const Tutorial = () => {
  const FINISH_TUTORIAL = gql`
      mutation {
          tutorialFinished
      }
  `;

  interface TutorialType {
    tutorialFinished: boolean;
  }

  const Grid = lazy(() => import('../components/grid/grid'));
  const Keyboard = lazy(() => import('../components/keyboard/keyboard'));

  const navigate = useNavigate();
  const theme = useTheme();

  const [finishTutorial, { loading, error }] = useMutation<TutorialType>(FINISH_TUTORIAL);
  const [count, setCount] = useState(0);
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size
  const allGuesses = ['HOMIE', 'UNDER', 'ROMAN', 'ROYAL'];
  const allLetterStates = [
    [LetterState.WRONG, LetterState.CORRECTPOSITION, LetterState.WRONG, LetterState.WRONG, LetterState.WRONG],
    [LetterState.WRONG, LetterState.WRONG, LetterState.WRONG, LetterState.WRONG, LetterState.INWORD],
    [LetterState.CORRECTPOSITION, LetterState.CORRECTPOSITION, LetterState.WRONG, LetterState.CORRECTPOSITION, LetterState.WRONG],
    [LetterState.CORRECTPOSITION, LetterState.CORRECTPOSITION, LetterState.CORRECTPOSITION, LetterState.CORRECTPOSITION, LetterState.CORRECTPOSITION],
  ];
  const letterOnCorrectPosition = ['', 'O', 'O', 'ORA', 'ORAYL'];
  const letterInWord = ['', '', 'R', '', ''];
  const letterNotInWord = ['', 'HMIE', 'HMIEUND', 'HMIEUNDN', 'HMIEUNDN'];
  const text = [
    'Wordle is a fun game where the player tries to guess a word consisting of five letters in as few tries as possible. The first step is to enter any five-letter word.',
    'If the entered word contains a letter from the target word and this letter is also in the correct position, it will turn green. Blacked out letters do not appear in the target word.',
    'If a letter turns yellow, it means that it appears in the target word, but in a different position.',
    'We are getting closer...',
    'Ta-da! We have found the target word! If you do not manage to solve the riddle in a maximum of six tries, you lose the game. Now go and have some fun!'
  ];
  const maxCount = Math.min(letterOnCorrectPosition.length, letterInWord.length, letterNotInWord.length) - 1; // Since only those can cause OutOfBound

  const getAllGuesses = () => {
    const tmp = [allGuesses[0]];
    let i: number;
    for (i = 1; i < count; ++i) tmp.push(allGuesses[i]);
    while (tmp.length < 6) tmp.push('');
    return tmp;
  };

  const getAllLetterStates = () => {
    if (count === 0) return [[]];
    const tmp = [];
    let i: number;
    for (i = 0; i < count; ++i) tmp.push(allLetterStates[i]);
    while (tmp.length < 6) tmp.push([]);
    return tmp;
  };

  const handleSubmit = () => {
    if (count === maxCount - 1) finishTutorial();
    else if (count === maxCount) navigate('/');
    setCount(count + 1);
  };
  
  return (
    <Box sx={{width: smallScreen ? '100%' : '90%', maxWidth: '700px', mx:'auto', textAlign: 'center'}}>
      <Typography variant="h1" fontSize="48px" sx={{mt: '20px'}}>Tutorial</Typography>
      {(!loading && error) && <Alert sx={{ mt: 3, minWidth: 1, maxWidth: 1 }} variant="filled" severity="error">{error.message}</Alert>}
      <Suspense fallback={<LoaderCenterer><Orbit size={35} color={theme.additional.UiBallLoader.colors.main} /></LoaderCenterer>}>
        <Grid
          allGuesses={getAllGuesses()}
          allLetterStates={getAllLetterStates()}
          style={{width: smallScreen ? '70%' : 'auto'}}
        />
      </Suspense>
      <Suspense fallback={<LoaderCenterer><Orbit size={35} color={theme.additional.UiBallLoader.colors.main}/></LoaderCenterer>}>
        <Keyboard
          letterOnCorrectPosition={letterOnCorrectPosition[count]}
          letterInWord={letterInWord[count]}
          letterNotInWord={letterNotInWord[count]}
        />
      </Suspense>
      <Typography sx={{minHeight: smallScreen ? '96px' : '48px', width: smallScreen ? '90%' : '100%', mx: 'auto', textAlign: 'center'}} variant="body1">{text[count]}</Typography>

      <Button
        onClick={() => setCount(count > 0 ? count - 1 : 0)}
        variant="contained"
        sx={{width: smallScreen ? '90%' : '33%', mt: smallScreen ? '30px' : '50px', float: smallScreen ? 'none' : 'left'}}
        disabled={count <= 0}
      >
            Back
      </Button>
      <Typography
        sx={{
          width: smallScreen ? '90%' : '33%',
          height: '36.5px',
          mt: smallScreen ? '15px' : '50px',
          mx: 'auto',
          pt: '6px',
          float: smallScreen ? 'none' : 'left'
        }}
        variant="body1"
      >
        {count + 1} / {maxCount + 1}
      </Typography>
      <Button
        onClick={handleSubmit}
        variant="contained"
        sx={{width: smallScreen ? '90%' : '33%', mt: smallScreen ? '15px' : '50px', float: smallScreen ? 'none' : 'right'}}
      >
        {count < maxCount ? 'Next' : 'Let\'s play!'}
      </Button>
    </Box>
  );
};

export default Tutorial;