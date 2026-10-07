import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { type } from 'arktype';
import { useActionState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Post } from '../../core/model/post.ts';
import { User } from '../../core/model/user.ts';
import { useRepository } from '../../impl/context/repository.tsx';
import { useSession } from '../../impl/context/session.tsx';

type State = {
  post: Post;
  err: Error | null;
};

const schema = type({
  id: 'string.trim',
  title: 'string.trim |> string > 0',
  body: 'string.trim |> string > 0',
  status: "'draft' | 'published' | 'archived' = 'draft'",
  authorId: 'string.trim |> string > 0',
});

export function useForm() {
  const params = useParams();
  const postId = params.id ?? '';
  const isNew = !postId;
  const session = useSession();
  const repository = useRepository();
  const navigate = useNavigate();
  const client = useQueryClient();
  const found = useSuspenseQuery({
    queryKey: ['posts', postId],
    queryFn: () => {
      if (isNew) return null;
      return repository.post.findOne(postId);
    },
  });
  const user = session.user ?? new User({});
  const post = found.data ?? new Post({ authorId: user.id });
  const initial = { post, err: null } satisfies State;
  const [state, action, isPending] = useActionState(reducer, initial);

  async function reducer(_prev: State, form: FormData): Promise<State> {
    const payload = {
      id: form.get('id')?.toString() ?? '',
      title: form.get('title')?.toString() ?? '',
      body: form.get('body')?.toString() ?? '',
      status: form.get('status')?.toString() ?? '',
      authorId: form.get('authorId')?.toString() ?? '',
    };
    const validated = schema(payload);
    if (validated instanceof type.errors) {
      return { post, err: new Error(validated.summary) };
    }
    try {
      const post = new Post(validated);
      const saved = isNew
        ? await repository.post.create(post)
        : await repository.post.update(post);
      client.setQueryData<Post>(['posts', saved.id], saved);
      client.setQueryData<Post[]>(['posts'], (prev = []) => {
        if (isNew) {
          return [saved, ...prev];
        }
        return prev.map((it) => (it.id === saved.id ? saved : it));
      });
      navigate('/');
      return { post: saved, err: null };
    } catch (err) {
      if (err instanceof Error) {
        return { post, err };
      }
      throw err;
    }
  }

  return { state, action, isPending, isNew };
}
