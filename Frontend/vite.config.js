import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
 server: {
    proxy: {
      // This creates a virtual path on your dev server
      '/api': {
        target: 'https://heartsensee-production.up.railway.app',
        changeOrigin: true,
        secure: true,
        // This rewrites the URL so /api/users becomes /api/v1/users
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  }
})
