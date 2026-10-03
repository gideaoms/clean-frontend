import { Link } from 'react-router';
import { useContainer } from './container.tsx';

export function Posts() {
  const { state } = useContainer();

  return (
    <>
      <Link to="/posts/new">New post</Link>
      <ul>
        {state.posts.map((it) => (
          <li key={it.id}>[{it.status}] {it.title} <Link to={`/posts/${it.id}`}>View</Link></li>
        ))}
      </ul>
    </>
  );
}
