import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { useRepository } from "../../impl/context/repository.tsx";
import { Post } from "../../core/model/post.ts";
import { reviewers } from "../create-post/container.tsx";

const statuses: Post.Status[] = ["draft", "published", "archived"];

type Action =
  | {
    type: "set_title";
    payload: string;
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
    type: "set_status";
    payload: Post.Status;
  }
  | {
    type: "update_post/success";
    payload: Post;
  }
  | {
    type: "update_post/request";
    payload: FormEvent<HTMLFormElement>;
  }

export function useContainer() {
  const { id } = useParams();
  const postId = id ?? "";
  const repository = useRepository();
  const client = useQueryClient();
  const navigate = useNavigate();
  const post = useSuspenseQuery({
    queryKey: ['posts', postId],
    queryFn: () => repository.post.findOne(postId),
    staleTime: Infinity,
  });
  const [title, setTitle] = useState(post.data.title);
  const [body, setBody] = useState(post.data.body);
  const [reviewerId, setReviewerId] = useState(post.data.reviewer?.id ?? '');
  const [status, setStatus] = useState(post.data.status);
  const mutation = useMutation({
    mutationFn: repository.post.update,
    onSuccess: (updated) => dispatch({ type: "update_post/success", payload: updated }),
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
      case "set_status":
        setStatus(action.payload);
        break;
      case "update_post/success": {
        const updated = new Post({
          ...post.data,
          ...action.payload,
          status,
          reviewer: reviewers.find((it) => it.id === reviewerId),
        });
        client.setQueryData<Post>(['posts', postId], updated);
        client.setQueryData<Post[]>(['posts'], (old = []) => old.map((it) => it.id === updated.id ? updated : it));
        navigate('/');
        break;
      }
      case "update_post/request":
        action.payload.preventDefault();
        mutation.mutate(new Post({
          ...post.data,
          title,
          body,
          status,
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
    status,
    statuses,
    isPending: mutation.isPending,
    error: mutation.error,
  };

  return { state, dispatch };
}
