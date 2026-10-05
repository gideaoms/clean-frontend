import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type } from 'arktype';
import { createContext, type ReactNode, useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { User } from '../../core/model/user.ts';
import { useProvider } from './provider.tsx';
import { useRepository } from './repository.tsx';

type Action =
  | {
      type: 'sign_in/request';
      payload: { email: string; password: string };
    }
  | {
      type: 'sign_in/success';
      payload: User;
    }
  | {
      type: 'sign_out';
    };

type Session = {
  state: {
    user: User | null;
    isAuthenticating: boolean;
    error: Error | null;
  };
  dispatch: (action: Action) => void;
};

const Context = createContext<Session | null>(null);
const STORAGE_KEY = 'session:user';

export function SessionProvider(props: { children: ReactNode }) {
  const provider = useProvider();
  const repository = useRepository();
  const client = useQueryClient();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const raw = provider.storage.get(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const schema = type({
      id: 'string',
      name: 'string',
      email: 'string',
    });
    const found = schema(JSON.parse(raw));
    if (found instanceof type.errors) {
      provider.storage.remove(STORAGE_KEY);
      return null;
    }
    return new User(found);
  });
  const mutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      repository.user.signIn(credentials.email, credentials.password),
    onSuccess: (found) => dispatch({ type: 'sign_in/success', payload: found }),
  });

  function dispatch(action: Action) {
    switch (action.type) {
      case 'sign_in/request': {
        mutation.mutate(action.payload);
        break;
      }
      case 'sign_in/success': {
        provider.storage.set(STORAGE_KEY, JSON.stringify(action.payload));
        setUser(action.payload);
        break;
      }
      case 'sign_out': {
        provider.storage.remove(STORAGE_KEY);
        setUser(null);
        mutation.reset();
        client.clear();
        navigate('/', { replace: true });
        break;
      }
      default:
        action satisfies never;
    }
  }

  const state = {
    user,
    error: mutation.error,
    isAuthenticating: mutation.isPending,
  };

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
