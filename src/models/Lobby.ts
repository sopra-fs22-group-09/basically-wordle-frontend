import { Maybe, Scalars } from '.';
import { User } from './User';

export interface LobbyModels {
  joinLobbyById: Lobby
  lobby: Lobby
  updateLobbySettings: Lobby
}

export type Lobby = {
  __typename?: 'Lobby';
  id: Scalars['ID'];
  status: LobbyStatus;
  owner: User;
  size: Scalars['Int'];
  name: Scalars['String'];
  gameCategory: GameCategory;
  gameMode: GameMode;
  game: Game;
  players: Array<User>;
};

export type Game = {
  __typename?: 'Game';
  amountRounds: Scalars['Int'];
  roundTime: Scalars['Int'];
};

export type Message = {
  __typename?: 'Message';
  userId?: Maybe<Scalars['ID']>;
  message?: Maybe<Scalars['String']>;
};

export type MutationJoinLobbyByIdArgs = {
  id: Scalars['ID'];
};

export type SubscriptionLobbyArgs = {
  id: Scalars['ID'];
}

export type MutationUpdateLobbySettingsArgs = {
  id: Scalars['ID'];
  gameSettings: GameSettingsInput;
};

export type GameSettingsInput = {
  gameMode: GameMode;
  amountRounds: Scalars['Int'];
  roundTime: Scalars['Int'];
};

export enum GameCategory {
  PVP = 'PvP',
  SOLO = 'SOLO',
  COOP = 'CO-OP'
}

export enum GameMode {
  WORDSPP = 'Words++',
  SONICFAST = 'Sonic Fast',
  TIMERESET = 'Time Reset',
  PARTY = 'Party',
  CHALLENGE = 'Challenge',
  CHAIN = 'Chain',
  CLASSIC = 'Classic',
  INTIME = 'In Time',
  PLAYERVSAI = 'Player vs AI',
  ONEWORD = 'OneWord',
  WORDCOMBINATION = 'WordCombination'
}

export enum LobbyStatus {
  OPEN = 'Open',
  FULL = 'Full',
  INGAME = 'InGame'
}

export const GameCategorization = new Map<GameMode, GameCategory>([
  [GameMode.WORDSPP, GameCategory.PVP],
  [GameMode.SONICFAST, GameCategory.PVP],
  [GameMode.TIMERESET, GameCategory.PVP],
  [GameMode.PARTY, GameCategory.PVP],
  [GameMode.CHALLENGE, GameCategory.PVP],
  [GameMode.CHAIN, GameCategory.PVP],
  [GameMode.CLASSIC, GameCategory.SOLO],
  [GameMode.INTIME, GameCategory.SOLO],
  [GameMode.PLAYERVSAI, GameCategory.SOLO],
  [GameMode.ONEWORD, GameCategory.COOP],
  [GameMode.WORDCOMBINATION, GameCategory.COOP]
]);

export const GameCategoryMaxSize = new Map<GameCategory, number>([
  [GameCategory.PVP, 6],
  [GameCategory.SOLO, 1],
  [GameCategory.COOP, 4]
]);

//TODO: Get default categories ??
export const WordCategories = [
  { category: 'dogs' },
  { category: 'cats' },
  { category: 'cows' },
  { category: 'dunno' }
];