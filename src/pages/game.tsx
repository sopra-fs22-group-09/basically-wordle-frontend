import * as React from 'react';
import { Box } from '@mui/material';
import Keyboard from '../components/keyboard/keyboard';
import { useState } from 'react';
import Grid from '../components/grid/grid';
import { LobbyStatus } from '../models/Lobby';
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

  const [letterOnCorrectPosition, setLetterOnCorrectPosition] = useState('');
  const [letterInWord, setLetterInWord] = useState('');
  const [letterNotInWord, setLetterNotInWord] = useState('');

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

  const onChar = (value: string) => {
    alert('Your pressed ' + value + '.');
  };

  const onDelete = () => {
    alert('You pressed delete.');
  };

  const onEnter = () => {
    alert('You pressed enter.');
  };

  return (
    <Box sx={{
      width:'90%',
      mx:'auto',
      mt:'2.5%',
      textAlign: 'center'
    }}>
      <Grid currentRow={0} />
      <br style={{clear: 'both'}}/>
      <Keyboard onChar={onChar}
                onDelete={onDelete}
                onEnter={onEnter}
                letterOnCorrectPosition={letterOnCorrectPosition}
                letterInWord={letterInWord}
                letterNotInWord={letterNotInWord}
      />
    </Box>
  );
};

export default Game;