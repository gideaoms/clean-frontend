import { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { CreatePost } from './components/create-post/view.tsx';
import { Posts } from './components/posts/view.tsx';
import { Show } from './components/show/view.tsx';
import { SignIn } from './components/sign-in/view.tsx';
import { useSession } from './impl/context/session.tsx';

export function App() {
  const { state } = useSession();
  if (!state.user) {
    return <SignIn />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-2xl px-4 py-3 text-sm text-gray-600">
          Welcome{' '}
          <span className="font-medium text-gray-900">{state.user.name}</span> (
          {state.user.email})
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-6">
        <Suspense
          fallback={<p className="text-sm text-gray-500">Loading...</p>}
        >
          <Routes>
            <Route index path="/" element={<Posts />} />
            <Route path="posts/new" element={<CreatePost />} />
            <Route path="posts/:id" element={<Show />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
