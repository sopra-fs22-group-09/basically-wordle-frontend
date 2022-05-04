import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Keyboard from '../components/keyboard/keyboard';
import Grid from '../components/grid/grid';
import { LobbyStatus } from '../models/Lobby';
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import { GameRoundModel,
  GameStatsModel,
  GameStatus,
  LetterState,
  OpponentGameRoundModel,
} from '../models/Game';

interface GameInformation {
  name: string
  setStatus: (status: LobbyStatus) => void
  gameStatus?: GameStatus
  startGame: () => void
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

  useEffect(() => {
    gameInfo.startGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);  // Please don't touch!!

  const [submitGuess] = useMutation<GameRoundModel>(SUBMIT_GUESS, {
    variables: {
      word: currentWord
    },
    onCompleted(data) {
      if (data?.submitGuess) {
        //console.log(data.submitGuess.targetWord);
        //setWords(data.submitGuess.words);
        // TODO Just a temporary fix since the broken backend:
        //  The backend returns null when submitting the last guess and there are still rounds left
        //  Remove "? data.submitGuess.letterStates : letterState" once backend is fixed
        setLetterState(data.submitGuess.letterStates ? data.submitGuess.letterStates : letterState);

        let corr = letterOnCorrectPosition;
        let inWord = letterInWord;
        let wrong = letterNotInWord;
        const row = data.submitGuess.letterStates[currentGuess];

        for (let i = 0; i < row.length; ++i) {
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
        //console.log(row);
        for (const letterState of row) {
          //console.log(letterState);
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

  //TODO Write hooks to initialize an empty state and show this state. then, use useeffect to update the hooks.
  const opponentGameRoundData = useSubscription<OpponentGameRoundModel>(OPPONENT_GAME_ROUND, {
    onSubscriptionData: a => console.log(a.subscriptionData)
  });

  function ConcludeGame() {
    const concludeGameData = useQuery<GameStatsModel>(CONCLUDE_GAME, {
      onCompleted(data) {
        //gameInfo.setStatus(LobbyStatus.OPEN);
        console.log('ja');
      }
    });
  }

  const onChar = (value: string) => {if (currentWord.length < 5 && currentGuess <= 6) setCurrentWord(currentWord + value.toLowerCase());};
  const onDelete = () => {if (currentWord.length > 0 && currentGuess <= 6) setCurrentWord(currentWord.substring(0, currentWord.length - 1));};
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
    <>
      {(gameInfo.gameStatus == GameStatus.SYNCING) && 
        <Box sx={{
          width:'100%',
          mx: 'auto',
          mt:'2.5%',
          textAlign: 'center'
        }}>
          <Typography variant='h2'>Loading ...</Typography>
        </Box>
      }
      {(gameInfo.gameStatus == GameStatus.GUESSING) &&
        <>
          <Box sx={{
            width: '60%',
            mx: 'auto',
            mt: '2.5%',
            textAlign: 'center',
            float: 'left'
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
          {/*Opponents grid, TODO: l. 118: do that and it will work.*/}
          <Box sx={{width: '30%', mt: '2.5%', mr: '5%', float: 'right' }}>
            {opponentGameRoundData.data?.opponentGameRound.map((round) => (
              <>
                <Box style={{height: '19vh'}}>
                  <Typography variant={'h2'} sx={{fontSize: '32px', textAlign: 'center'}}>{round.player.name} -
                      Round {round.currentRound}</Typography>
                  <Grid
                    allLetterStates={round.letterStates}
                    allGuesses={['', '', '', '', '', '']}
                    style={{height: '100%'}}/>
                </Box>
                <br style={{clear: 'both'}}/>
              </>
            ))}
          </Box>
        </>
      }
    </>  
  );
};

export default Game;