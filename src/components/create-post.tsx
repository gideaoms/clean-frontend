import { useState, type FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Post } from '../core/model/post.ts';
import { useRepositories } from '../impl/context/repository.tsx';

export function CreatePost() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { postRepository } = useRepositories();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postRepository.create,
    onSuccess: (created) => {
      queryClient.setQueryData<Post[]>(['posts'], (old) => [created, ...(old ?? [])]);
      setTitle('');
      setBody('');
    },
  });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutation.mutate(new Post({ title, body }));
  }

  return (
    <form onSubmit={onSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Body" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Post'}
      </button>
      {mutation.error ? <p>{mutation.error.message}</p> : null}
    </form>
  );
}
