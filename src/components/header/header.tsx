import { User } from '../../core/model/user.ts';
import { useSession } from '../../impl/context/session.tsx';

export function Header() {
  const session = useSession();
  const user = session.user ?? new User({});

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 text-sm text-gray-600">
        <div>
          Welcome <span className="font-medium text-gray-900">{user.name}</span>{' '}
          ({user.email})
        </div>
        <button
          type="button"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
          onClick={() => {
            session.dispatch({ type: 'session/finish' });
          }}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
