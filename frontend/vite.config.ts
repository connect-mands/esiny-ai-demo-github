import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  base: '/ai/',
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
})