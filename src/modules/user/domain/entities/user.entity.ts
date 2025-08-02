export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly password?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly refreshToken?: string,
  ) {}

  static create(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ): User {
    const now = new Date();
    const id = crypto.randomUUID();

    return new User(id, email, firstName, lastName, password, now, now);
  }

  updateName(firstName: string, lastName: string): User {
    return new User(
      this.id,
      this.email,
      firstName,
      lastName,
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
      this.firstName,
      this.lastName,
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
      this.firstName,
      this.lastName,
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
      this.firstName,
      this.lastName,
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
    firstName: string;
    lastName: string;
    createdAt?: Date;
    updatedAt?: Date;
  } {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
