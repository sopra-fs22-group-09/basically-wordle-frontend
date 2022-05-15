import { Scalars } from './index';
import { Player } from './Player';
import { GameCategory, GameMode, LobbyStatus } from './Lobby';

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

export interface LeaveType {
  left: boolean
}

export interface PlayAgainType {
  playAgain: Game
}

export interface OpponentGameRoundModel {
  opponentGameRound: Array<GameRound>
}

export interface LobbyModels {
  joinLobbyById: Lobby
  lobby: Lobby
  updateLobbySettings: Lobby
}

export type LeaveGameArgs = {
  id: Scalars['ID'];
};

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

export type Lobby = {
  __typename?: 'Lobby';
  id: Scalars['ID'];
  status: LobbyStatus;
  owner: Player;
  size: Scalars['Int'];
  name: Scalars['String'];
  gameCategory: GameCategory;
  gameMode: GameMode;
  game: Game;
  players: Array<Player>;
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