import * as React from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
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
          bgcolor: 'black',
          boxShadow: 24,
        }}
      >
        <Box sx={{ width:'80%', height:'80%', m:'auto', textAlign:'center' }}>
          <Typography variant='h1' sx={{fontSize: '48px'}}>
            Game finished!
          </Typography>
          <Typography variant={'body1'} sx={{fontSize: '24px', textAlign: 'center', mt:5}}>
            Last target word: {targetWord}
          </Typography>
          <Typography variant={'body1'} sx={{fontSize: '24px', textAlign: 'center'}}>
            Total time taken: {Math.floor(timeTaken / 60)
            + ((timeTaken % 60).toString().length == 1 ? ':0' : ':') + (timeTaken % 60)}
          </Typography>
          <Typography variant={'body1'} sx={{fontSize: '24px', textAlign: 'center'}}>
            Rounds played: {roundsTaken}
          </Typography>
          <Typography variant={'body1'} sx={{fontSize: '24px', textAlign: 'center'}}>
            Score: {score}
          </Typography>
          <Button variant="contained" sx={{ mt:2 }} onClick={() => playAgain()}>Play Again</Button>
          
          {/*          <Typography variant={'h1'} sx={{fontSize: '48px', textAlign: 'center'}}>Game is finished</Typography>
          <Typography variant={'body1'} sx={{fontSize: '32px', textAlign: 'center'}}>Score: {data?.concludeGame.score}</Typography>
          <Typography variant={'body1'} sx={{fontSize: '32px', textAlign: 'center'}}>Rank: {data?.concludeGame.rank}</Typography>
          <Typography variant={'body1'} sx={{fontSize: '32px', textAlign: 'center'}}>Target word: {data?.concludeGame.targetWord}</Typography>
          <Typography variant={'body1'} sx={{fontSize: '32px', textAlign: 'center'}}>Rounds taken: {data?.concludeGame.roundsTaken}</Typography>
          <Typography variant={'body1'} sx={{fontSize: '32px', textAlign: 'center'}}>Time taken: {data?.concludeGame.timeTaken}</Typography>*/}
          {/*TODO <Button variant='contained' sx={{ mx:2, mt:2 }} disabled={localStorage.getItem('userId') != ownerId} onClick={() => setStatus(LobbyStatus.OPEN)}>Back to Lobby</Button>*/}

        </Box>
      </Box>
    </Modal>
  );
};

export default GameConclusion;