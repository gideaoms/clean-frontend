import { type } from 'arktype';
import { User } from '../../core/model/user.ts';
import type { UserRepository } from '../../core/repository/user.ts';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const userSchema = type({
  id: 'string',
  name: 'string',
  email: 'string',
});

const credentialsSchema = userSchema.and({
  password: 'string',
});

function toUser(data: typeof userSchema.infer): User {
  return new User({
    id: data.id,
    name: data.name,
    email: data.email,
  });
}

export class UserRepositoryImpl implements UserRepository {
  async findMany(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    const users = userSchema.array()(data);
    if (users instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return users.map(toUser);
  }

  async signIn(email: string, password: string): Promise<User> {
    const response = await fetch(
      `${API_URL}/users?email=${encodeURIComponent(email)}`,
    );
    if (!response.ok) {
      throw new Error('Failed to sign in');
    }
    const data = await response.json();
    const users = credentialsSchema.array()(data);
    if (users instanceof type.errors) {
      throw new Error('Invalid data');
    }
    const found = users.find(
      (it) => it.email === email && it.password === password,
    );
    if (!found) {
      throw new Error('Email and/or password incorrect');
    }
    return toUser(found);
  }
}
