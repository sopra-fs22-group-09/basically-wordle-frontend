import { Scalars } from '.';

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  username: Scalars['String'];
  avatarId: Scalars['String'];
  //creationDate: Date;
  status: UserStatus;
};

export enum UserStatus {
  ONLINE = 'Online',
  CREATINGLOBBY = 'Creating Lobby',
  INGAME = 'InGame',
  AWAY = 'Away',
  OFFLINE = 'Offline'
}