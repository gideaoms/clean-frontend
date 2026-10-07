import { useSuspenseQuery } from '@tanstack/react-query';
import { useRepository } from '../../impl/context/repository.tsx';

export function useContainer() {
  const repository = useRepository();
  const posts = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: repository.post.findMany,
  });

  const state = {
    posts: posts.data,
  };

  return { state };
}
