import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    build: {
      outDir: 'build', // Matches your Netlify 'Publish directory'
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`
        }
      }
    },
    define: {
      // REPLACE 'PASTE_YOUR_API_KEY_HERE' with your actual key if not using Netlify Env Vars
      'process.env.API_KEY': JSON.stringify(env.API_KEY || 'AIzaSyCufffMT_ZrfELe0aW2n4P2WUxWkFde0kc'),
      
      // Your Google Client ID
      'process.env.GOOGLE_CLIENT_ID': JSON.stringify(env.GOOGLE_CLIENT_ID || '751852165310-5hoflqssgi3kakjhruq5sgse04mbiseq.apps.googleusercontent.com'),
    }
  };
});