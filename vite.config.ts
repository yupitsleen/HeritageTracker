import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Heritage Tracker',
        short_name: 'Heritage Tracker',
        description: 'Documenting the destruction of cultural heritage in Gaza (2023-2024)',
        theme_color: '#009639',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: '/HeritageTracker/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/HeritageTracker/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/HeritageTracker/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/tile\.openstreetmap\.org\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'openstreetmap-tiles',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/server\.arcgisonline\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'esri-satellite-tiles',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  // Test configuration moved to vitest.config.ts to avoid build errors
  base: '/HeritageTracker/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - separate large libraries
          'react-vendor': ['react', 'react-dom'],
          'map-vendor': ['leaflet', 'react-leaflet', 'leaflet.heat'],
          'd3-vendor': ['d3', 'd3-scale'],
        }
      }
    },
    chunkSizeWarningLimit: 600 // Suppress warning for 580KB bundle
  }
})
