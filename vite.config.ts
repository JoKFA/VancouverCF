import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: mode === 'staging' ? '/staging/' : '/',
    server: {
      host: true,
      port: 5173
    },
    define: {
      'import.meta.env.VITE_ADMIN_ENABLED': JSON.stringify(
        process.env.VITE_ADMIN_ENABLED === 'true'
      )
    }
  }
})