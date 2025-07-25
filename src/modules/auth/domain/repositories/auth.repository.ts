import { User } from '../../../user/domain/entities/user.entity';

export interface AuthRepository {
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;
  findUserByEmailWithPassword(email: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  saveRefreshToken(userId: string, refreshToken: string): Promise<void>;
  isRefreshTokenValid(userId: string, refreshToken: string): Promise<boolean>;
}
