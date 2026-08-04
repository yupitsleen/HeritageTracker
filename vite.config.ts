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
        name: 'Now & Then: Gaza',
        short_name: 'Now & Then',
        description: "A God's-Eye View of the Genocide in Gaza: Before & After Satellite Imagery",
        theme_color: '#009639',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: '/now-and-then/gaza/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/now-and-then/gaza/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/now-and-then/gaza/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,jpg,jpeg}'],
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
  // Use different base URLs for development vs production
  // In development and E2E tests, use root path. In production (GitHub Pages), use /now-and-then/gaza/
  base: process.env.NODE_ENV === 'production' && !process.env.E2E_TEST ? '/now-and-then/gaza/' : '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - separate large libraries
          'react-vendor': ['react', 'react-dom'],
          'map-vendor': ['leaflet', 'react-leaflet', 'leaflet.heat'],
          'd3-vendor': ['d3'],
        }
      }
    },
    chunkSizeWarningLimit: 600 // Suppress warning for 580KB bundle
  }
})
