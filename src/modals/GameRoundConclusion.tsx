import * as React from 'react';
import { Box, Modal, Typography } from '@mui/material';
import { useAppSelector } from '../redux/hooks';

const GameRoundConclusion = () => {

  const open = useAppSelector(state => state.modal.isOpen && state.modal.modalWindow == 'gameRoundConclusion');

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
          <Typography variant='h2' sx={{fontSize: 48}}>
            The gameround has finished!
          </Typography>
          <Typography variant='h4' sx={{fontSize: 24, mt:10}}>
            Wait for other players to finish their round.
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default GameRoundConclusion;