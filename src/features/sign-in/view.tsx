import { useForm } from './form.ts';

export function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Form />
    </div>
  );
}

function Form() {
  const form = useForm();

  return (
    <form
      className="w-full max-w-sm space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      action={form.action}
    >
      <h1 className="text-xl font-semibold text-gray-900">Sign in</h1>
      <input
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        defaultValue={form.state.user.email}
        placeholder="Email"
        name="email"
        type="email"
        required
      />
      <input
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        placeholder="Password"
        name="password"
        type="password"
        defaultValue={form.state.user.password}
        required
      />
      {form.state.err ? (
        <div className="bg-red-100 border border-red-400 p-2 rounded-md">
          <p className="text-sm text-red-600">{form.state.err.message}</p>
        </div>
      ) : null}
      <button
        className="w-full cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        type="submit"
        disabled={form.isPending}
      >
        {form.isPending ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
}
