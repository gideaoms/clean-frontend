import { useContainer } from './container.tsx';

export function SignIn() {
  const { state, dispatch } = useContainer();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Sign in</h1>
        <input
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={state.email}
          onChange={(e) =>
            dispatch({ type: 'set_email', payload: e.target.value })
          }
          placeholder="Email"
        />
        <input
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={state.password}
          onChange={(e) =>
            dispatch({ type: 'set_password', payload: e.target.value })
          }
          placeholder="Password"
        />
        <button
          type="button"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 w-full"
          onClick={() => dispatch({ type: 'sign_in/request' })}
        >
          Sign In
        </button>
        {state.error ? (
          <p className="text-sm text-red-600">{state.error.message}</p>
        ) : null}
      </div>
    </div>
  );
}
