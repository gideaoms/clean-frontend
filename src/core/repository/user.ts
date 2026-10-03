import type { User } from '../model/user.ts';

export interface UserRepository {
  findMany(): Promise<User[]>;
  signIn(email: string, password: string): Promise<User>;
}
