import { Suspense } from 'react';
import { Posts } from './components/posts.tsx';
import { useSession } from './impl/context/session.tsx';
import { SignIn } from './components/sign-in.tsx';

export function App() {
  const { user } = useSession();
  if (!user) {
    return <SignIn />
  }
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <p>Welcome {user.name} ({user.email})</p>
      <Posts />
    </Suspense>
  )
}