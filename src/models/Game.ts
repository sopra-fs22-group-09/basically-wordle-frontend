import { Scalars } from './index';

export interface GameModels {
  startGame: Game
}

export type Game = {
  __typename?: 'Game';
  amountRounds: Scalars['Int'];
  roundTime: Scalars['Int'];
};