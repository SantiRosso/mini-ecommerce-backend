export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly password?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly refreshToken?: string,
  ) {}

  static create(email: string, name: string, password: string): User {
    const now = new Date();
    const id = crypto.randomUUID();

    return new User(id, email, name, password, now, now);
  }

  updateName(newName: string): User {
    return new User(
      this.id,
      this.email,
      newName,
      this.password,
      this.createdAt,
      new Date(),
      this.refreshToken,
    );
  }

  updateEmail(newEmail: string): User {
    return new User(
      this.id,
      newEmail,
      this.name,
      this.password,
      this.createdAt,
      new Date(),
      this.refreshToken,
    );
  }

  updatePassword(newPassword: string): User {
    return new User(
      this.id,
      this.email,
      this.name,
      newPassword,
      this.createdAt,
      new Date(),
      this.refreshToken,
    );
  }

  updateRefreshToken(newRefreshToken?: string): User {
    return new User(
      this.id,
      this.email,
      this.name,
      this.password,
      this.createdAt,
      new Date(),
      newRefreshToken,
    );
  }

  // Para el login, retorna usuario sin password
  toPublic(): {
    id: string;
    email: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
  } {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
