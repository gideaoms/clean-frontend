import { useState } from 'react';

type Action =
  | {
      type: 'set_email';
      payload: string;
    }
  | {
      type: 'set_password';
      payload: string;
    };

export function useContainer() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function dispatch(action: Action) {
    switch (action.type) {
      case 'set_email':
        setEmail(action.payload);
        break;
      case 'set_password':
        setPassword(action.payload);
        break;
      default:
        action satisfies never;
    }
  }

  const state = {
    email,
    password,
  };

  return { state, dispatch };
}
