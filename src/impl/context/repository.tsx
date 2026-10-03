import { createContext, useContext, type ReactNode } from 'react';
import type { PostRepository } from '../../core/repository/post.ts';
import type { UserRepository } from '../../core/repository/user.ts';
import { PostRepositoryImpl } from '../repository/post.ts';
import { UserRepositoryImpl } from '../repository/user.ts';

type Repositories = {
  post: PostRepository
  user: UserRepository
}

const Context = createContext<Repositories | null>(null);
const post = new PostRepositoryImpl();
const user = new UserRepositoryImpl();

export function RepositoryProvider(props: { children: ReactNode }) {
  return (
    <Context.Provider value={{ post, user }}>
      {props.children}
    </Context.Provider>
  );
}

export function useRepository() {
  const repository = useContext(Context);
  if (!repository) {
    throw new Error('Repository Context must be provided');
  }
  return repository;
}
