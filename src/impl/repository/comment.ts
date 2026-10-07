import { type } from 'arktype';
import { Comment } from '../../core/model/comment.ts';
import type { CommentRepository } from '../../core/repository/comment.ts';
import { sleep } from '../../util/sleep.ts';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export class CommentRepositoryImpl implements CommentRepository {
  async create(comment1: Comment): Promise<Comment> {
    await sleep(1000);
    const response = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment1),
    });
    if (!response.ok) {
      throw new Error('Failed to create comment');
    }
    const data = await response.json();
    const comment2 = type({
      id: 'string',
      postId: 'string',
      content: 'string',
      authorId: 'string',
    })(data);
    if (comment2 instanceof type.errors) {
      throw new Error('Invalid data');
    }
    return new Comment({
      id: comment2.id,
      postId: comment2.postId,
      content: comment2.content,
      authorId: comment2.authorId,
    });
  }
}
