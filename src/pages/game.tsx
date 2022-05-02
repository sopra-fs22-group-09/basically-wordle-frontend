import * as React from 'react';
import { Box, Typography } from '@mui/material';
import Keyboard from '../components/keyboard/keyboard';
import { useState } from 'react';
import Grid from '../components/grid/grid';
import { LobbyStatus } from '../models/Lobby';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import {
  GameRoundModel,
  GameStatsModel,
  GameStatus,
  LetterState,
  OpponentGameRoundModel,
} from '../models/Game';
import GameConclusion from '../modals/GameConclusion';

interface GameInformation {
  name: string
  setStatus: (status: LobbyStatus) => void
  gameStatus?: GameStatus
}

const SUBMIT_GUESS = gql`
  mutation submitGuess($word: String!) {
    submitGuess(word: $word) {
      targetWord
      words
      letterStates
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

const Game = (gameInfo: GameInformation) => {

  const [roundConclusion, setRoundConclusion] = React.useState<boolean>(false);
  const [gameConclusion, setGameConclusion] = React.useState<boolean>(false);
  const toggleRoundConclusionModal = () => {
    setRoundConclusion(!roundConclusion);
  };
  const toggleGameConclusionModal = () => {
    setGameConclusion(!gameConclusion);
  };

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
        console.log(data.submitGuess.targetWord);
        //setWords(data.submitGuess.words);
        // TODO Just a temporary fix since the broken backend:
        //  The backend returns null when submitting the last guess and there are still rounds left
        //  Remove "? data.submitGuess.letterStates : letterState" once backend is fixed
        setLetterState(data.submitGuess.letterStates ? data.submitGuess.letterStates : letterState);

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


        //TODO: This section needs refactoring based on gamestatus subscription(update)
        if (currentGuess >= 5) {
          toggleRoundConclusionModal();
        }
        let allRight = true;
        console.log(row);
        for (const letterState of row) {
          console.log(letterState);
          if (letterState != LetterState.CORRECTPOSITION) {
            allRight = false;
          }
        }
        if (allRight) {
          toggleRoundConclusionModal();
        }
      }
    }
  });

  const opponentGameRoundData = useSubscription<OpponentGameRoundModel>(OPPONENT_GAME_ROUND, {});

  function ConcludeGame() {
    const concludeGameData = useQuery<GameStatsModel>(CONCLUDE_GAME, {
      onCompleted(data) {
        console.log('ja');
      }
    });
  }

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
      <GameConclusion open={roundConclusion} toggle={toggleRoundConclusionModal}/>
      <GameConclusion open={gameConclusion} toggle={toggleGameConclusionModal}/>
      <Box sx={{width: '66%', float: 'left', m: 'auto'}}>
        <Box sx={{height: '50vh'}}>
          <Grid
            currentRow={currentGuess}
            allGuesses={allGuesses}
            currentWord={currentWord}
            allLetterStates={letterState}
            style={{height: '100%'}}
          />
        </Box>
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
      {/*Opponents grid*/}
      <Box sx={{width: '30%', float: 'right'}}>
        {opponentGameRoundData.data?.gameRounds.map((round) => (
          <>
            <Box style={{height: '19vh'}}>
              <Typography variant={'h2'} sx={{fontSize: '32px', pt: '10px'}}>{round.player.name}</Typography>
              <Grid
                allLetterStates={round.letterStates}
                allGuesses={['', '', '', '', '', '']}
                style={{height: '100%'}}/>
            </Box>
            <br style={{clear: 'both'}}/>
          </>
        ))}
      </Box>
    </Box>
  );
};

export default Game;