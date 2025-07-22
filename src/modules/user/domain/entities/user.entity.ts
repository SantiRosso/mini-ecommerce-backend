export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(email: string, name: string): User {
    const now = new Date();
    const id = crypto.randomUUID();

    return new User(id, email, name, now, now);
  }

  updateName(newName: string): User {
    return new User(this.id, this.email, newName, this.createdAt, new Date());
  }

  updateEmail(newEmail: string): User {
    return new User(this.id, newEmail, this.name, this.createdAt, new Date());
  }
}
