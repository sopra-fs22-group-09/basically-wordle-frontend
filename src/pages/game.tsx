import * as React from 'react';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Box, LinearProgress, Snackbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { DotWave, Orbit } from '@uiball/loaders';
import { GameMode, LobbyStatus } from '../models/Lobby';
import { gql, useMutation, useSubscription } from '@apollo/client';
import { GameRoundModel, GameStatus, LetterState, OpponentGameRoundModel, } from '../models/Game';
import LoaderCenterer from '../components/loader';
import { useAppDispatch } from '../redux/hooks';

interface GameInformation {
  gameMode: GameMode;
  gameStatus?: GameStatus
  roundTime: number
  setStatus: (status: LobbyStatus) => void
  startGame: () => void
  maxRounds: number
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

  const theme = useTheme();
  const smallScreen = !useMediaQuery(theme.breakpoints.up('mobile')); //screen smaller than defined size
  const dispatch = useAppDispatch();
  const gamestat = useRef(gameInfo.gameStatus); // To be able to access gamestatus within setTimeout

  const [currentRound, setCurrentRound] = useState(1);
  const [delayNewRound, setDelayNewRound] = useState(false);
  const [timer, setTimer] = useState(0);

  // For keyboard
  const [letterOnCorrectPosition, setLetterOnCorrectPosition] = useState('');
  const [letterInWord, setLetterInWord] = useState('');
  const [letterNotInWord, setLetterNotInWord] = useState('');

  // For Grid
  const [currentlyTypingWord, setCurrentlyTypingWord] = useState('');
  const [amountGuesses, setAmountGuesses] = useState(0);
  const [guessHistory, setGuessHistory] = useState(['', '', '', '', '', '']);
  const [letterState, setLetterState] = useState<LetterState[][]>([[]]);
  const [shake, setShake] = useState(false);

  const toggleModal = useCallback((conclusionType: string) => {
    dispatch({type: 'modal/setState', payload: {isOpen: false}});
    dispatch({ type: 'modal/toggle', payload: conclusionType });
  }, [dispatch]);

  const clearGameScreen = () => {
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
    setShake(false);

    dispatch({type: 'modal/setState', payload: {isOpen: false}});
  };

