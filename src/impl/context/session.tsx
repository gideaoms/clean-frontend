import { useQueryClient } from '@tanstack/react-query';
import { createContext, type ReactNode, useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import type { User } from '../../core/model/user.ts';
import { invalidate, useSuspense } from '../../util/suspense.ts';
import { useProvider } from './provider.tsx';
import { useRepository } from './repository.tsx';

type Action =
  | {
      type: 'session/start';
      payload: User;
    }
  | {
      type: 'session/finish';
    };

type Session = {
  user: User | null;
  dispatch: (action: Action) => void;
};

const Context = createContext<Session | null>(null);
const STORAGE_KEY = 'session:user';
const SUSPENSE_KEY = 'session';

export function SessionProvider(props: { children: ReactNode }) {
  const provider = useProvider();
  const repository = useRepository();
  const client = useQueryClient();
  const navigate = useNavigate();
  const user1 = useSuspense({
    key: SUSPENSE_KEY,
    fn: async () => {
      const id = provider.storage.get(STORAGE_KEY);
      if (!id) {
        return null;
      }
      try {
        return await repository.user.findOne(id);
      } catch {
        provider.storage.remove(STORAGE_KEY);
        return null;
      }
    },
  });
  const [user2, setUser] = useState(user1);

  function dispatch(action: Action) {
    switch (action.type) {
      case 'session/start': {
        provider.storage.set(STORAGE_KEY, action.payload.id);
        invalidate(SUSPENSE_KEY);
        setUser(action.payload);
        break;
      }
      case 'session/finish': {
        provider.storage.remove(STORAGE_KEY);
        invalidate(SUSPENSE_KEY);
        client.clear();
        setUser(null);
        navigate('/', { replace: true });
        break;
      }
      default:
        action satisfies never;
    }
  }

  return (
    <Context.Provider value={{ dispatch, user: user2 }}>
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
