import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/AI-resume-Analyzer/',
  server: {
    port: 5173,
  },
})
