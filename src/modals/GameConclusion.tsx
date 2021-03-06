import * as React from 'react';
import { Button, Chip, Typography } from '@mui/material';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { GameStatsModel } from '../models/Game';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect, useState } from 'react';
import ModalTemplate from '../components/modal';
import ArrowDropUpRounded from '@mui/icons-material/ArrowDropUpRounded';
import { Player } from '../models/Player';

const CONCLUDE_GAME = gql`
  query concludeGame {
    concludeGame {
      targetWord
      timeTaken
      roundsTaken
      score
      ranking {
          id
          name
        }
    }
  }
`;

const REINITIALIZE_LOBBY = gql`
  mutation reinitializeLobby {
    playAgain
  }
`;

const GameConclusion = () => {
  const dispatch = useAppDispatch();
  const [targetWord, setTargetWord] = useState('');
  const [timeTaken, setTimeTaken] = useState(0);
  const [roundsTaken, setRoundsTaken] = useState(0);
  const [score, setScore] = useState(0);
  const [ranking, setRanking] = useState<Player[]>([]);
  const open = useAppSelector((state) => state.modal.isOpen && state.modal.modalWindow == 'gameConclusion');

  const [concludeGame] = useLazyQuery<GameStatsModel>(CONCLUDE_GAME, {
    //TODO unsupress for later below
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    if (open) {
      concludeGame().then((r) => {
        if (!r.loading && r.data) {
          setTimeTaken(r.data.concludeGame.timeTaken);
          setTargetWord(r.data.concludeGame.targetWord);
          setRoundsTaken(r.data.concludeGame.roundsTaken);
          setScore(r.data.concludeGame.score);
          setRanking(r.data.concludeGame.ranking);
        }
      });
    }
  }, [concludeGame, open]);

  const [reInitLobby] = useMutation(REINITIALIZE_LOBBY);

  const playAgain = () => {
    dispatch({ type: 'modal/setState', payload: { isOpen: false } });
    reInitLobby();
  };

  return(
    <ModalTemplate maxWidth="500px" name="gameConclusion">
      <Typography variant="h1" fontSize="42px">
          Game finished!
      </Typography>
      <Typography variant="body1" fontSize="24px" sx={{ mt: '30px' }}>
          Last target word: {targetWord}
      </Typography>
      <Typography variant="body1" fontSize="24px">
          Total time taken:{' '}
        {Math.floor(timeTaken / 60) + ((timeTaken % 60).toString().length == 1 ? ':0' : ':') + (timeTaken % 60)}
      </Typography>
      <Typography variant="body1" fontSize="24px">
          Rounds guessed: {roundsTaken}
      </Typography>
      <Typography variant="body1" fontSize="24px">
          Score:{' '}
        <Chip color="warning" icon={<ArrowDropUpRounded />} size='small' label={score} />
      </Typography>
      <Typography variant="h2" fontSize="24px">
        Ranking:
      </Typography>
      {ranking?.map((player, index) => (
        <Typography key={player.id} sx={{ mt: '5px' }}>
          {(index + 1) + '. '}
          <Chip
            sx={{ ml: '5px' }}
            color={ index == 0 ? 'warning' : 'default' }
            label={player.name}
          />
        </Typography>

      ))}

      <Button variant="contained" sx={{ mt: '30px' }} onClick={() => playAgain()}>
          Play Again
      </Button>
    </ModalTemplate>
  );
};

export default GameConclusion;
