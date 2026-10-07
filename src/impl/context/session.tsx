import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
} from 'react';
import { useNavigate } from 'react-router';
import type { User } from '../../core/model/user.ts';
import { useProvider } from './provider.tsx';
import { useRepository } from './repository.tsx';

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
  const repository = useRepository();
  const client = useQueryClient();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(true);

  const onInit = useEffectEvent(async () => {
    const id = provider.storage.get(STORAGE_KEY);
    if (!id) {
      setIsPending(false);
      return;
    }
    try {
      const found = await repository.user.findOne(id);
      setUser(found);
    } catch {
      provider.storage.remove(STORAGE_KEY);
    } finally {
      setIsPending(false);
    }
  });

  useEffect(() => {
    onInit();
  }, []);

  function dispatch(action: Action) {
    switch (action.type) {
      case 'start_session': {
        provider.storage.set(STORAGE_KEY, action.payload.id);
        setUser(action.payload);
        break;
      }
      case 'finish_session': {
        provider.storage.remove(STORAGE_KEY);
        client.clear();
        navigate('/', { replace: true });
        setUser(null);
        break;
      }
      default:
        action satisfies never;
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
