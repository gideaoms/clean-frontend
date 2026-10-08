import { Route, Routes } from 'react-router';
import { Header } from '../components/header/header.tsx';
import { Comment } from '../features/comment/view.tsx';
import { PostForm } from '../features/post/view.tsx';
import { Posts } from '../features/posts/view.tsx';
import { SignIn } from '../features/sign-in/view.tsx';
import { useSession } from '../impl/context/session.tsx';

export function Layout() {
  const session = useSession();

  if (!session.user) {
    return <SignIn />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* <Suspense fallback={<p>Loading...</p>}>
        <Test random={random} setRandom={() => setRandom(Math.random())} />
      </Suspense> */}
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <Routes>
          <Route index path="/" element={<Posts />} />
          <Route path="posts/new" element={<PostForm />} />
          <Route path="posts/:id" element={<PostForm />} />
          <Route path="comments/new" element={<Comment />} />
        </Routes>
      </main>
    </div>
  );
}
