import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type } from 'arktype';
import { User } from '../../core/model/user.ts';
import { useProvider } from './provider.tsx';
import { useRepository } from './repository.tsx';

type Action =
  | {
    type: "sign_in/request";
    payload: { email: string; password: string };
  }
  | {
    type: "sign_in/success";
    payload: User;
  }
  | {
    type: "sign_in/failure";
    payload: Error;
  }

type Session = {
  state: {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
  };
  dispatch: (action: Action) => void;
}

const Context = createContext<Session | null>(null);

const STORAGE_KEY = 'session:user';

export function SessionProvider(props: { children: ReactNode }) {
  const { storage } = useProvider();
  const repository = useRepository();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(onInit, []);

  function onInit() {
    const raw = storage.get(STORAGE_KEY);
    if (!raw) {
      setIsLoading(false);
      return;
    }
    const schema = type({
      id: 'string',
      name: 'string',
      email: 'string',
    });
    const user = schema(JSON.parse(raw));
    if (user instanceof type.errors) {
      storage.remove(STORAGE_KEY);
      setIsLoading(false);
      return;
    }
    setUser(new User(user));
    setIsLoading(false);
  }

  function dispatch(action: Action) {
    switch (action.type) {
      case "sign_in/request": {
        const { email, password } = action.payload;
        repository.user.signIn(email, password)
          .then((found) => dispatch({ type: "sign_in/success", payload: found }))
          .catch((err: Error) => dispatch({ type: "sign_in/failure", payload: err }));
        break;
      }
      case "sign_in/success":
        storage.set(STORAGE_KEY, JSON.stringify(action.payload));
        setUser(action.payload);
        setError(null);
        break;
      case "sign_in/failure":
        setError(action.payload);
        break;
      default:
        action satisfies never;
    }
  }

  const state = {
    user,
    isLoading,
    error,
  }

  return (
    <Context.Provider value={{ state, dispatch }}>
      {props.children}
    </Context.Provider>
  );
}

export function useSession() {
  const session = useContext(Context);
  if (!session) {
    throw new Error('Session Context must be provided');
  }
  return session;
}
