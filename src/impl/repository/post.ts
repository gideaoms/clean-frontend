import { type } from 'arktype';
import { Post } from '../../core/model/post.ts';
import { type PostRepository } from '../../core/repository/post.ts';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export class PostRepositoryImpl implements PostRepository {
  async findMany(): Promise<Post[]> {
    const response = await fetch(`${API_URL}/posts`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const data = await response.json();
    const schema = type({
      id: 'string',
      title: 'string',
      body: 'string',
    }).array();
    const posts = schema(data);
    if (posts instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return posts.map((it) => new Post(it));
  }

  async findOne(id: string): Promise<Post> {
    const response = await fetch(`${API_URL}/posts/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    const data = await response.json();
    const schema = type({
      id: 'string',
      title: 'string',
      body: 'string',
    });
    const post = schema(data);
    if (post instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return new Post(post);
  }

  async create(post: Post): Promise<Post> {
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
    const schema = type({
      id: 'string',
      title: 'string',
      body: 'string',
    });
    const createdPost = schema(data);
    if (createdPost instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return new Post(createdPost);
  }

  async update(post: Post): Promise<Post> {
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
    const schema = type({
      id: 'string',
      title: 'string',
      body: 'string',
    });
    const updatedPost = schema(data);
    if (updatedPost instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return new Post(updatedPost);
  }
}