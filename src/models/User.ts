export class User {
  constructor(
    public id: string,
    public username: string,
    public avatarID: string,
    //TODO: settings? as own model or part here?
    public creationDate: Date,
    public status: 'Online' | 'Creating Lobby' | 'InGame' | 'Away' | 'Offline'
  ) {}
}
