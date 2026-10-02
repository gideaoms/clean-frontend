import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { useRepository } from "../../impl/context/repository";
import { Post } from "../../core/model/post";

export function useContainer() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const repository = useRepository();
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: repository.post.create,
    onSuccess: (created) => {
      client.setQueryData<Post[]>(['posts'], (old = []) => [created, ...old]);
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