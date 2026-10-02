import { useContainer } from './container.tsx';

export function Posts() {
  const container = useContainer();

  return (
    <ul>
      {container.posts.map((it) => (
        <li key={it.id}>{it.title}</li>
      ))}
    </ul>
  );
}
