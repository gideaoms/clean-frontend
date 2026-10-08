import { useQueryClient } from '@tanstack/react-query';
import { createContext, type ReactNode, useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import type { User } from '../../core/model/user.ts';
import { setSuspense, useSuspense } from '../../util/suspense.ts';
import { useProvider } from './provider.tsx';
import { useRepository } from './repository.tsx';

type Session = {
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
};

const Context = createContext<Session | null>(null);
const STORAGE_KEY = 'session:user';

export function SessionProvider(props: { children: ReactNode }) {
  const provider = useProvider();
  const repository = useRepository();
  const client = useQueryClient();
  const navigate = useNavigate();
  const found = useSuspense({
    key: [],
    fn: loadUser,
  });
  const [user, setUser] = useState(found);

  async function loadUser() {
    const userId = await provider.storage.get(STORAGE_KEY);
    if (!userId) {
      return null;
    }
    return repository.user.findOne(userId);
  }

  async function logout() {
    await provider.storage.remove(STORAGE_KEY);
    setSuspense({ key: [], value: null });
    client.clear();
    setUser(null);
    navigate('/', { replace: true });
  }

  async function login(user: User) {
    await provider.storage.set(STORAGE_KEY, user.id);
    setSuspense({ key: [], value: user });
    setUser(user);
  }

  return (
    <Context.Provider value={{ user, login, logout }}>
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
