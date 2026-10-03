import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { useRepository } from "../../impl/context/repository.tsx";
import { Post } from "../../core/model/post.ts";
import { useSession } from "../../impl/context/session.tsx";

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
  const session = useSession();
  const repository = useRepository();
  const client = useQueryClient();
  const navigate = useNavigate();
  const users = useSuspenseQuery({
    queryKey: ['users'],
    queryFn: repository.user.findMany,
    staleTime: Infinity,
  });
  const reviewers = users.data.filter((it) => it.id !== session.state.user?.id);
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
        navigate('/');
        break;
      case "create_post/request":
        action.payload.preventDefault();
        mutation.mutate(new Post({
          title,
          body,
          author: session.state.user ?? undefined,
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