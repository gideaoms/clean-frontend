import { useQueryClient } from '@tanstack/react-query';
import { createContext, type ReactNode, useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import type { User } from '../../core/model/user.ts';
import { setSuspense, useSuspense } from '../../util/suspense.ts';
import { useRepository } from './repository.tsx';
import { useProvider } from './service.tsx';

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

  return <Context value={{ user, login, logout }}>{props.children}</Context>;
}

export function useSession() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('Session Context must be provided');
  }
  return context;
}
