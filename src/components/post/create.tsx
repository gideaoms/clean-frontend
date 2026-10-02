import { useContainer } from './container.tsx';

export function CreatePost() {
  const container = useContainer();

  return (
    <form onSubmit={container.onSubmit}>
      <input value={container.title} onChange={e => container.setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={container.body} onChange={e => container.setBody(e.target.value)} placeholder="Body" required />
      <button type="submit" disabled={container.isPending}>
        {container.isPending ? 'Creating...' : 'Create Post'}
      </button>
      {container.error ? <p>{container.error.message}</p> : null}
    </form>
  );
}
