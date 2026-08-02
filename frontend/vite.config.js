import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  server: {
    historyApiFallback: true,
  },
  build: {
    outDir: "dist",
    target: "esnext",
    minify: "esbuild",
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-motion": ["framer-motion"],
          "vendor-icons": ["lucide-react", "react-icons"],
          "vendor-3d": ["three", "ogl"],
          "vendor-utils": ["axios", "sweetalert2"],
        },
      },
    },
  },
});
