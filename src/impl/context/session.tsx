import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  type ReactNode,
  use,
  useContext,
  useState,
} from 'react';
import { useNavigate } from 'react-router';
import type { User } from '../../core/model/user.ts';
import { useProvider } from './provider.tsx';

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
// const SUSPENSE_KEY = 'session';

export function SessionProvider(props: {
  promise: Promise<User | null>;
  children: ReactNode;
}) {
  console.log('user promise', props.promise);
  const provider = useProvider();
  const client = useQueryClient();
  const navigate = useNavigate();
  console.log('session promise', props.promise);
  const user1 = use(props.promise);
  console.log('user [v1]', user1);
  const [user2, setUser] = useState(user1);

  function dispatch(action: Action) {
    switch (action.type) {
      case 'session/start': {
        provider.storage.set(STORAGE_KEY, action.payload.id);
        setUser(action.payload);
        break;
      }
      case 'session/finish': {
        provider.storage.remove(STORAGE_KEY);
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
