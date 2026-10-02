import { useSuspenseQuery } from "@tanstack/react-query";
import { useRepositories } from "../../impl/context/repository";

export function useContainer() {
  const { postRepository } = useRepositories();
  const posts = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: postRepository.findMany,
  });

  return { posts }
}
