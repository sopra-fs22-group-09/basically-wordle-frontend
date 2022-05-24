import * as React from 'react';
import { Typography } from '@mui/material';
import { useAppSelector } from '../redux/hooks';
import { gql, useLazyQuery } from '@apollo/client';
import { GameStatsModel } from '../models/Game';
import { useEffect, useState } from 'react';
import ModalTemplate from '../components/modal';

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
    <ModalTemplate maxWidth="650px" name="gameRoundConclusion">
      <Typography variant="h1" fontSize="42px">The round has finished!</Typography>
      <Typography variant="h2" fontSize="24px" sx={{mt: '20px'}}>Waiting for the next round...</Typography>
      <Typography variant="body1" fontSize="24px" sx={{mt: '30px'}}>Target word: {targetWord}</Typography>
      <Typography variant="body1" fontSize="24px">Total time taken: {Math.floor(timeTaken / 60) + ((timeTaken % 60).toString().length == 1 ? ':0' : ':') + (timeTaken % 60)}</Typography>
      <Typography variant="body1" fontSize="24px">Score: {score}</Typography>
    </ModalTemplate>
  );
};

export default GameRoundConclusion;