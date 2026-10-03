import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type } from 'arktype';
import { User } from '../../core/model/user.ts';
import { useProvider } from './provider.tsx';

const users = [
  { user: new User({ id: "1", name: "John", email: "john@mail.com" }), password: "123456" },
  { user: new User({ id: "2", name: "Alice", email: "alice@mail.com" }), password: "123456" },
  { user: new User({ id: "3", name: "Bob", email: "bob@mail.com" }), password: "123456" },
  { user: new User({ id: "4", name: "Carol", email: "carol@mail.com" }), password: "123456" },
  { user: new User({ id: "5", name: "Dave", email: "dave@mail.com" }), password: "123456" },
  { user: new User({ id: "6", name: "Eve", email: "eve@mail.com" }), password: "123456" },
];

type Action =
  | {
    type: "sign_in/request";
    payload: { email: string; password: string };
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
        const found = users.find((it) => it.user.email === email && it.password === password);
        if (!found) {
          setError(new Error('Email and/or password incorrect'));
          break;
        }
        storage.set(STORAGE_KEY, JSON.stringify(found.user));
        setUser(found.user);
        setError(null);
        break;
      }
      default:
        action.type satisfies never;
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
