import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import {VitePWA} from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: "auto",
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Danyator - the best code editor out there',
        short_name: 'Danyator',
        start_url: '/',
        display: 'standalone',
        theme_color: '#171717',
        icons: [
          {
            src: '/vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-assets',
              expiration: { maxEntries: 50 }
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/monaco-editor/'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'monaco-editor-files',
              expiration: { maxEntries: 20 }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
