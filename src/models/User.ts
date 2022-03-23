export class User {
  constructor(
    private id: string,
    public username: string,
    public creationDate: Date,
    public status: 'online' | 'offline' | 'creating lobby'
  ) {}
}
