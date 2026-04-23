import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const base = '/aliona-app/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png', 'icons/maskable-512.png'],
      manifest: {
        name: 'Офлайн-читалка Алёны',
        short_name: 'Алёна Reader',
        description: 'Полностью локальная офлайн-читалка с хранением книг прямо на устройстве.',
        theme_color: '#0b0d12',
        background_color: '#0b0d12',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/aliona-app/#/',
        scope: '/aliona-app/',
        lang: 'ru',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: '/aliona-app/index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,ico,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'CacheFirst',
            options: {
              cacheName: 'app-shell'
            }
          }
        ]
      }
    })
  ],
  build: {
    sourcemap: false
  }
});
