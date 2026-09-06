import { handleChat } from './chat.js';
export default {
  async fetch(request, env) {
    if(new URL(request.url).pathname === '/api/chat') return handleChat(request,env);
    return env.ASSETS.fetch(request);
  },
};
