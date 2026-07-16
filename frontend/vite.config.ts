import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      // Allows the Google OAuth popup to communicate back via postMessage
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      // Optional: Often paired with COOP for security
      'Cross-Origin-Embedder-Policy': 'unsafe-none', 
    },
  },
})
