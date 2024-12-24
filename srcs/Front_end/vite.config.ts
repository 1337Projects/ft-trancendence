import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import checker from 'vite-plugin-checker'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    checker({ typescript : true })
  ],
  server: {
    host: '0.0.0.0',
  },
  resolve : {
    alias : {
      '@' : path.resolve(__dirname, 'src'),
    },
  },
})
