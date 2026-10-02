import { useSuspenseQuery } from "@tanstack/react-query";
import { useRepository } from "../../impl/context/repository";

export function useContainer() {
  const repository = useRepository();
  const posts = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: repository.post.findMany,
  });

  return { posts: posts.data }
}
