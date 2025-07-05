import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  define: {
    // Ensure environment variables are properly defined
    'import.meta.env.VITE_ADMIN_ENABLED': JSON.stringify(
      process.env.VITE_ADMIN_ENABLED || 'true'
    )
  },
  build: {
    // Optimize build for production
    minify: mode === 'production' ? 'esbuild' : false,
    sourcemap: mode !== 'production',
    rollupOptions: {
      output: {
        // Code splitting for better performance
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    }
  }
}))