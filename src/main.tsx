import '@total-typescript/ts-reset';
import './index.css';
import { createRoot } from 'react-dom/client';
import { App } from './app.tsx';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<App />);
}
