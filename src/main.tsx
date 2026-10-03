import '@total-typescript/ts-reset'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app.tsx'
import { RepositoryProvider } from './impl/context/repository.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from './impl/context/session.tsx'
import { BrowserRouter } from 'react-router'

const client = new QueryClient()

createRoot(document.getElementById('root')!)
  .render(
    <StrictMode>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <SessionProvider>
            <RepositoryProvider>
              <App />
            </RepositoryProvider>
          </SessionProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  )
