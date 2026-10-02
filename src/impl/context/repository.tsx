import { createContext, useContext, type ReactNode } from 'react';
import type { PostRepository } from '../../core/repository/post.ts';
import { PostRepositoryImpl } from '../repository/post.ts';

type Repositories = {
  post: PostRepository
}

const Context = createContext<Repositories | null>(null);
const post = new PostRepositoryImpl();

export function RepositoryProvider(props: { children: ReactNode }) {
  return (
    <Context.Provider value={{ post }}>
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