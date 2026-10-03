import { useContainer } from './container.tsx';

export function Posts() {
  const { state } = useContainer();

  return (
    <ul>
      {state.posts.map((it) => (
        <li key={it.id}>[{it.status}] {it.title}</li>
      ))}
    </ul>
  );
}
