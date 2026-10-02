import { createContext, useContext, useState, type ReactNode } from 'react';
import { User } from '../../core/model/user.ts';

type Session = {
  user: User | null;
  signIn: (email: string, password: string) => void | Error
}

const Context = createContext<Session | null>(null);

export function SessionProvider(props: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  function signIn(email: string, password: string) {
    if (email === "john@mail.com" && password === "123456") {
      setUser(new User({ id: "1", name: "John", email }))
    } else {
      return new Error('Email and/or password incorrect')
    }
  }

  return (
    <Context.Provider value={{ user, signIn }}>
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
