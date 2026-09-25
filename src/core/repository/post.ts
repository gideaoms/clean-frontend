import type { Post } from '../model/post.ts';

export interface PostRepository {
  findMany(): Promise<Post[]>;
  create(post: Post): Promise<Post>;
}