import { useState } from "react";
import { useSession } from "../../impl/context/session";

export function useContainer() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn } = useSession();

  function onSignIn() {
    const err = signIn(email, password);
    if (err) {
      setErrorMessage(err.message);
    }
  }

  return { email, setEmail, password, setPassword, errorMessage, onSignIn }
}
