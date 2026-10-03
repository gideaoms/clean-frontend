import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { useRepository } from "../../impl/context/repository.tsx";
import { Post } from "../../core/model/post.ts";
import { User } from "../../core/model/user.ts";

export const reviewers = [
  new User({ id: "2", name: "Alice", email: "alice@mail.com" }),
  new User({ id: "3", name: "Bob", email: "bob@mail.com" }),
  new User({ id: "4", name: "Carol", email: "carol@mail.com" }),
  new User({ id: "5", name: "Dave", email: "dave@mail.com" }),
  new User({ id: "6", name: "Eve", email: "eve@mail.com" }),
];

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
    type: "set_reviewer";
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
  const [reviewerId, setReviewerId] = useState('');
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
      case "set_reviewer":
        setReviewerId(action.payload);
        break;
      case "create_post/success":
        client.setQueryData<Post[]>(['posts'], (old = []) => [action.payload, ...old]);
        setTitle('');
        setBody('');
        setReviewerId('');
        break;
      case "create_post/request":
        action.payload.preventDefault();
        mutation.mutate(new Post({
          title,
          body,
          reviewer: reviewers.find((it) => it.id === reviewerId),
        }));
        break;
      default:
        action satisfies never;
    }
  }

  const state = {
    title,
    body,
    reviewerId,
    reviewers,
    isPending: mutation.isPending,
    error: mutation.error,
  }

  return { state, dispatch }
}