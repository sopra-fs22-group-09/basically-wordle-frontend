import { InputMaybe, Maybe, Scalars } from '.';
import { Player } from './Player';
import { Game } from './Game';

export interface LobbyModels {
  joinLobbyById: Lobby
  lobby: Lobby
  updateLobbySettings: Lobby
  getLobbies: Array<Lobby>
  lobbyList: Array<Lobby>
}

export type LobbyOverview = {
  __typename?: 'LobbyOverview';
  id: Scalars['ID'];
  name: Scalars['String'];
  status: LobbyStatus;
  category: GameCategory;
  mode: GameMode;
  players: Scalars['String'];
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
  categories: Array<string>;
  game: Game;
  players: Array<Player>;
};

export type MutationJoinLobbyByIdArgs = {
  id: Scalars['ID'];
};

export type SubscriptionLobbyArgs = {
  id: Scalars['ID'];
}

export type MutationUpdateLobbySettingsArgs = {
  input: GameSettingsInput;
};

export type MutationInviteToLobbyArgs = {
  input: LobbyInviteInput;
};

export type GameSettingsInput = {
  gameMode: GameMode;
  amountRounds: Scalars['Int'];
  roundTime: Scalars['Int'];
  categories: string[];
};

export type LobbyInviteInput = {
  recipientId?: InputMaybe<Scalars['ID']>;
  lobbyId: Scalars['ID'];
};

export enum GameCategory {
  PVP = 'PvP',
  SOLO = 'SOLO',
}

export enum GameMode {
  WORDSPP = 'Words++',
  SONICFAST = 'Sonic Fast',
  CLASSIC = 'Classic',
}

export enum LobbyStatus {
  OPEN = 'Open',
  FULL = 'Full',
  INGAME = 'InGame'
}

export const GameCategorization = new Map<GameMode, GameCategory>([
  [GameMode.WORDSPP, GameCategory.PVP],
  [GameMode.SONICFAST, GameCategory.PVP],
  [GameMode.CLASSIC, GameCategory.SOLO],
]);

export const GameModeDescription = new Map<GameMode, string>([
  [GameMode.WORDSPP, 'Words++: Each player guesses as many words as possible in the given time. The game is over when the time is up.'],
  [GameMode.SONICFAST, 'Sonic Fast: The goal is to find the target word of the current round the fastest. When everyone has guessed his word or the time is up, the next round starts.'],
  [GameMode.CLASSIC, 'Classic: The original. Find the target word within six guesses.'],
]);

export const GameCategoryMaxSize = new Map<GameCategory, number>([
  [GameCategory.PVP, 6],
  [GameCategory.SOLO, 1],
]);

export const WordCategories = [
  'Technology',
  'Animals',
  'Sports',
  'Emotions',
  'Business'
];

export type LobbyInvite = {
  __typename?: 'LobbyInvite';
  id?: Maybe<Scalars['ID']>;
  lobbyId: Scalars['ID'];
  senderId?: Maybe<Scalars['ID']>;
  recipientId?: Maybe<Scalars['ID']>;
};