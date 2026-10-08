import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';
import { Root } from './app/root.tsx';
import { ProviderProvider } from './impl/context/provider.tsx';
import { RepositoryProvider } from './impl/context/repository.tsx';

const client = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <ProviderProvider>
          <RepositoryProvider>
            <Root />
          </RepositoryProvider>
        </ProviderProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
