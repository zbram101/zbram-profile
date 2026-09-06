import { handleChat } from './chat.js';
export function chatMiddleware(env) {
  return async (req,res,next) => {
    if(req.url?.split('?')[0] !== '/api/chat') return next();
    try {
      const chunks=[];let size=0;
      for await(const chunk of req){size+=chunk.length;if(size>24000){res.writeHead(413,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Conversation is too long. Start a new chat.'}));return;}chunks.push(chunk);}
      const host=req.headers.host || 'localhost';
      const request=new Request(`http://${host}/api/chat`,{method:req.method,headers:req.headers,...(req.method==='POST'?{body:Buffer.concat(chunks)}:{})});
      const response=await handleChat(request,env);
      res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());
    } catch {res.writeHead(500,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'The assistant is temporarily unavailable.'}));}
  };
}
