import { useContainer } from './container.tsx';

export function CreatePost() {
  const { state, dispatch } = useContainer();

  return (
    <form onSubmit={(e) => dispatch({ type: "create_post/request", payload: e })}>
      <input value={state.title} onChange={e => dispatch({ type: "set_title", payload: e.target.value })} placeholder="Title" required />
      <textarea value={state.body} onChange={e => dispatch({ type: "set_body", payload: e.target.value })} placeholder="Body" required />
      <select value={state.reviewerId} onChange={e => dispatch({ type: "set_reviewer", payload: e.target.value })}>
        <option value="">No reviewer</option>
        {state.reviewers.map(it => <option key={it.id} value={it.id}>{it.name}</option>)}
      </select>
      <button type="submit" disabled={state.isPending}>
        {state.isPending ? 'Creating...' : 'Create Post'}
      </button>
      {state.error ? <p>{state.error.message}</p> : null}
    </form>
  );
}
