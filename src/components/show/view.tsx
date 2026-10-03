import { Link } from 'react-router';
import { useContainer } from './container.tsx';

export function Show() {
  const { state } = useContainer();

  return (
    <form>
      <input value={state.reviewer.name} placeholder="Reviewer" readOnly />
      <input value={state.post.title} placeholder="Title" readOnly />
      <textarea value={state.post.body} placeholder="Body" readOnly />
      <Link to="/">Back</Link>
    </form>
  );
}
