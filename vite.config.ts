import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load environment variables based on mode
  const env = {
    VITE_ADMIN_ENABLED: process.env.VITE_ADMIN_ENABLED || (mode === 'production' ? 'false' : 'true')
  }

  return {
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  define: {
    // Ensure environment variables are properly defined for all modes
    'import.meta.env.VITE_ADMIN_ENABLED': JSON.stringify(env.VITE_ADMIN_ENABLED)
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