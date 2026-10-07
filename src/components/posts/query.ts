import { useSuspenseQuery } from '@tanstack/react-query';
import { useRepository } from '../../impl/context/repository.tsx';

export function useQuery() {
  const repository = useRepository();
  const query = useSuspenseQuery({
    queryKey: ['posts'],
    queryFn: repository.post.findMany,
  });
  return { posts: query.data };
}
