import { Suspense } from 'react';
import { Route, Routes } from 'react-router';
import { Posts } from './components/posts/view.tsx';
import { useSession } from './impl/context/session.tsx';
import { SignIn } from './components/sign-in/view.tsx';
import { Show } from './components/show/view.tsx';
import { CreatePost } from './components/create-post/view.tsx';

export function App() {
  const { state: { user } } = useSession();
  if (!user) {
    return <SignIn />
  }
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <p>Welcome {user.name} ({user.email})</p>
      <Routes>
        <Route index path="/" element={<Posts />} />
        <Route path="posts/new" element={<CreatePost />} />
        <Route path="posts/:id" element={<Show />} />
      </Routes>
    </Suspense>
  )
}