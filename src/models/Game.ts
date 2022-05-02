import { Scalars } from './index';
import { Player } from './Player';

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

export interface PlayerStatusModel {
  playerStatus: PlayerStatus
}

export interface OpponentGameRoundModel {
  gameRounds: Array<GameRound>
}

export type Game = {
  __typename?: 'Game';
  amountRounds: Scalars['Int'];
  roundTime: Scalars['Int'];
};

export type GameRound = {
  __typename?: 'GameRound';
  player: Player;
  currentRound: Scalars['Int'];
  targetWord: Scalars['String'];
  words: Array<Scalars['String']>;
  letterStates: Array<Array<LetterState>>;
};

export type GameStats = {
  __typename?: 'GameStats';
  targetWord: Scalars['String'];
  roundsTaken: Scalars['Int'];
  timeTaken: Scalars['String'];
  score: Scalars['Int'];
  rank: Scalars['Int'];
};

export enum GameStatus {
  PREPARING = 'Preparing',
  GUESSING = 'Guessing',
  WAITING = 'Waiting',
  FINISHED = 'Finished'
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