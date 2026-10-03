import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useRepository } from "../../impl/context/repository.tsx";
import { User } from "../../core/model/user.ts";

export function useContainer() {
  const { id } = useParams();
  const postId = Number(id);
  const repository = useRepository();
  const post = useSuspenseQuery({
    queryKey: ['posts', postId],
    queryFn: () => repository.post.findOne(postId),
  });

  const state = {
    post: post.data,
    reviewer: post.data.reviewer ?? new User({}),
  };

  return { state };
}
