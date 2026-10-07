import { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { Comment } from './features/comment/view.tsx';
import { PostForm } from './features/post/view.tsx';
import { Posts } from './features/posts/view.tsx';
import { SignIn } from './features/sign-in/view.tsx';
import { useSession } from './impl/context/session.tsx';

export function App() {
  const { state, dispatch } = useSession();

  if (!state.user) {
    return <SignIn />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3 text-sm text-gray-600">
          <div>
            Welcome{' '}
            <span className="font-medium text-gray-900">{state.user.name}</span>{' '}
            ({state.user.email})
          </div>
          <button
            type="button"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
            onClick={() => dispatch({ type: 'sign_out' })}
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6">
        <Suspense
          fallback={<p className="text-sm text-gray-500">Loading...</p>}
        >
          <Routes>
            <Route index path="/" element={<Posts />} />
            <Route path="posts/new" element={<PostForm />} />
            <Route path="posts/:id" element={<PostForm />} />
            <Route path="comments/new" element={<Comment />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
