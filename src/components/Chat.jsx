import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowUp, MessageSquare, RotateCcw } from 'lucide-react';
import './chat.css';
const greeting={role:'assistant',content:'Hi, I’m Bharadwaj’s portfolio assistant. What would you like to know about his work?'};
const prompts=['What has he built?','Tell me about his leadership','Does he work with React?'];
export function Chat({onBusyChange}) {
  const [messages,setMessages]=useState([greeting]);
  const [query,setQuery]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [failedQuestion,setFailedQuestion]=useState('');
  const [mode,setMode]=useState('loading');
  const log=useRef();const input=useRef();const controller=useRef();const inFlight=useRef(false);
  useEffect(()=>{const abort=new AbortController();fetch('/api/chat',{signal:abort.signal}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(d=>setMode(d.mode)).catch(()=>setMode('unavailable'));return()=>{abort.abort();controller.current?.abort();};},[]);
  useEffect(()=>{if(log.current)log.current.scrollTop=log.current.scrollHeight;},[messages,busy,error]);
  async function send(question,retry=false){
    question=question.trim();if(!question || inFlight.current)return;
    inFlight.current=true;setBusy(true);onBusyChange?.(true);setError('');setFailedQuestion('');setQuery('');
    const next=retry?messages:[...messages,{role:'user',content:question}];
    setMessages(next);controller.current=new AbortController();
    const timeout=setTimeout(()=>controller.current.abort(),30000);
    try{
      const history=next.slice(1).slice(-8).map(m=>({role:m.role,content:m.content.slice(0,4000)}));
      const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history}),signal:controller.current.signal});
      const data=await response.json().catch(()=>({error:'The assistant is temporarily unavailable.'}));
      if(!response.ok || typeof data.text!=='string' || !data.text.trim())throw new Error(data.error || 'The assistant returned an empty answer. Please try again.');
      setMode(data.mode);setMessages([...next,{role:'assistant',content:data.text}]);
    }catch(e){setError(e.name==='AbortError'?'That took too long. Please try again.':e.message);setFailedQuestion(question);}
    finally{clearTimeout(timeout);inFlight.current=false;setBusy(false);onBusyChange?.(false);input.current?.focus();}
  }
  return <div className="chat-panel">
    <div className="chat-header"><span className="chat-avatar"><MessageSquare size={20}/></span><div><h3>Bharadwaj’s assistant</h3><span className="chat-mode"><i className="status-dot"/>{mode==='ai'?'AI conversation':mode==='profile'?'Profile guide · AI connection pending':mode==='loading'?'Connecting…':'Connection unavailable'}</span></div><button className="icon-button" aria-label="Start a new conversation" disabled={busy || messages.length===1} onClick={()=>{setMessages([greeting]);setError('');setFailedQuestion('');setQuery('');input.current?.focus();}}><RotateCcw size={16}/></button></div>
    <div ref={log} className="chat-messages" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text" aria-busy={busy}>
      {messages.map((m,i)=><div className={`chat-message ${m.role}`} key={i}><span className="message-label">{m.role==='user'?'YOU':'BR / ASSISTANT'}</span><div className="message-content"><ReactMarkdown components={{a:({node,...props})=><a {...props} target="_blank" rel="noopener noreferrer"/>}}>{m.content}</ReactMarkdown></div></div>)}
      {busy && <div className="chat-thinking" role="status"><span/><span/><span/><span className="sr-only">Thinking…</span></div>}
    </div>
    {messages.length===1 && <div className="chat-prompts">{prompts.map(p=><button key={p} disabled={busy} onClick={()=>send(p)}>{p}<span>↗</span></button>)}</div>}
    {error && <div className="chat-error" role="alert"><span>{error}</span><button disabled={busy} onClick={()=>send(failedQuestion,true)}>Retry</button></div>}
    <form className="chat-form" onSubmit={e=>{e.preventDefault();send(query);}}><label className="sr-only" htmlFor="chat-question">Ask about Bharadwaj</label><textarea ref={input} id="chat-question" rows={2} maxLength={1000} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ask about my work, skills, or projects…" onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();send(query);}}}/><button type="submit" aria-label="Send message" disabled={busy || !query.trim()}><ArrowUp size={20}/></button></form>
    <p className="chat-footnote">{mode==='profile'?'Answers from this portfolio. AI conversation is not connected yet.':'AI answers may be imperfect. Confirm important details directly.'}</p>
  </div>;
}
