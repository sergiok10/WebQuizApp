import { defineConfig } from "vite";
import { loadEnv } from 'vite';
import react from "@vitejs/plugin-react";

// Notice the ({ mode }) destructuring here
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  console.log('Backend URL:', env.VITE_BACKEND_URL);

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, "/api"),
        }
      }
    }
  }
});