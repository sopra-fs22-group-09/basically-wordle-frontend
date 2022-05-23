import * as React from 'react';
import { Box, Modal, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useAppSelector } from '../redux/hooks';
import { gql, useLazyQuery } from '@apollo/client';
import { GameStatsModel } from '../models/Game';
import { useEffect, useState } from 'react';

const CONCLUDE_ROUND = gql`
  query concludeGame {
    concludeGame {
      targetWord
      timeTaken
      score
    }
  }
`;

const GameRoundConclusion = () => {
  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size
  const [targetWord, setTargetWord] = useState('');
  const [timeTaken, setTimeTaken] = useState(0);
  const [score, setScore] = useState(0);
  const open = useAppSelector(state => state.modal.isOpen && state.modal.modalWindow == 'gameRoundConclusion');

  const [concludeRound] = useLazyQuery<GameStatsModel>(CONCLUDE_ROUND, { //TODO unsupress for later below
    fetchPolicy: 'network-only'
  });
  useEffect(() => {
    if (open) {
      concludeRound()
        .then(r => {
          if (!r.loading && r.data) {
            setTimeTaken(r.data.concludeGame.timeTaken);
            setTargetWord(r.data.concludeGame.targetWord);
            setScore(r.data.concludeGame.score);
          }
        });
    }
  }, [concludeRound, open]);

  return(
    <Modal open={open}>
      <Box
        sx={{
          position: 'fixed',
          width: '90vw',
          maxWidth: '650px',
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
        <Typography variant='h1' sx={{fontSize: '42px'}}>The gameround has finished!</Typography>
        <Typography variant='h2' sx={{fontSize: '24px', mt: '20px'}}>Waiting for the next round...</Typography>
        <Typography variant={'body1'} sx={{fontSize: '24px', mt: '30px'}}>Target word: {targetWord}</Typography>
        <Typography variant={'body1'} sx={{fontSize: '24px'}}>Time taken: {Math.floor(timeTaken / 60) + ':' + (timeTaken % 60).toFixed(0)}</Typography>
        <Typography variant={'body1'} sx={{fontSize: '24px'}}>Score: {score}</Typography>
      </Box>
    </Modal>
  );
};

export default GameRoundConclusion;