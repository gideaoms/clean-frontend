import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { useRepositories } from "../../impl/context/repository";
import { Post } from "../../core/model/post";

export function useContainer() {
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
    mutation.mutate(new Post({ title: title, body }));
  }

  return { title, setTitle, body, setBody, onSubmit, error: mutation.error, isPending: mutation.isPending }
}