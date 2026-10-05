import { Suspense } from 'react';
import { Link } from 'react-router';
import { useContainer } from './container.tsx';

export function CreatePost() {
  return (
    <Suspense fallback={<Skeleton />}>
      <Form />
    </Suspense>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div className="h-7 w-28 rounded bg-gray-200" />
      <div className="h-9 rounded-md bg-gray-200" />
      <div className="h-32 rounded-md bg-gray-200" />
      <div className="h-9 rounded-md bg-gray-200" />
      <div className="h-9 w-28 rounded-md bg-gray-200" />
    </div>
  );
}

function Form() {
  const { state, dispatch } = useContainer();

  return (
    <form
      className="space-y-4 rounded-lg border border-gray-200 bg-white p-6"
      onSubmit={(e) => dispatch({ type: 'create_post/request', payload: e })}
    >
      <h1 className="text-xl font-semibold">New post</h1>
      <input
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={state.title}
        onChange={(e) =>
          dispatch({ type: 'set_title', payload: e.target.value })
        }
        placeholder="Title"
        required
      />
      <textarea
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-32"
        value={state.body}
        onChange={(e) =>
          dispatch({ type: 'set_body', payload: e.target.value })
        }
        placeholder="Body"
        required
      />
      <select
        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={state.reviewerId}
        onChange={(e) =>
          dispatch({ type: 'set_reviewer', payload: e.target.value })
        }
      >
        <option value="">No reviewer</option>
        {state.reviewers.map((it) => (
          <option key={it.id} value={it.id}>
            {it.name}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-4">
        <button
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={state.isPending}
        >
          {state.isPending ? 'Saving...' : 'Save'}
        </button>
        <Link
          to="/"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Back
        </Link>
      </div>
      {state.error ? (
        <p className="text-sm text-red-600">{state.error.message}</p>
      ) : null}
    </form>
  );
}
