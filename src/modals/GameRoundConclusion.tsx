import * as React from 'react';
import { Box, Modal, Typography } from '@mui/material';
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
    <Modal
      open={open}
    >
      <Box
        sx={{
          display: 'flex',
          position: 'absolute',
          width: '50%',
          height: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'rgba(0, 0, 0, 0.5)',
          boxShadow: 24,
        }}
      >
        <Box sx={{ width:'80%', height:'80%', m:'auto', textAlign:'center' }}>
          <Typography variant='h1' sx={{fontSize: '36px'}}>
            The gameround has finished!
          </Typography>
          <Typography variant='h4' sx={{fontSize: 24, mt:5}}>
            Waiting for the next round.
          </Typography>
          <Typography variant={'body1'} sx={{fontSize: '24px', textAlign: 'center', mt:2}}>
            Target word: {targetWord}
          </Typography>
          <Typography variant={'body1'} sx={{fontSize: '24px', textAlign: 'center'}}>
            Time taken: {Math.floor(timeTaken / 60)
              + ':' + (timeTaken % 60).toFixed(0)}
          </Typography>
          <Typography variant={'body1'} sx={{fontSize: '24px', textAlign: 'center'}}>
            Score: {score}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default GameRoundConclusion;