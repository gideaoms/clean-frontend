import { useSuspenseQuery } from "@tanstack/react-query";
import { useRepositories } from "../impl/context/repository.tsx";

export function Posts() {
  const { postRepository } = useRepositories()
  const posts = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: postRepository.findMany,
  });
  return (
    <ul>
      {posts.data.map((it) => (
        <li key={it.id}>{it.title}</li>
      ))}
    </ul>
  );
}