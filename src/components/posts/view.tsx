import { Link } from 'react-router';
import { useContainer } from './container.tsx';

export function Posts() {
  const { state } = useContainer();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Posts</h1>
        <Link to="/posts/new" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">New post</Link>
      </div>
      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white">
        {state.posts.map((it) => (
          <li key={it.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium uppercase text-gray-600">{it.status}</span>
              <span className="text-sm">{it.title}</span>
            </div>
            <Link to={`/posts/${it.id}`} className="text-sm font-medium text-blue-600 hover:underline">View</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
