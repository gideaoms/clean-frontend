import { Link } from 'react-router';
import { useContainer } from './container.tsx';

export function Show() {
  const { state, dispatch } = useContainer();

  return (
    <form onSubmit={(e) => dispatch({ type: "update_post/request", payload: e })}>
      <select value={state.reviewerId} onChange={e => dispatch({ type: "set_reviewer", payload: e.target.value })}>
        <option value="">No reviewer</option>
        {state.reviewers.map(it => <option key={it.id} value={it.id}>{it.name}</option>)}
      </select>
      <input value={state.title} onChange={e => dispatch({ type: "set_title", payload: e.target.value })} placeholder="Title" required />
      <textarea value={state.body} onChange={e => dispatch({ type: "set_body", payload: e.target.value })} placeholder="Body" required />
      <button type="submit" disabled={state.isPending}>
        {state.isPending ? 'Saving...' : 'Save'}
      </button>
      <Link to="/">Back</Link>
      {state.error ? <p>{state.error.message}</p> : null}
    </form>
  );
}
