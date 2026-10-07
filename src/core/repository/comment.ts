import type { Comment } from '../model/comment.ts';

export interface CommentRepository {
  create(comment: Comment): Promise<Comment>;
}
