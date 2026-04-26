import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/legendary-blacksmith/',
  plugins: [react()],
})
