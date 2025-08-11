export class Favorite {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly productId: number,
    public readonly createdAt?: Date,
  ) {}

  static create(userId: string, productId: number): Favorite {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    return new Favorite(id, userId, productId, createdAt);
  }
}
