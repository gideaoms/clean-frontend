import { Suspense, use, useState } from 'react';
import { useProvider } from '../impl/context/provider.tsx';
import { useRepository } from '../impl/context/repository.tsx';
import { SessionProvider } from '../impl/context/session.tsx';
import { ReRender } from '../re-render.tsx';
import { Layout } from './layout.tsx';

const STORAGE_KEY = 'session:user';

export function Root() {
  const [random, setRandom] = useState(Math.random());
  const provider = useProvider();
  const promise = provider.storage.get(STORAGE_KEY);
  return (
    <Suspense fallback={<p>Loading ID...</p>}>
      <ReRender random={random} setRandom={() => setRandom(Math.random())} />
      <Load promise={promise} />
    </Suspense>
  );
}

function Load(props: { promise: Promise<string | null> }) {
  console.log('id promise', props.promise);
  const userId = use(props.promise);
  const repository = useRepository();
  const promise = userId
    ? repository.user.findOne(userId)
    : Promise.resolve(null);
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SessionProvider promise={promise}>
        <Layout />
      </SessionProvider>
    </Suspense>
  );
}
