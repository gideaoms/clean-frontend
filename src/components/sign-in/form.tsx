import { useContainer } from './container.tsx';

export function SignIn() {
  const container = useContainer();

  return (
    <div>
      <input value={container.email} onChange={e => container.setEmail(e.target.value)} />
      <input value={container.password} onChange={e => container.setPassword(e.target.value)} />
      <button onClick={container.onSignIn}>Sign In</button>
      {container.errorMessage ? <p>{container.errorMessage}</p> : null}
    </div>
  );
}
