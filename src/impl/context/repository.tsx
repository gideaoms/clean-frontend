import { createContext, useContext, type ReactNode } from 'react';
import type { PostRepository } from '../../core/repository/post.ts';
import { PostRepositoryImpl } from '../repository/post.ts';

type Repositories = {
  postRepository: PostRepository
} 

const Context = createContext<Repositories | null>(null);
const postRepository = new PostRepositoryImpl();

export function RepositoryProvider(props: { children: ReactNode }) {
  return (
    <Context.Provider value={{ postRepository }}>
      {props.children}
    </Context.Provider>
  );
}

export function useRepositories() {
  const repositories = useContext(Context);
  if (!repositories) {
    throw new Error('Repositories must be provided');
  }
  return repositories;
}