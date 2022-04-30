import * as React from 'react';
import { LobbyStatus } from '../models/Lobby';
import { Button } from '@mui/material';
import { gql } from '@apollo/client';

interface GameInformation {
  name: string
  setStatus: (status: LobbyStatus) => void
}

const SUBMIT_GUESS = gql`
  mutation submitGuess($word: String!) {
    submitGuess(word: $word) {
      player {
        id
        name
      }
      currentRound
      targetWord
      words
      letterStates
    }
  }
`;

const NEXT_GAME_ROUND = gql`
  mutation nextGameRound {
    nextGameRound {
      player {
        id
        name
      }
      currentRound
      targetWord
      words
      letterStates
    }
  }
`;

const Game = (gameInfo: GameInformation) => {

  return (
    <Button variant="contained" sx={{ mx:2, mt:2 }} onClick={() => gameInfo.setStatus(LobbyStatus.OPEN)}>End Game</Button>
  );
};

export default Game;