import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { useRepository } from "../../impl/context/repository";
import { Post } from "../../core/model/post";

type Action =
  | {
    type: "set_title";
    payload: string
  }
  | {
    type: "set_body";
    payload: string;
  }
  | {
    type: "create_post/success";
    payload: Post;
  }
  | {
    type: "create_post/request";
    payload: FormEvent<HTMLFormElement>;
  }

export function useContainer() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const repository = useRepository();
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: repository.post.create,
    onSuccess: (created) => dispatch({ type: "create_post/success", payload: created }),
  });

  function dispatch(action: Action) {
    switch (action.type) {
      case "set_title":
        setTitle(action.payload);
        break;
      case "set_body":
        setBody(action.payload);
        break;
      case "create_post/success":
        client.setQueryData<Post[]>(['posts'], (old = []) => [action.payload, ...old]);
        setTitle('');
        setBody('');
        break;
      case "create_post/request":
        action.payload.preventDefault();
        mutation.mutate(new Post({ title: title, body }));
        break;
      default:
        action satisfies never;
    }
  }

  const state = {
    title,
    body,
    isPending: mutation.isPending,
    error: mutation.error,
  }

  return { state, dispatch }
}