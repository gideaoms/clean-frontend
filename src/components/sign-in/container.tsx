import { useState } from "react";
import { useSession } from "../../impl/context/session";

type Action =
  | {
    type: "set_email";
    payload: string;
  }
  | {
    type: "set_password";
    payload: string;
  }
  | {
    type: "sign_in/request";
  }

export function useContainer() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn } = useSession();

  function dispatch(action: Action) {
    switch (action.type) {
      case "set_email":
        setEmail(action.payload);
        break;
      case "set_password":
        setPassword(action.payload);
        break;
      case "sign_in/request": {
        const err = signIn(email, password);
        if (err) {
          setErrorMessage(err.message);
        }
        break;
      }
      default:
        action satisfies never;
    }
  }

  const state = {
    email,
    password,
    errorMessage,
  }

  return { state, dispatch }
}
