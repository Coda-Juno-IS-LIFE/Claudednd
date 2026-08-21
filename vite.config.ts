import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Served from https://<owner>.github.io/Claudednd/ in production (GitHub
  // Pages project site), but from the root during local dev.
  base: command === 'build' ? '/Claudednd/' : '/',
}))
