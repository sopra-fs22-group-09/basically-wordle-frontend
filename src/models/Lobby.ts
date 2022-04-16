import { User } from './User';

export type Maybe<T> = T | null;

export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // Date: any;
};

export type Lobby = {
  __typename?: 'Lobby';
  id: Scalars['ID'];
  status: LobbyStatus;
  owner: User;
  size: Scalars['Int'];
  name: Scalars['String'];
  gameCategory: GameCategory;
  gameSettings: GameSettings;
  players: Array<User>;
};

export type GameSettings = {
  __typename?: 'GameSettings';
  gameMode: GameMode;
  amountRounds: Scalars['Int'];
  roundTime: Scalars['Int'];
};

export type Message = {
  __typename?: 'Message';
  userId?: Maybe<Scalars['ID']>;
  message?: Maybe<Scalars['String']>;
};

export type GameSettingsInput = {
  gameMode: GameMode;
  amountRounds: Scalars['Int'];
  roundTime: Scalars['Int'];
};

export type MutationJoinLobbyByIdArgs = {
  id: Scalars['ID'];
};



export type MutationUpdateLobbySettingsArgs = {
  gameSettings: GameSettingsInput;
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

export const DefaultModePerCategory = new Map<GameCategory, GameMode>([
  [GameCategory.PVP, GameMode.WORDSPP],
  [GameCategory.SOLO, GameMode.CLASSIC],
  [GameCategory.COOP, GameMode.ONEWORD]
]);