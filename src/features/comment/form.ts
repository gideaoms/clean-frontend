import { useQueryClient } from '@tanstack/react-query';
import { type } from 'arktype';
import { useActionState } from 'react';
import { useNavigate } from 'react-router';
import { Comment } from '../../core/model/comment.ts';
import { User } from '../../core/model/user.ts';
import { useRepository } from '../../impl/context/repository.tsx';
import { useSession } from '../../impl/context/session.tsx';

type State = {
  comment: Comment;
  err: Error | null;
};

const schema = type({
  postId: 'string > 0',
  content: 'string > 0',
  authorId: 'string > 0',
});

export function useForm() {
  const session = useSession();
  const user = session.state.user ?? new User({});
  const initial = { comment: new Comment({ authorId: user.id }), err: null };
  const repository = useRepository();
  const navigate = useNavigate();
  const [state, action, isPending] = useActionState(reducer, initial);
  const client = useQueryClient();

  async function reducer(_prev: State, payload: FormData): Promise<State> {
    const data = {
      postId: payload.get('postId')?.toString() ?? '',
      content: payload.get('content')?.toString() ?? '',
      authorId: payload.get('authorId')?.toString() ?? '',
    };
    const validated = schema(data);
    if (validated instanceof type.errors) {
      return {
        comment: new Comment(data),
        err: new Error(validated.summary),
      };
    }
    try {
      const comment = new Comment(validated);
      const created = await repository.comment.create(comment);
      client.setQueryData<Comment[]>(['comments'], (prev = []) => [
        created,
        ...prev,
      ]);
      navigate('/');
      return { comment: created, err: null };
    } catch (err) {
      if (err instanceof Error) {
        return { comment: new Comment(data), err };
      }
      throw err;
    }
  }

  return { state, action, isPending };
}
