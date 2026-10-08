import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
// import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // babel({ presets: [reactCompilerPreset()] }),
    babel({}),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
