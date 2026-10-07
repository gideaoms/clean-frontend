import { Suspense } from 'react';
import { useQuery } from './query.ts';

const className =
  'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

export function Posts(props: { postId: string }) {
  return (
    <Suspense
      fallback={
        <select className={className} name="postId" disabled>
          <option value="">Loading...</option>
        </select>
      }
    >
      <Select postId={props.postId} />
    </Suspense>
  );
}

function Select(props: { postId: string }) {
  const { posts } = useQuery();
  return (
    <select
      key={props.postId}
      className={className}
      defaultValue={props.postId}
      name="postId"
    >
      <option value="">Select a post...</option>
      {posts.map((it) => (
        <option key={it.id} value={it.id}>
          {it.title}
        </option>
      ))}
    </select>
  );
}
