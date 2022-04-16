export class User {
  constructor(
    public id: string,
    public username: string,
    public avatarID: string,
    //TODO: settings? as own model or part here?
    public creationDate: Date,
    public status: UserStatus
  ) {}
}

export enum UserStatus {
  ONLINE = 'Online',
  CREATINGLOBBY = 'Creating Lobby',
  INGAME = 'InGame',
  AWAY = 'Away',
  OFFLINE = 'Offline'
}