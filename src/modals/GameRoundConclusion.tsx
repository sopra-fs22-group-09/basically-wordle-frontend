import * as React from 'react';
import { Box, Button, Modal, Typography } from '@mui/material';
import { GameStatsModel } from '../models/Game';

interface GameConclusionInformation {
  open: boolean
  toggle: () => void
  handleRematch: () => void
  owner: boolean
  data?: GameStatsModel
}

const GameRoundConclusion = (open: GameConclusionInformation) => {

  return(
    <Modal
      open={open.open}
      onClose={open.toggle}
    >
      <Box
        sx={{
          display: 'flex',
          position: 'absolute',
          width: '60%',
          height: '60%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'black',
          boxShadow: 24,
        }}
      >
        <Box sx={{ width:'80%', height:'80%', m:'auto', textAlign:'center' }}>
          <Typography variant='h2' sx={{fontSize: 48}}>
            Game finished!
          </Typography>
          <Typography variant={'body1'} sx={{fontSize: '32px', textAlign: 'center'}}>Score: {open.data?.concludeGame.score}</Typography>
          <Typography variant={'body1'} sx={{fontSize: '32px', textAlign: 'center'}}>Rank: {open.data?.concludeGame.rank}</Typography>
          <Typography variant={'body1'} sx={{fontSize: '32px', textAlign: 'center'}}>Target word: {open.data?.concludeGame.targetWord}</Typography>
          <Typography variant={'body1'} sx={{fontSize: '32px', textAlign: 'center'}}>Rounds taken: {open.data?.concludeGame.roundsTaken}</Typography>
          <Typography variant={'body1'} sx={{fontSize: '32px', textAlign: 'center'}}>Time taken: {open.data?.concludeGame.timeTaken}</Typography>
          {open.owner && <Button variant="contained" sx={{ mb:2, mt:3 }} onClick={open.handleRematch}>Back to Lobby</Button>}
        </Box>
      </Box>
    </Modal>
  );
};

export default GameRoundConclusion;