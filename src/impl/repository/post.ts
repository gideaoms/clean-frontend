import { type } from 'arktype';
import { Post } from '../../core/model/post.ts';
import { User } from '../../core/model/user.ts';
import type { PostRepository } from '../../core/repository/post.ts';
import { sleep } from '../../util/sleep.ts';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const userSchema = type({
  id: 'string',
  name: 'string',
  email: 'string',
});

const postSchema = type({
  id: 'string',
  title: 'string',
  body: 'string',
  status: "'draft' | 'published' | 'archived'",
  author: userSchema,
  'reviewer?': userSchema,
});

function toPost(data: typeof postSchema.infer): Post {
  return new Post({
    ...data,
    author: new User(data.author),
    reviewer: data.reviewer && new User(data.reviewer),
  });
}

export class PostRepositoryImpl implements PostRepository {
  async findMany(): Promise<Post[]> {
    await sleep(1000);
    const response = await fetch(`${API_URL}/posts`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const data = await response.json();
    const posts = postSchema.array()(data);
    if (posts instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return posts.map(toPost);
  }

  async findOne(id: string): Promise<Post> {
    await sleep(1000);
    const response = await fetch(`${API_URL}/posts/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    const data = await response.json();
    const post = postSchema(data);
    if (post instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return toPost(post);
  }

  async create(post: Post): Promise<Post> {
    await sleep(1000);
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });
    if (!response.ok) {
      throw new Error('Failed to create post');
    }
    const data = await response.json();
    const createdPost = postSchema(data);
    if (createdPost instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return toPost(createdPost);
  }

  async update(post: Post): Promise<Post> {
    await sleep(1000);
    const response = await fetch(`${API_URL}/posts/${post.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });
    if (!response.ok) {
      throw new Error('Failed to update post');
    }
    const data = await response.json();
    const updatedPost = postSchema(data);
    if (updatedPost instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return toPost(updatedPost);
  }
}
