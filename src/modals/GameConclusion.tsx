import * as React from 'react';
import { Box, Button, Modal, Typography, useMediaQuery, useTheme } from '@mui/material';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { GameStatsModel } from '../models/Game';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect, useState } from 'react';

const CONCLUDE_GAME = gql`
  query concludeGame {
    concludeGame {
      targetWord
      timeTaken
      roundsTaken
      score
    }
  }
`;

const REINITIALIZE_LOBBY = gql`
  mutation reinitializeLobby {
    playAgain
  }
`;

const GameConclusion = () => {
  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size
  const dispatch = useAppDispatch();
  const [targetWord, setTargetWord] = useState('');
  const [timeTaken, setTimeTaken] = useState(0);
  const [roundsTaken, setRoundsTaken] = useState(0);
  const [score, setScore] = useState(0);
  const open = useAppSelector(state => state.modal.isOpen && state.modal.modalWindow == 'gameConclusion');

  const [concludeGame] = useLazyQuery<GameStatsModel>(CONCLUDE_GAME, { //TODO unsupress for later below
    fetchPolicy: 'network-only'
  });
  useEffect(() => {
    if (open) {
      concludeGame()
        .then(r => {
          if (!r.loading && r.data) {
            setTimeTaken(r.data.concludeGame.timeTaken);
            setTargetWord(r.data.concludeGame.targetWord);
            setRoundsTaken(r.data.concludeGame.roundsTaken);
            setScore(r.data.concludeGame.score);
          }
        });
    }
  }, [concludeGame, open]);

  const [reInitLobby] = useMutation(REINITIALIZE_LOBBY);

  const playAgain = () => {
    dispatch({type: 'modal/setState', payload: {isOpen: false}});
    reInitLobby();
  };
  
  return(
    <Modal open={open}>
      <Box
        sx={{
          position: 'fixed',
          width: '90vw',
          maxWidth: '500px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          px: smallScreen ? '20px' : '50px',
          py: smallScreen ? '30px' : '50px',
          bgcolor: 'rgba(0, 0, 0, 0.75)',
          boxShadow: '0 0 20px -7px rgba(0, 0, 0, 0.2)',
          border: '1px solid white',
          borderRadius: '15px',
          textAlign: 'center'
        }}
      >
        <Typography variant='h1' sx={{fontSize: '42px'}}>Game finished!</Typography>
        <Typography variant={'body1'} sx={{fontSize: '24px', mt: '30px'}}>Last target word: {targetWord}</Typography>
        <Typography variant={'body1'} sx={{fontSize: '24px'}}>Total time taken: {Math.floor(timeTaken / 60) + ':' + (timeTaken % 60).toFixed(0)}</Typography>
        <Typography variant={'body1'} sx={{fontSize: '24px'}}>Rounds played: {roundsTaken}</Typography>
        <Typography variant={'body1'} sx={{fontSize: '24px'}}>Score: {score}</Typography>
        <Button variant="contained" sx={{ mt: '30px' }} onClick={() => playAgain()}>Play Again</Button>
      </Box>
    </Modal>
  );
};

export default GameConclusion;