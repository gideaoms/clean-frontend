import type { Post } from '../model/post.ts';

export interface PostRepository {
  findMany(): Promise<Post[]>;
  findOne(id: number): Promise<Post>;
  create(post: Post): Promise<Post>;
  update(post: Post): Promise<Post>;
}