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
  lobbyMembers: Array<Maybe<Scalars['ID']>>;
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

export type QueryJoinLobbyByIdArgs = {
  id: Scalars['Int'];
};

export type MutationCreateLobbyArgs = {
  input: LobbyInput;
};

export type MutationUpdateLobbySettingsArgs = {
  gameSettings: GameSettingsInput;
};

export type LobbyInput = {
  size: Scalars['Int'];
  name: Scalars['String'];
  gameCategory: GameCategory;
};

export enum GameCategory {
  PvP = 'PVP',
  Coop = 'COOP',
  Solo = 'SOLO'
}

export enum GameMode {
  Wordspp = 'WORDSPP',
  Sonicfast = 'SONICFAST',
  Timereset = 'TIMERESET',
  Party = 'PARTY',
  Challenge = 'CHALLENGE',
  Chain = 'CHAIN',
  Classic = 'CLASSIC',
  Intime = 'INTIME',
  Playervsai = 'PLAYERVSAI',
  Oneword = 'ONEWORD',
  Wordcombination = 'WORDCOMBINATION'
}

export enum LobbyStatus {
  Open = 'OPEN',
  Full = 'FULL',
  Ingame = 'INGAME'
}