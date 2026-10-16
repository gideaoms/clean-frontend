import { createContext, type ReactNode, useContext } from 'react';
import type { CommentRepository } from '../../core/repository/comment.ts';
import type { PostRepository } from '../../core/repository/post.ts';
import type { UserRepository } from '../../core/repository/user.ts';
import { CommentRepositoryImpl } from '../repository/comment.ts';
import { PostRepositoryImpl } from '../repository/post.ts';
import { UserRepositoryImpl } from '../repository/user.ts';

type Repositories = {
  post: PostRepository;
  user: UserRepository;
  comment: CommentRepository;
};

const Context = createContext<Repositories | null>(null);
const post = new PostRepositoryImpl();
const user = new UserRepositoryImpl();
const comment = new CommentRepositoryImpl();

export function RepositoryProvider(props: { children: ReactNode }) {
  return <Context value={{ post, user, comment }}>{props.children}</Context>;
}

export function useRepository() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('Repository Context must be provided');
  }
  return context;
}
