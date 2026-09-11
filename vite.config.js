import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { chatMiddleware } from './server/vite-chat.js';
export default defineConfig(({mode}) => {
  const env={...loadEnv(mode,process.cwd(),''),...process.env};
  return {
    plugins:[react(),{name:'portfolio-chat',configureServer(server){server.middlewares.use(chatMiddleware(env));},configurePreviewServer(server){server.middlewares.use(chatMiddleware(env));}}],
    build:{outDir:'dist',rollupOptions:{input:{main:resolve(process.cwd(),'index.html'),blog:resolve(process.cwd(),'blog/index.html'),dataAgent:resolve(process.cwd(),'blog/data-agent-feedback-openai-feature/index.html'),astra:resolve(process.cwd(),'blog/astra-the-good-and-the-bad/index.html'),goloadout:resolve(process.cwd(),'blog/goloadout-architecture-goals-and-plans/index.html')}}},
  };
});
