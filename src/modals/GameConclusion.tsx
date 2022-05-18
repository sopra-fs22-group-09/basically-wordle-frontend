import * as React from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { GameStatsModel } from '../models/Game';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { useEffect } from 'react';

const CONCLUDE_GAME = gql`
  query concludeGame {
    concludeGame {
      targetWord
      roundsTaken
      timeTaken
      score
      rank
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
  const open = useAppSelector(state => state.modal.isOpen && state.modal.modalWindow == 'gameConclusion');

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [concludeGame, {data}] = useLazyQuery<GameStatsModel>(CONCLUDE_GAME, { //TODO unsupress for later below
    onCompleted(data) {
      alert(data.concludeGame.score);
      //console.log('ja');
      //gameInfo.setStatus(LobbyStatus.OPEN);
    },
    fetchPolicy: 'network-only'
  });
  useEffect(() => {
    concludeGame();
  }, [concludeGame]);

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
          <Typography variant='h1' sx={{fontSize: 48}}>
            Game finished!
          </Typography>
          <Typography variant='h2' sx={{fontSize: 24, mt:10}}>
            Check here later again for Game Stats!
          </Typography>
          <Button variant="contained" sx={{ mr:2 }} onClick={() => playAgain()}>Play Again</Button>
          
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