import * as React from 'react';
import { Box, Modal, Typography } from '@mui/material';

interface GameConclusionInformation {
  open: boolean
  toggle: () => void
}

const GameConclusion = (open: GameConclusionInformation) => {

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
          <Typography variant='h4' sx={{fontSize: 24, mt:10}}>
            Check here later again for Game Stats!
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default GameConclusion;