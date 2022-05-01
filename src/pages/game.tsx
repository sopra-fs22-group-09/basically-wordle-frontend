import * as React from 'react';
import { LobbyStatus } from '../models/Lobby';
import { Button } from '@mui/material';
import { gql, useMutation, useSubscription } from '@apollo/client';
import {
  GameRoundModel,
  GameStatsModel,
  GameStatusModel,
  LetterState,
  OpponentGameRoundModel,
  PlayerStatusModel
} from '../models/Game';

interface GameInformation {
  name: string
  setStatus: (status: LobbyStatus) => void
}

const SUBMIT_GUESS = gql`
  mutation submitGuess($word: String!) {
    submitGuess(word: $word) {
      words
      letterStates
    }
  }
`;

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

const PLAYER_STATUS = gql`
  subscription gameStatus {
    gameStatus {
      gameStatus
    }
  }
`;

const GAME_STATUS = gql`
  subscription gameStatus {
    gameStatus {
      gameStatus
    }
  }
`;

const OPPONENT_GAME_ROUND = gql`
  subscription opponentGameRound {
    opponentGameRound {
      gameRounds
    }
  }
`;

const Game = (gameInfo: GameInformation) => {

  const [words, setWords] = React.useState<string[]>([]);
  const [letterState, setLetterState] = React.useState<LetterState[][]>([[]]);
  
  const [submitGuess, submitGuessData] = useMutation<GameRoundModel>(SUBMIT_GUESS);
  const guess = () => {
    submitGuess({
      onCompleted(data) {
        if (data?.submitGuess) {
          setWords(data.submitGuess.words);
          setLetterState(data.submitGuess.letterStates);
        }
      }
    });
  };

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [concludeGame, concludeGameData] = useMutation<GameStatsModel>(CONCLUDE_GAME);
  const conclude = () => {
    concludeGame();
  };

  const playerStatusData = useSubscription<PlayerStatusModel>(PLAYER_STATUS, {});

  const gameStatusData = useSubscription<GameStatusModel>(GAME_STATUS, {});

  const opponentGameRoundData = useSubscription<OpponentGameRoundModel>(OPPONENT_GAME_ROUND, {});


  return (
    <Button variant="contained" sx={{ mx:2, mt:2 }} onClick={() => gameInfo.setStatus(LobbyStatus.OPEN)}>End Game</Button>
  );
};

export default Game;