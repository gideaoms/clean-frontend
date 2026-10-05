import { type } from 'arktype';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useEffectEvent,
  useState,
} from 'react';
import { User } from '../../core/model/user.ts';
import { useProvider } from './provider.tsx';
import { useRepository } from './repository.tsx';

type Action = {
  type: 'sign_in';
  payload: { email: string; password: string };
};

type Session = {
  state: {
    user: User | null;
    isFetching: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const onInit = useEffectEvent(() => {
    const raw = provider.storage.get(STORAGE_KEY);
    if (!raw) {
      setIsFetching(false);
      return;
    }
    const schema = type({
      id: 'string',
      name: 'string',
      email: 'string',
    });
    const user = schema(JSON.parse(raw));
    if (user instanceof type.errors) {
      provider.storage.remove(STORAGE_KEY);
      setIsFetching(false);
      return;
    }
    setUser(new User(user));
    setIsFetching(false);
  });

  useEffect(onInit, []);

  async function dispatch(action: Action) {
    switch (action.type) {
      case 'sign_in': {
        setIsAuthenticating(true);
        const { email, password } = action.payload;
        const found = await repository.user.signIn(email, password);
        if (found instanceof Error) {
          setError(found);
          setIsAuthenticating(false);
          return;
        }
        provider.storage.set(STORAGE_KEY, JSON.stringify(found));
        setUser(found);
        break;
      }
      default:
        action.type satisfies never;
    }
  }

  const state = {
    user,
    isFetching,
    error,
    isAuthenticating,
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
