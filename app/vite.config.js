import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// In GitHub Actions, VITE_BASE is set to /<repo-name>/
// Locally it defaults to / so dev server works without changes
const base = process.env.VITE_BASE || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Читай с Котиком',
        short_name: 'КотикЧитает',
        description: 'Приложение для обучения чтению по-русски',
        theme_color: '#FF9EBC',
        background_color: '#FFF0F5',
        display: 'standalone',
        orientation: 'any',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
})
