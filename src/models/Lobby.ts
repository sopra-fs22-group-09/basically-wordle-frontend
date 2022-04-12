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
  name?: Maybe<Scalars['String']>;
  gameCategory?: Maybe<GameCategory>;
  gameMode?: Maybe<GameMode>;
};

export enum GameCategory {
  PvP = 'PvP',
  Coop = 'COOP',
  Solo = 'SOLO'
}

export enum GameMode {
  WordsPp = 'Words_PP',
  SonicFast = 'SonicFast',
  TimeReset = 'TimeReset',
  Party = 'Party',
  Challenge = 'Challenge',
  Chain = 'Chain',
  Classic = 'Classic',
  InTime = 'InTime',
  PlayerVsAi = 'PlayerVsAI',
  OneWord = 'OneWord',
  WordCombination = 'WordCombination'
}

export enum LobbyStatus {
  Open = 'OPEN',
  Full = 'FULL',
  Ingame = 'INGAME'
}

export type GameSettings = {
  __typename?: 'GameSettings';
  wordLength?: Maybe<Scalars['Int']>;
};