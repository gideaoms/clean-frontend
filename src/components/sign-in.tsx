import { useState } from 'react';
import { useSession } from '../impl/context/session.tsx';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn } = useSession();

  function onSignIn() {
    const err = signIn(email, password)
    if (err) {
      setErrorMessage(err.message);
    }
  }

  return (
    <div>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <input value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={onSignIn}>Sign In</button>
      {errorMessage ? <p>{errorMessage}</p> : null}
    </div>
  );
}
