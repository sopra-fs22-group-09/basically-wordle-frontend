import * as React from 'react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DotWave, Orbit } from '@uiball/loaders';
import { LobbyStatus } from '../models/Lobby';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { GameRoundModel, GameStatus, LetterState, OpponentGameRoundModel, } from '../models/Game';
import LoaderCenterer from '../components/loader';
import { useAppDispatch } from '../redux/hooks';

interface GameInformation {
  gameStatus?: GameStatus
  roundTime: number
  setStatus: (status: LobbyStatus) => void
  startGame: () => void
}

const SUBMIT_GUESS = gql`
  mutation submitGuess($word: String!) {
    submitGuess(word: $word) {
      targetWord
      words
      letterStates
      currentRound
      guessed
    }
  }
`;

const OPPONENT_GAME_ROUND = gql`
  subscription opponentGameRound {
    opponentGameRound {
      player {
        name
      }
      currentRound
      letterStates
    }
  }
`;

const Game = (gameInfo: GameInformation) => {
  const Grid = lazy(() => import('../components/grid/grid'));
  const Keyboard = lazy(() => import('../components/keyboard/keyboard'));

  const [stopwatch, setStopWatch] = useState(gameInfo.roundTime); //TODO no need to renders everytime whole grid
  useEffect(() => {
    setTimeout(() => setStopWatch(stopwatch - 1), 1000);
  }, [stopwatch]);

  const theme = useTheme();
  const dispatch = useAppDispatch();
  const gamestat = useRef(gameInfo.gameStatus); // To be able to access gamestatus within setTimeout
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size

  const [currentRound, setCurrentRound] = useState(1);
  const [delayNewRound, setDelayNewRound] = useState(false);

  // For keyboard
  const [letterOnCorrectPosition, setLetterOnCorrectPosition] = useState('');
  const [letterInWord, setLetterInWord] = useState('');
  const [letterNotInWord, setLetterNotInWord] = useState('');

  // For Grid
  const [currentlyTypingWord, setCurrentlyTypingWord] = useState('');
  const [amountGuesses, setAmountGuesses] = useState(0);
  const [guessHistory, setGuessHistory] = useState(['', '', '', '', '', '']);
  const [letterState, setLetterState] = useState<LetterState[][]>([[]]);

  const toggleModal = (conclusionType: string) => {
    dispatch({type: 'modal/setState', payload: {isOpen: false}});
    dispatch({ type: 'modal/toggle', payload: conclusionType });
  };

  const clearGameScreen = () => {
    setStopWatch(gameInfo.roundTime);
    setCurrentRound(currentRound + 1);

    // For keyboard
    setLetterOnCorrectPosition('');
    setLetterInWord('');
    setLetterNotInWord('');

    // For Grid
    setCurrentlyTypingWord('');
    setAmountGuesses(0);
    setGuessHistory(['', '', '', '', '', '']);
    setLetterState([[]]);
  };

  const finishRound = () => {
    if (gamestat.current == GameStatus.FINISHED) {
      toggleModal('gameConclusion');
    } else {
      toggleModal('gameRoundConclusion');
      setTimeout(() => {
        if (gamestat.current == GameStatus.GUESSING) {
          clearGameScreen();
          dispatch({type: 'modal/setState', payload: {isOpen: false}});
        }
      }, 2500);
    }
  };

  useEffect(() => {
    if (gameInfo.gameStatus == GameStatus.SYNCING || gameInfo.gameStatus == GameStatus.NEW) gameInfo.startGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Please don't touch!!

  useEffect(() => {
    gamestat.current = gameInfo.gameStatus;
    if (gameInfo.gameStatus == GameStatus.WAITING) {
      setDelayNewRound(true);
      toggleModal('gameRoundConclusion');
    } else if (gameInfo.gameStatus == GameStatus.FINISHED) {
      toggleModal('gameConclusion');
    } else if (gameInfo.gameStatus == GameStatus.GUESSING && delayNewRound) {
      setTimeout(() => {
        setDelayNewRound(false);
        clearGameScreen();
        dispatch({type: 'modal/setState', payload: {isOpen: false}});
      }, 2500);
    } else {
      dispatch({type: 'modal/setState', payload: {isOpen: false}});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameInfo.gameStatus]);

  const [submitGuess, {loading}] = useMutation<GameRoundModel>(SUBMIT_GUESS, {
    variables: {
      word: currentlyTypingWord
    },
    onError: error => {
      alert(error.message); //TODO sött nid als alert cho aber wüsst grad nid was susch, vllt het epper e idee
    },
    async onCompleted(data) {
      if (data?.submitGuess) {
        setCurrentRound(data.submitGuess.currentRound + 1);

        // Grid coloring magic
        setGuessHistory(data.submitGuess.words);
        setLetterState(data.submitGuess.letterStates);

        // Keyboard coloring magic
        let corr = letterOnCorrectPosition;
        let inWord = letterInWord;
        let wrong = letterNotInWord;
        const row = data.submitGuess.letterStates[amountGuesses];
        for (let i = 0; i < row.length; ++i) {
          const letter = data.submitGuess.words[amountGuesses].substring(i, i + 1);
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

        if (data.submitGuess.guessed) {
          finishRound();
        }
      }
    }
  });

  //TODO Write hooks to initialize an empty state and show this state. then, use useeffect to update the hooks.
  const opponentGameRoundData = useSubscription<OpponentGameRoundModel>(OPPONENT_GAME_ROUND, {
    skip: gameInfo.gameStatus == GameStatus.NEW || gameInfo.gameStatus == GameStatus.SYNCING
  });

  const onChar = (value: string) => {if (!loading && currentlyTypingWord.length < 5 && amountGuesses < 6) setCurrentlyTypingWord(currentlyTypingWord + value);};
  const onDelete = () => {if (!loading && currentlyTypingWord.length > 0 && amountGuesses < 6) setCurrentlyTypingWord(currentlyTypingWord.substring(0, currentlyTypingWord.length - 1));};
  const onEnter = () => {
    if (!loading && currentlyTypingWord.length === 5 && amountGuesses < 6) {
      submitGuess().then(() => {
        setCurrentlyTypingWord('');
        setAmountGuesses(amountGuesses + 1);
        if (amountGuesses >= 5) { //TODO Hook is too slow and is not updated at this point.. there must be a better solution...
          finishRound();
        }
      });
    }
  };

  //TODO: Still in production, big changes should come in the next weeks
  return (
    <Box
      sx={{
        width: smallScreen ? '100%' : '90%',
        mx:'auto',
        mt: '2.5%',
        textAlign: 'center'
      }}
    >
      {(gameInfo.gameStatus == GameStatus.SYNCING) &&
        <LoaderCenterer>
          <DotWave
            size={50}
            speed={1}
            color='#eee'
          />
        </LoaderCenterer>
      }
      {(gameInfo.gameStatus == GameStatus.GUESSING || gameInfo.gameStatus == GameStatus.WAITING) &&
        <>
          <Box sx={{display: 'inline-block', width: '100%'}}>
            <Typography variant="h3" sx={{fontSize: '24px', textAlign: 'left', display: 'inline-block'}}>Round: {currentRound}</Typography>
            <Typography variant="h3" sx={{fontSize: '24px', textAlign: 'right', display: 'inline-block', float: 'right'}}>Time: {stopwatch} seconds</Typography>
            {gameInfo.gameStatus == GameStatus.WAITING && <Typography variant={'h2'} sx={{fontSize: '32px', textAlign: 'center'}}>Waiting for other players to finish...</Typography>}
          </Box>
          <Box
            sx={{
              width: gameInfo.gameStatus == GameStatus.WAITING ? '100%' : smallScreen ? '100%' : '50%',
              mx: 'auto',
              mt: '2.5%',
              textAlign: 'center',
              display: 'inline-block'
            }}
          >
            <Suspense fallback={<LoaderCenterer><Orbit size={35} color={theme.additional.UiBallLoader.colors.main} /></LoaderCenterer>}>
              <Grid
                currentRow={amountGuesses}
                allGuesses={guessHistory}
                currentWord={currentlyTypingWord}
                allLetterStates={letterState}
              />
            </Suspense>
            {gameInfo.gameStatus == GameStatus.GUESSING &&
              <Suspense fallback={<LoaderCenterer><Orbit size={35} color={theme.additional.UiBallLoader.colors.main}/></LoaderCenterer>}>
                <Keyboard
                  onChar={onChar}
                  onDelete={onDelete}
                  onEnter={onEnter}
                  letterOnCorrectPosition={letterOnCorrectPosition}
                  letterInWord={letterInWord}
                  letterNotInWord={letterNotInWord}
                />
              </Suspense>
            }
          </Box>
          {opponentGameRoundData.data &&
            <Box
              sx={{
                width: gameInfo.gameStatus == GameStatus.WAITING ? '100%' : smallScreen ? '100%' : '40%',
                mr: gameInfo.gameStatus == GameStatus.WAITING ? 'auto' : smallScreen ? 'auto' : '5%',
                float: 'right',
                textAlign: 'center'
              }}
            >
              {opponentGameRoundData.data.opponentGameRound.map((round, i) => (
                <Box
                  key={round.player.name+i}
                  sx={{
                    display: 'inline-block',
                    mb: '5%',
                    mx: '2.5%',
                  }}
                >

                  <Typography variant={'h2'} sx={{fontSize: '32px', textAlign: 'center'}}>{round.player.name} - Round {round.currentRound + 1}</Typography>
                  <Grid allLetterStates={round.letterStates} allGuesses={['', '', '', '', '', '']}/>
                </Box>
              ))}
            </Box>
          }
        </>
      }
    </Box>
  );
};

export default Game;
