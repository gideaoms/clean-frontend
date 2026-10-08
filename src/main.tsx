import '@total-typescript/ts-reset';
import './index.css';
import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { App, SessionProvider } from './session.tsx';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <Suspense fallback={<p>Loading...</p>}>
      <SessionProvider>
        <App />
      </SessionProvider>
    </Suspense>,
  );
}
