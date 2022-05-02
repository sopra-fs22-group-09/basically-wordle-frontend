import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Keyboard from '../components/keyboard/keyboard';
import Grid from '../components/grid/grid';
import { LobbyStatus } from '../models/Lobby';
import { gql, useMutation, useSubscription } from '@apollo/client';
import {
  GameRoundModel,
  GameStatus,
  GameStatusModel,
  LetterState,
  OpponentGameRoundModel,
  PlayerStatus,
  PlayerStatusModel
} from '../models/Game';
import GameConclusion from '../modals/GameConclusion';

interface GameInformation {
  name: string
  setStatus: (status: LobbyStatus) => void
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
  subscription playerStatus {
    playerStatus
  }
`;

const GAME_STATUS = gql`
  subscription gameStatus {
    gameStatus
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

  const [open, setOpen] = React.useState<boolean>(false);
  const toggleModal = () => {
    setOpen(!open);
  };

  const [words, setWords] = React.useState<string[]>([]);
  const [letterState, setLetterState] = React.useState<LetterState[][]>([[]]);
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>(PlayerStatus.SYNCING);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.PREPARING);

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



        console.log(gameStatus);
        if (currentGuess >= 5) {
          toggleModal();
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
          toggleModal();
        }
      }
    }
  });

  /*  function ConcludeGame() {
    const concludeGameData = useQuery<GameStatsModel>(CONCLUDE_GAME, {
      onCompleted(data) {
        toggleModal();
      }
    });
  }*/

  const playerStatusData = useSubscription<PlayerStatusModel>(PLAYER_STATUS, {});
  useEffect(() => {
    if (!playerStatusData.loading && playerStatusData.data?.playerStatus) {
      setPlayerStatus(playerStatusData.data.playerStatus);
    }
  }, [playerStatusData.data, playerStatusData.loading]);

  const gameStatusData = useSubscription<GameStatusModel>(GAME_STATUS, {});
  useEffect(() => {
    if (!gameStatusData.loading && gameStatusData.data?.gameStatus) {
      setGameStatus(gameStatusData.data.gameStatus);
      if (gameStatus == GameStatus.FINISHED) {
        toggleModal();
      }
    }
  }, [gameStatus, gameStatusData.data, gameStatusData.loading]);

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
      <GameConclusion open={open} toggle={toggleModal}/>
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