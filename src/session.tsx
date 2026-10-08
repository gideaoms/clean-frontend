import {
  createContext,
  type ReactNode,
  Suspense,
  use,
  useContext,
  useState,
} from 'react';

type User = {
  id: string;
  name: string;
};
type Context = {
  user: User | null;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  promise: Promise<User | null>;
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

async function getUserFromAPI(userId: string) {
  // await sleep(1_000);
  if (userId === '1') {
    return USERS[0];
  }
  if (userId === '2') {
    return USERS[1];
  }
  return null;
}

export function SessionProvider(props: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  console.log('rendered [SessionProvider]', Math.random());

  async function logout() {
    await clearUserIdInStorage();
    setUser(null);
  }

  async function login(user: User) {
    await addUserIdToStorage(user.id);
    setUser(user);
  }

  async function loadUser() {
    const userId = await getUserIdFromStorage();
    console.log('userId', userId);
    if (!userId) {
      return null;
    }
    const user = await getUserFromAPI(userId);
    return user;
  }

  const promise = loadUser();

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Context.Provider
        value={{
          user,
          login,
          logout,
          promise,
        }}
      >
        {props.children}
      </Context.Provider>
    </Suspense>
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
  const user = session.user;

  console.log('rendered [App]', Math.random());

  if (!user) {
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
      <p>Welcome: {user.name}</p>
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
