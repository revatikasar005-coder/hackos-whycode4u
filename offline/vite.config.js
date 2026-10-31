import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'HackOS Check-in',
        short_name: 'HackOS',
        theme_color: '#0f766e',
        background_color: '#ffffff',
        display: 'standalone',
      },
    }),
  ],
})