import { Scalars } from './index';
import { Player } from './Player';

//currently unused
export interface GameModel {
  startGame: Game
}

export interface GameRoundModel {
  submitGuess: GameRound
}

export interface GameStatsModel {
  concludeGame: GameStats
}

export interface GameStatusModel {
  gameStatus: GameStatus
}

export interface OpponentGameRoundModel {
  opponentGameRound: Array<GameRound>
}

export type Game = {
  __typename?: 'Game';
  amountRounds: Scalars['Int'];
  roundTime: Scalars['Int'];
  maxRounds: Scalars['Int'];
  maxTime: Scalars['Int'];
};

export type GameRound = {
  __typename?: 'GameRound';
  player: Player;
  currentRound: Scalars['Int'];
  targetWord: Scalars['String'];
  guessed: Scalars['Boolean'];
  words: Array<Scalars['String']>;
  letterStates: Array<Array<LetterState>>;
};

export type GameStats = {
  __typename?: 'GameStats';
  targetWord: Scalars['String'];
  roundsTaken: Scalars['Int'];
  timeTaken: number;
  score: Scalars['Int'];
  rank: Scalars['Int'];
};

export enum GameStatus {
  NEW = 'NEW',
  SYNCING = 'SYNCING',
  GUESSING = 'GUESSING',
  WAITING = 'WAITING',
  FINISHED = 'FINISHED'
}

export enum PlayerStatus {
  SYNCING = 'Syncing',
  GUESSING = 'Guessing',
  WAITING = 'Waiting',
}

export enum LetterState {
  CORRECTPOSITION = 'CORRECTPOSITION',
  INWORD = 'INWORD',
  WRONG = 'WRONG',
  UNKNOWN = 'UNKNOWN',
}