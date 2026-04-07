import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import sirv from 'sirv';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      tailwindcss(),
      {
        name: 'serve-admin-folder',
        configureServer(server) {
          server.middlewares.use('/admin', sirv(path.resolve(__dirname, '../admin'), { dev: true, single: false }));
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      rollupOptions: {
        input: {
          root: path.resolve(__dirname, 'index.html'),
          main: path.resolve(__dirname, 'pages/index.html'),
          menu: path.resolve(__dirname, 'pages/menu.html'),
          reservations: path.resolve(__dirname, 'pages/reservations.html'),
          login: path.resolve(__dirname, 'pages/login.html'),
          register: path.resolve(__dirname, 'pages/register.html'),
          profile: path.resolve(__dirname, 'pages/profile.html'),
          cart: path.resolve(__dirname, 'pages/cart.html'),
        },
      },
    },
  };
});
