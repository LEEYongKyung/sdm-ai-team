import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages는 /sdm-ai-team/ 하위 경로로 서비스되므로 빌드 때 BASE_PATH로 넘겨준다
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [react()]
});
