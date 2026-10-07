import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  type ReactNode,
  useActionState,
  useContext,
} from 'react';
import { useNavigate } from 'react-router';
import type { User } from '../../core/model/user.ts';
import { useProvider } from './provider.tsx';

type Action =
  | {
      type: 'start_session';
      payload: User;
    }
  | {
      type: 'finish_session';
    };

type Session = {
  user: User | null;
  dispatch: (action: Action) => void;
  isPending: boolean;
};

const Context = createContext<Session | null>(null);
const STORAGE_KEY = 'session:user';

export function SessionProvider(props: { children: ReactNode }) {
  const provider = useProvider();
  const client = useQueryClient();
  const navigate = useNavigate();
  const [user, dispatch, isPending] = useActionState(reducer, null);

  async function reducer(_prev: unknown, action: Action): Promise<User | null> {
    switch (action.type) {
      case 'start_session': {
        provider.storage.set(STORAGE_KEY, action.payload.id);
        return action.payload;
      }
      case 'finish_session': {
        provider.storage.remove(STORAGE_KEY);
        client.clear();
        navigate('/', { replace: true });
        return null;
      }
      default:
        return action satisfies never;
    }
  }

  return (
    <Context.Provider value={{ dispatch, isPending, user }}>
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
