import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/topten/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Top 10 Game',
        short_name: 'Top 10',
        description: 'Interactive Top 10 Trivia Game for two teams',
        theme_color: '#0f172a',
        background_color: '#0a0f1d',
        display: 'standalone',
        icons: [
          {
            src: '/topten/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/topten/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
