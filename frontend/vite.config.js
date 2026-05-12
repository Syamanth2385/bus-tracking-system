import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [react(), viteCompression()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@react-google-maps/api')) return 'maps';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 2000
  }
})
