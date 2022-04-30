import * as React from 'react';
import { LobbyStatus } from '../models/Lobby';
import { Button } from '@mui/material';

interface GameInformation {
  name: string
  setStatus: (status: LobbyStatus) => void
}

const Game = (gameInfo: GameInformation) => {

  return (
    <Button variant="contained" sx={{ mx:2, mt:2 }} onClick={() => gameInfo.setStatus(LobbyStatus.OPEN)}>End Game</Button>
  );
};

export default Game;