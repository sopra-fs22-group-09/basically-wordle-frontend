import * as React from 'react';
import { Box } from '@mui/material';
import Keyboard from '../components/keyboard/keyboard';
import { useState } from 'react';
import Grid from '../components/grid/grid';
import { LobbyStatus } from '../models/Lobby';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
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
  const [currentWord, setCurrentWord] = useState('');
  const [currentGuess, setCurrentGuess] = useState(0);
  const [allGuesses, setAllGuesses] = useState<string[]>(['', '', '', '', '', '']);

  const [submitGuess] = useMutation<GameRoundModel>(SUBMIT_GUESS, {
    variables: {
      word: currentWord
    },
    onCompleted(data) {
      if (data?.submitGuess) {
        //setWords(data.submitGuess.words);
        setLetterState(data.submitGuess.letterStates);

        let corr = letterOnCorrectPosition;
        let inWord = letterInWord;
        let wrong = letterNotInWord;
        const row = data.submitGuess.letterStates[currentGuess];

        for (let i = 0; i < data.submitGuess.letterStates[currentGuess].length; ++i) {
          const letter = data.submitGuess.words[currentGuess].substring(i, i + 1);

          if (row[i] === LetterState.CORRECTPOSITION && !letterOnCorrectPosition.includes(letter)) {
            corr += letter;
            inWord = inWord.replaceAll(letter, '');
          } else if (row[i] === LetterState.INWORD && !inWord.includes(letter) && !corr.includes(letter)) {
            inWord += letter;
          } else if (row[i] === LetterState.WRONG && !wrong.includes(letter)) {
            wrong += letter;
          }
        }
        setLetterOnCorrectPosition(corr);
        setLetterInWord(inWord);
        setLetterNotInWord(wrong);
      }
    }
  });

  function ConcludeGame() {
    const concludeGameData = useQuery<GameStatsModel>(CONCLUDE_GAME, {
      onCompleted(data) {
        console.log('ja');
      }
    });
  }

  const playerStatusData = useSubscription<PlayerStatusModel>(PLAYER_STATUS, {});
  const gameStatusData = useSubscription<GameStatusModel>(GAME_STATUS, {});
  const opponentGameRoundData = useSubscription<OpponentGameRoundModel>(OPPONENT_GAME_ROUND, {});

  const onChar = (value: string) => {if (currentWord.length < 5) setCurrentWord(currentWord + value.toLowerCase());};
  const onDelete = () => {if (currentWord.length > 0) setCurrentWord(currentWord.substring(0, currentWord.length - 1));};
  const onEnter = () => {
    if (currentWord.length === 5 && currentGuess <= 6) {
      const tmp:string[] = allGuesses;
      tmp[currentGuess] = currentWord;
      setAllGuesses(tmp);
      submitGuess().then(() => {
        setCurrentWord('');
        setCurrentGuess(currentGuess + 1);
      });
    }
  };
  return (
    <Box sx={{
      width:'90%',
      mx:'auto',
      mt:'2.5%',
      textAlign: 'center'
    }}>
      <Grid
        currentRow={currentGuess}
        allGuesses={allGuesses}
        currentWord={currentWord}
        allLetterStates={letterState}/>
      <br style={{clear: 'both'}}/>
      <Keyboard
        onChar={onChar}
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