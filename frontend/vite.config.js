import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,   // expose on local network — accessible from phone at http://10.170.125.88:5173
    port: 5173,
  }
})

