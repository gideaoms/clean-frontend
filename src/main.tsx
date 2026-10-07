import '@total-typescript/ts-reset';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { App } from './app.tsx';
import { ProviderProvider } from './impl/context/provider.tsx';
import { RepositoryProvider } from './impl/context/repository.tsx';
import { SessionProvider } from './impl/context/session.tsx';

const client = new QueryClient();

// biome-ignore lint/style/noNonNullAssertion: root element exists
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <ProviderProvider>
          <RepositoryProvider>
            <SessionProvider>
              <App />
            </SessionProvider>
          </RepositoryProvider>
        </ProviderProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
