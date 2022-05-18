import * as React from 'react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Box, Typography, Button, useTheme } from '@mui/material';
import { DotWave, Orbit } from '@uiball/loaders';
import { GameMode, LobbyStatus, LeaveGameArgs } from '../models/Lobby';
import { gql, useLazyQuery, useMutation, useSubscription } from '@apollo/client';
import {
  GameRoundModel,
  GameStatsModel,
  GameStatus, GameStatusModel,
  LeaveType,
  LetterState,
  OpponentGameRoundModel, PlayAgainType,
} from '../models/Game';
import LoaderCenterer from '../components/loader';
import { useNavigate, useParams } from 'react-router-dom';
import GameRoundConclusion from '../modals/GameRoundConclusion';

interface GameInformation {
  name: string
  setStatus: (status: LobbyStatus) => void
  gameStatus?: GameStatus
  startGame: () => void
  ownerId: string
  setGameMode: (gameMode: GameMode) => void
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
      player {
        name
      }
      currentRound
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

const LEAVE_GAME = gql`
    mutation leaveGame($id: ID!) {
        leaveGame(id: $id)
    }
`;

const PLAY_AGAIN = gql`
    mutation playAgain {
        playAgain{
            amountRounds
            roundTime
        }
    }
`;

const Game = (gameInfo: GameInformation) => {
  const Grid = lazy(() => import('../components/grid/grid'));
  const Keyboard = lazy(() => import('../components/keyboard/keyboard'));

  const [stopwatch, setStopwatch] = useState(0);
  useEffect(() => {
    setTimeout(() => setStopwatch(stopwatch + 1), 1000);
  }, [stopwatch]);

  const theme = useTheme();
  const navigate = useNavigate();
  const params = useParams();

  // const [roundConclusion, setRoundConclusion] = React.useState<boolean>(false);
  // const [gameConclusion, setGameConclusion] = React.useState<boolean>(false);
  // const toggleRoundConclusionModal = () => {
  //   setRoundConclusion(!roundConclusion);
  // };
  // const toggleGameConclusionModal = () => {
  //   setGameConclusion(!gameConclusion);
  // };

  const [currentRound, setCurrentRound] = useState(1);

  // For keyboard
  const [letterOnCorrectPosition, setLetterOnCorrectPosition] = useState('');
  const [letterInWord, setLetterInWord] = useState('');
  const [letterNotInWord, setLetterNotInWord] = useState('');

  // For Grid
  const [currentlyTypingWord, setCurrentlyTypingWord] = useState('');
  const [amountGuesses, setAmountGuesses] = useState(0);
  const [guessHistory, setGuessHistory] = useState(['', '', '', '', '', '']);
  const [letterState, setLetterState] = useState<LetterState[][]>([[]]);
  const [open, setOpen] = React.useState<boolean>(true);
  const toggleModal = () => {
    setOpen(!open);
  };


  const [concludeGame, {data}] = useLazyQuery<GameStatsModel>(CONCLUDE_GAME, {
    onCompleted(data) {
      alert(data.concludeGame.score);
      //console.log('ja');
      gameInfo.setStatus(LobbyStatus.OPEN);
    },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (gameInfo.gameStatus == GameStatus.SYNCING || gameInfo.gameStatus == GameStatus.NEW) gameInfo.startGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Please don't touch!!
  
  useEffect(() => {
    if (gameInfo.gameStatus == GameStatus.FINISHED) concludeGame();
  }, [concludeGame, gameInfo.gameStatus]);

  const [leaveGame, leaveGameData] = useMutation<LeaveType, LeaveGameArgs>(LEAVE_GAME);

  const handleLeaveGame = () => {
    leaveGame({
      variables: {
        id: params.id as string
      },
      onCompleted() {
        navigate('/');
      }
    });
  };

  const [playAgain, playData] = useMutation<PlayAgainType>(PLAY_AGAIN);

  const handleRematch = () => {
    playAgain();
  };

  const [submitGuess, {loading}] = useMutation<GameRoundModel>(SUBMIT_GUESS, {
    variables: {
      word: currentlyTypingWord
    },
    onCompleted(data) {
      if (data?.submitGuess) {
        setCurrentRound(data.submitGuess.currentRound);

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


        // if (gameInfo.gameStatus == GameStatus.FINISHED) toggleGameConclusionModal();

        // if (amountGuesses >= 5) {
        //   toggleRoundConclusionModal();
        // }
        // let allRight = true;
        // //console.log(row);
        // for (const letterState of row) {
        //   //console.log(letterState);
        //   if (letterState != LetterState.CORRECTPOSITION) {
        //     allRight = false;
        //   }
        // }
        // if (allRight) {
        //   toggleRoundConclusionModal();
        // }
      }
    }
  });

  //TODO Write hooks to initialize an empty state and show this state. then, use useeffect to update the hooks.
  const opponentGameRoundData = useSubscription<OpponentGameRoundModel>(OPPONENT_GAME_ROUND, {
    //onSubscriptionData: a => console.log(a.subscriptionData)
  });

  const onChar = (value: string) => {if (!loading && currentlyTypingWord.length < 5 && amountGuesses <= 6) setCurrentlyTypingWord(currentlyTypingWord + value.toLowerCase());};
  const onDelete = () => {if (!loading && currentlyTypingWord.length > 0 && amountGuesses <= 6) setCurrentlyTypingWord(currentlyTypingWord.substring(0, currentlyTypingWord.length - 1));};
  const onEnter = () => {
    if (!loading && currentlyTypingWord.length === 5 && amountGuesses <= 6) {
      submitGuess().then(() => {
        setCurrentlyTypingWord('');
        setAmountGuesses(amountGuesses + 1);
      });
    }
  };

  //TODO: Still in production, big changes should come in the next weeks
  return (
    <>
      {gameInfo.gameStatus == GameStatus.FINISHED &&
          <>
            {localStorage.getItem('userId') == gameInfo.ownerId &&
                <GameRoundConclusion open={open} toggle={toggleModal} owner={true} handleRematch={handleRematch} data={data}/>
            }
            {localStorage.getItem('userId') != gameInfo.ownerId &&
                <GameRoundConclusion open={open} toggle={toggleModal} owner={false} handleRematch={handleRematch} data={data}/>
            }
          </>
      }

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
            <Typography variant={'h3'} sx={{fontSize: '24px', textAlign: 'left', display: 'inline-block'}}>Round: {currentRound}</Typography>
            {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
            <Typography variant={'h3'} sx={{fontSize: '24px', textAlign: 'right', display: 'inline-block', float: 'right'}}>Time: {stopwatch} seconds</Typography>
            {gameInfo.gameStatus == GameStatus.WAITING && <Typography variant={'h2'} sx={{fontSize: '32px', textAlign: 'center'}}>Waiting for other players to finish...</Typography>}
          </Box>
          <Box  sx={{
            width: gameInfo.gameStatus == GameStatus.WAITING ? '100%' : '60%',
            mx: 'auto',
            mt: '2.5%',
            textAlign: 'center',
            //float: gameInfo.gameStatus == GameStatus.GUESSING ? 'left' : 'none'
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
            <br style={{clear: 'both'}} />
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
          <Box sx={{width: gameInfo.gameStatus == GameStatus.WAITING ? '100%' : '30%', mt: '2.5%', mr: '5%', display: 'inline-block', textAlign: 'center'}}>
            <Button
              variant="contained"
              onClick={handleLeaveGame}
              sx={{
                display: 'block', // Margin does not apply without this line
                mx: 'auto',
                mb: '2.5%'
              }}
            >
                  Leave game
            </Button>
            {opponentGameRoundData.data?.opponentGameRound.map((round, i) => (
              <React.Fragment key={i}>
                <Box sx={{height: '19vh', display: gameInfo.gameStatus == GameStatus.WAITING ? 'inline-block' : 'block'}}>
                  <Typography variant={'h2'} sx={{fontSize: '32px', textAlign: 'center'}}>{round.player.name} -
                      Round {round.currentRound}</Typography>
                  <Grid
                    allLetterStates={round.letterStates}
                    allGuesses={['', '', '', '', '', '']}
                    style={{height: '100%'}}/>
                </Box>
                {gameInfo.gameStatus == GameStatus.GUESSING && <br style={{clear: 'both'}}/>}
              </React.Fragment>
            ))}
          </Box>
        </>
      }
    </>
  );
};

export default Game;
