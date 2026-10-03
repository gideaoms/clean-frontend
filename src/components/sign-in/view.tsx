import { useContainer } from './container.tsx';

export function SignIn() {
  const { state, dispatch } = useContainer();

  return (
    <div>
      <input value={state.email} onChange={e => dispatch({ type: "set_email", payload: e.target.value })} />
      <input value={state.password} onChange={e => dispatch({ type: "set_password", payload: e.target.value })} />
      <button onClick={() => dispatch({ type: "sign_in/request" })}>Sign In</button>
      {state.error ? <p>{state.error.message}</p> : null}
    </div>
  );
}
