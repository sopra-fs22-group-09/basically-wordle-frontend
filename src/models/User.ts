export class User {
  constructor(
    public id: string,
    public username: string,
    public avatarID: string,
    public token: string,
    //TODO: bruchts glaub eher im backend ..
    public creationDate: Date,
    public status: 'Online' | 'Creating Lobby' | 'InGame' | 'Away' | 'Offline'
  ) {}
}
