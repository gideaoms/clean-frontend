import { useContainer } from './container.tsx';

export function CreatePost() {
  const { state, dispatch } = useContainer();

  return (
    <form onSubmit={(e) => dispatch({ type: "create_post/request", payload: e })}>
      <input value={state.title} onChange={e => dispatch({ type: "set_title", payload: e.target.value })} placeholder="Title" required />
      <textarea value={state.body} onChange={e => dispatch({ type: "set_body", payload: e.target.value })} placeholder="Body" required />
      <button type="submit" disabled={state.isPending}>
        {state.isPending ? 'Creating...' : 'Create Post'}
      </button>
      {state.error ? <p>{state.error.message}</p> : null}
    </form>
  );
}
