import { type } from 'arktype';
import { Post } from '../../core/model/post.ts';
import type { PostRepository } from '../../core/repository/post.ts';
import { sleep } from '../../util/sleep.ts';
import { User } from '../../core/model/user.ts';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const schema = type({
  id: 'string',
  title: 'string',
  body: 'string',
  status: "'draft' | 'published' | 'archived'",
  authorId: 'string',
  'reviewerId?': 'string',
});

export class PostRepositoryImpl implements PostRepository {
  async findMany(): Promise<Post[]> {
    await sleep(1000);
    const response = await fetch(`${API_URL}/posts?_embed=author`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const data = await response.json();
    const posts = type({
      id: 'string',
      title: 'string',
      body: 'string',
      status: "'draft' | 'published' | 'archived'",
      authorId: 'string',
      author: {
        id: 'string',
        name: 'string',
        email: 'string',
      },
      'reviewerId?': 'string',
    }).array()(data);
    if (posts instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return posts.map((it) => {
      return new Post({
        id: it.id,
        title: it.title,
        body: it.body,
        status: it.status,
        authorId: it.authorId,
        reviewerId: it.reviewerId,
        author: new User({
          id: it.author.id,
          name: it.author.name,
          email: it.author.email,
        }),
      });
    });
  }

  async findOne(id: string): Promise<Post> {
    await sleep(1000);
    const response = await fetch(`${API_URL}/posts/${id}?_embed=author`);
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    const data = await response.json();
    const post = type({
      id: 'string',
      title: 'string',
      body: 'string',
      status: "'draft' | 'published' | 'archived'",
      authorId: 'string',
      author: {
        id: 'string',
        name: 'string',
        email: 'string',
      },
      'reviewerId?': 'string',
    })(data);
    if (post instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return new Post({
      id: post.id,
      title: post.title,
      body: post.body,
      status: post.status,
      authorId: post.authorId,
      reviewerId: post.reviewerId,
      author: new User({
        id: post.author.id,
        name: post.author.name,
        email: post.author.email,
      }),
    });
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
    const created = schema(data);
    if (created instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return new Post(created);
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
    const updated = schema(data);
    if (updated instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return new Post(updated);
  }
}
