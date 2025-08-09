import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  return {
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  build: {
    // Optimize build for production
    minify: mode === 'production' ? 'esbuild' : false,
    sourcemap: mode !== 'production',
    target: 'es2015', // Better browser compatibility
    rollupOptions: {
      output: {
        // Code splitting for better performance
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['framer-motion', 'lucide-react'],
          admin: ['./src/pages/AdminPage', './src/pages/AdminLoginPage']
        }
      }
    }
  }
  }
})