  //Sync
  useEffect(() => {
    if (gameInfo.gameStatus == GameStatus.SYNCING || gameInfo.gameStatus == GameStatus.NEW) gameInfo.startGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Please don't touch!!

  //Timer
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (gameInfo.gameStatus == GameStatus.FINISHED) return;
      if (gameInfo.gameMode != GameMode.CLASSIC && timer < gameInfo.roundTime) setTimer(timer + 1);
    }, 985);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, currentRound, gameInfo.gameMode, gameInfo.maxRounds, gameInfo.roundTime, toggleModal, gameInfo.gameStatus]);

  //GameStatus Update
  useEffect(() => {
    gamestat.current = gameInfo.gameStatus;
    if (gameInfo.gameStatus == GameStatus.WAITING) {
      setDelayNewRound(true);
      toggleModal('gameRoundConclusion');
    } else if (gameInfo.gameStatus == GameStatus.FINISHED) {
      toggleModal('gameConclusion');
    } else if (gameInfo.gameStatus == GameStatus.GUESSING && delayNewRound) {
      if (gameInfo.gameMode == GameMode.SONICFAST) setTimer(0);
      const timeout = setTimeout(() => {
        setDelayNewRound(false);
        clearGameScreen();
      }, 5000);
      return () => clearTimeout(timeout);
    } else {
      dispatch({type: 'modal/setState', payload: {isOpen: false}});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameInfo.gameStatus]);

  const [submitGuess, {loading}] = useMutation<GameRoundModel>(SUBMIT_GUESS, {
    variables: {
      word: currentlyTypingWord
    },
    async onCompleted(data) {
      if (data?.submitGuess) {
        if (data.submitGuess.words[amountGuesses] == currentlyTypingWord) {
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
            } else if (row[i] === LetterState.INWORD && !inWord.includes(letter) && !corr.includes(letter)) inWord += letter;
            else if (row[i] === LetterState.WRONG && !wrong.includes(letter)) wrong += letter;
          }
          setLetterOnCorrectPosition(corr);
          setLetterInWord(inWord);
          setLetterNotInWord(wrong);
          setCurrentlyTypingWord('');
          setAmountGuesses(amountGuesses < 6 ? amountGuesses + 1: amountGuesses);
          if (data.submitGuess.guessed || amountGuesses >= 5) {
            if (gameInfo.gameMode == GameMode.WORDSPP) {
              setTimer(timer + 0.95);
              toggleModal('gameRoundConclusion');
              setTimeout(() => {
                clearGameScreen();
              }, 5000);
            }
          }
        } else setShake(true);
      }
    }
  });

  const opponentGameRoundData = useSubscription<OpponentGameRoundModel>(OPPONENT_GAME_ROUND, {
    skip: gameInfo.gameStatus == GameStatus.NEW || gameInfo.gameStatus == GameStatus.SYNCING
  });

  const onChar = (value: string) => {if (!loading && currentlyTypingWord.length < 5 && amountGuesses < 6) setCurrentlyTypingWord(currentlyTypingWord + value);};
  const onDelete = () => {if (!loading && currentlyTypingWord.length > 0 && amountGuesses < 6) setCurrentlyTypingWord(currentlyTypingWord.substring(0, currentlyTypingWord.length - 1));};
  const onEnter = () => {!loading && currentlyTypingWord.length === 5 && amountGuesses < 6 ? submitGuess() : setShake(true);};

  return (
    gameInfo.gameStatus == GameStatus.SYNCING ? <LoaderCenterer><DotWave size={50} speed={1} color='#eee' /></LoaderCenterer> :
      <Box sx={{width: smallScreen ? '100%' : '90%', mx:'auto', mt: '2.5%', textAlign: 'center'}}>
        {gameInfo.gameMode != GameMode.CLASSIC && 
            <Box sx={{display: 'inline-block', width: smallScreen ? '90%' : '100%', mb: '15px'}}>
              <Typography variant="h3" sx={{fontSize: '24px', float: smallScreen ? 'none' : 'left'}}>Round: {currentRound}</Typography>
              <Box sx={{width: smallScreen ? '100%' : '70%', float: smallScreen ? 'none' : 'right', mt: smallScreen ? '15px' : 'auto'}}>
                <Typography variant="h3" sx={{fontSize: '24px' }}>Time: {gameInfo.roundTime - Math.floor(timer)} seconds</Typography>
                <LinearProgress variant="determinate" value={timer / gameInfo.roundTime * 100} sx={{width: '100%', height: '10px', borderRadius: '15px'}} />
              </Box>
            </Box>
        }
        <Box
          sx={{
            width: (gameInfo.gameStatus == GameStatus.WAITING || smallScreen) ? '100%' : '50%',
            mx: 'auto',
            mt: '2.5%',
            textAlign: 'center',
            display: 'inline-block'
          }}
        >
          <Snackbar anchorOrigin={{ horizontal: 'center', vertical: 'top' }} open={shake} autoHideDuration={2000} onClose={() =>setShake(false)}>
            <Alert variant="filled" severity="error">Invalid word</Alert>
          </Snackbar>
          <Suspense fallback={<LoaderCenterer><Orbit size={35} color={theme.additional.UiBallLoader.colors.main} /></LoaderCenterer>}>
            <Grid
              currentRow={amountGuesses}
              allGuesses={guessHistory}
              currentWord={currentlyTypingWord}
              allLetterStates={letterState}
              shake={shake}
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
          <Box sx={{
            width: (gameInfo.gameStatus == GameStatus.WAITING || smallScreen) ? '100%' : '40%',
            mt: gameInfo.gameStatus == GameStatus.WAITING ? '35px' : 'auto',
            mr: (gameInfo.gameStatus == GameStatus.WAITING || smallScreen) ? 'auto' : '5%',
            float: 'right',
            textAlign: 'center'
          }}>
            {opponentGameRoundData.data.opponentGameRound.map((round, i) => (
              <Box key={round.player.name+i} sx={{display: 'inline-block', mb: '5%', mx: '2.5%',}}>
                <Typography variant={'h2'} sx={{fontSize: '24px', textAlign: 'center'}}>{round.player.name} - Round {round.currentRound + 1}</Typography>
                <Grid allLetterStates={round.letterStates} allGuesses={['', '', '', '', '', '']}/>
              </Box>
            ))}
          </Box>
        }
      </Box>
  );
};

export default Game;