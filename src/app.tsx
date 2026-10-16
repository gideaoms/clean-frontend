import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router';
import { RepositoryProvider } from './impl/context/repository.tsx';
import { ServiceProvider } from './impl/context/service.tsx';
import { SessionProvider } from './impl/context/session.tsx';
import { Layout } from './layout.tsx';

const client = new QueryClient();

export function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <ServiceProvider>
            <RepositoryProvider>
              <SessionProvider>
                <Layout />
              </SessionProvider>
            </RepositoryProvider>
          </ServiceProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Suspense>
  );
}
