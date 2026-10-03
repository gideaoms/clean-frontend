import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type } from 'arktype';
import { User } from '../../core/model/user.ts';
import { useProvider } from './provider.tsx';

type Session = {
  user: User | null;
  signIn: (email: string, password: string) => void | Error;
  isLoading: boolean;
}

const Context = createContext<Session | null>(null);

const STORAGE_KEY = 'session:user';

export function SessionProvider(props: { children: ReactNode }) {
  const { storage } = useProvider();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  function signIn(email: string, password: string) {
    if (email === "john@mail.com" && password === "123456") {
      const user = new User({ id: "1", name: "John", email });
      storage.set(STORAGE_KEY, JSON.stringify(user));
      setUser(user);
    } else {
      return new Error('Email and/or password incorrect')
    }
  }

  return (
    <Context.Provider value={{ user, signIn, isLoading }}>
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
