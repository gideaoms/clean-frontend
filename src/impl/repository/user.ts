import { type } from 'arktype';
import { User } from '../../core/model/user.ts';
import type { UserRepository } from '../../core/repository/user.ts';
import { sleep } from '../../util/sleep.ts';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const schema = type({
  id: 'string',
  name: 'string',
  email: 'string',
});

function toUser(data: typeof schema.infer): User {
  return new User({
    id: data.id,
    name: data.name,
    email: data.email,
  });
}

export class UserRepositoryImpl implements UserRepository {
  async findMany(): Promise<User[]> {
    await sleep(1000);
    const response = await fetch(`${API_URL}/authors`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    const users = schema.array()(data);
    if (users instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return users.map(toUser);
  }

  async findOne(id: string): Promise<User> {
    await sleep(1000);
    const response = await fetch(`${API_URL}/authors/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    const data = await response.json();
    const user = schema(data);
    if (user instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return toUser(user);
  }

  async signIn(email: string, password: string): Promise<User> {
    await sleep(1000);
    const response = await fetch(
      `${API_URL}/authors?email=${encodeURIComponent(email)}`,
    );
    if (!response.ok) {
      throw new Error('Failed to sign in');
    }
    const data = await response.json();
    const users = schema.and({ password: 'string' }).array()(data);
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
