import { createContext, type ReactNode, useContext, useState } from 'react';
import { setSuspense, useSuspense } from './util/suspense.ts';

type User = {
  id: string;
  name: string;
};
type Context = {
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
};

const Context = createContext<Context | null>(null);
const USERS = [
  {
    id: '1',
    name: 'User 1',
  },
  {
    id: '2',
    name: 'User 2',
  },
] as const satisfies User[];
const STORAGE_KEY = 'session:user';

async function getUserIdFromStorage() {
  return localStorage.getItem(STORAGE_KEY);
}

async function addUserIdToStorage(userId: string) {
  return localStorage.setItem(STORAGE_KEY, userId);
}

async function clearUserIdInStorage() {
  return localStorage.removeItem(STORAGE_KEY);
}

async function getUserFromAPI(userId: string): Promise<User | null> {
  if (userId === '1') {
    return USERS[0];
  }
  if (userId === '2') {
    return USERS[1];
  }
  return null;
}

export function SessionProvider(props: { children: ReactNode }) {
  const found = useSuspense({
    key: [],
    fn: () => {
      console.log('Entered Suspense');
      return loadUser();
    },
  });
  const [user, setUser] = useState(found);
  console.log('rendered [SessionProvider]', Math.random());

  async function logout() {
    await clearUserIdInStorage();
    setSuspense({ key: [], value: null });
    setUser(null);
  }

  async function login(user: User) {
    await addUserIdToStorage(user.id);
    setSuspense({ key: [], value: user });
    setUser(user);
  }

  async function loadUser() {
    const userId = await getUserIdFromStorage();
    console.log('userId [LocalStorage]', userId);
    if (!userId) {
      return null;
    }
    return getUserFromAPI(userId);
  }

  return (
    <Context.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
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

export function App() {
  const session = useSession();

  console.log('rendered [App]', Math.random());

  if (!session.user) {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            session.login(USERS[0]);
          }}
        >
          Login with user 1
        </button>
        <hr />
        <button
          type="button"
          onClick={() => {
            session.login(USERS[1]);
          }}
        >
          Login with user 2
        </button>
      </div>
    );
  }

  return (
    <div>
      <p>Welcome: {session.user.name}</p>
      <button
        type="button"
        onClick={() => {
          session.logout();
        }}
      >
        Logout
      </button>
    </div>
  );
}
