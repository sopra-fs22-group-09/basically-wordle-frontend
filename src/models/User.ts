export class User {
  constructor(
    public id: string,
    public username: string,
    public token: string,
    public creationDate: Date,
    public status: 'online' | 'offline' | 'creating lobby'
  ) {}
}
