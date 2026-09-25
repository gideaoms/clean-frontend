import { type } from 'arktype';
import { Post } from '../../core/model/post.ts';
import { type PostRepository } from '../../core/repository/post.ts';

export class PostRepositoryImpl implements PostRepository {
  async findMany(): Promise<Post[]> {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const data = await response.json();
    const schema = type({
      id: 'number',
      title: 'string',
      body: 'string',
    }).array();
    const posts = schema(data);
    if (posts instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return posts.map((it) => new Post(it));
  }

  async create(post: Post): Promise<Post> {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
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
      id: 'number',
      title: 'string',
      body: 'string',
    });
    const createdPost = schema(data);
    if (createdPost instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return new Post(createdPost);
  }
}