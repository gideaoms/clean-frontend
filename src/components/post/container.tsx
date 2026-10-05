import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { type FormEvent, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Post } from '../../core/model/post.ts';
import { useRepository } from '../../impl/context/repository.tsx';
import { useSession } from '../../impl/context/session.tsx';

const statuses: Post.Status[] = ['draft', 'published', 'archived'];

type Action =
  | {
      type: 'set_title';
      payload: string;
    }
  | {
      type: 'set_body';
      payload: string;
    }
  | {
      type: 'set_reviewer';
      payload: string;
    }
  | {
      type: 'set_status';
      payload: string;
    }
  | {
      type: 'save_post/success';
      payload: Post;
    }
  | {
      type: 'save_post/request';
      payload: FormEvent<HTMLFormElement>;
    };

export function useContainer() {
  const params = useParams();
  const postId = params.id ?? '';
  const isNew = !postId;
  const repository = useRepository();
  const client = useQueryClient();
  const navigate = useNavigate();
  const session = useSession();
  const found = useSuspenseQuery({
    queryKey: ['posts', postId],
    queryFn: () => {
      if (isNew) return null;
      return repository.post.findOne(postId);
    },
  });
  const post = found.data ?? new Post({});
  const users = useSuspenseQuery({
    queryKey: ['users'],
    queryFn: repository.user.findMany,
  });
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [reviewerId, setReviewerId] = useState(post.reviewerId);
  const [status, setStatus] = useState(post.status);
  const mutation = useMutation({
    mutationFn: isNew ? repository.post.create : repository.post.update,
    onSuccess: (saved) => {
      dispatch({ type: 'save_post/success', payload: saved });
    },
  });

  function dispatch(action: Action) {
    switch (action.type) {
      case 'set_title':
        setTitle(action.payload);
        break;
      case 'set_body':
        setBody(action.payload);
        break;
      case 'set_reviewer':
        setReviewerId(action.payload);
        break;
      case 'set_status':
        setStatus(action.payload as Post.Status);
        break;
      case 'save_post/success': {
        const saved = action.payload;
        client.setQueryData<Post>(['posts', saved.id], saved);
        client.setQueryData<Post[]>(['posts'], (old = []) =>
          isNew
            ? [saved, ...old]
            : old.map((it) => (it.id === saved.id ? saved : it)),
        );
        navigate('/');
        break;
      }
      case 'save_post/request':
        action.payload.preventDefault();
        mutation.mutate(
          new Post({
            id: postId,
            title,
            body,
            status,
            authorId: session.state.user?.id,
            reviewerId,
          }),
        );
        break;
      default:
        action satisfies never;
    }
  }

  const state = {
    isNew,
    title,
    body,
    reviewerId,
    status,
    author: post.author,
    users: users.data,
    statuses,
    isPending: mutation.isPending,
    error: mutation.error,
  };

  return { state, dispatch };
}
