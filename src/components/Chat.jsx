import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowUp, MessageSquare, RotateCcw } from 'lucide-react';
import { projects, skills, workExp } from '../profile';
import { chatApiUrl } from '../analytics';
import './chat.css';
const greeting={role:'assistant',content:'Hi, I’m Bharadwaj’s portfolio assistant. What would you like to know about his work?'};
const prompts=['What has he built?','Tell me about his leadership','Does he work with React?'];

function profileAnswer(question){
  const q=question.toLowerCase();
  if(/citizen|visa|available|availability|salary|phone|email|current|today/.test(q))return 'That information isn’t listed in the portfolio. Please connect with Bharadwaj on [LinkedIn](https://linkedin.com/in/bharadwaj-ramachandran-51bb32a3) for the latest details.';
  if(/react|frontend|front.end|angular|javascript|typescript/.test(q))return 'Yes — Bharadwaj’s portfolio includes React, Angular, JavaScript, and TypeScript. At Kaiser Permanente, he built responsive web applications, worked on accessible interfaces, and collaborated with product managers and designers.';
  if(/project|build|built|skirmesh|skipped|fiji|bot/.test(q))return 'His projects include:\n\n'+projects.map(p=>`- **${p.title}:** ${p.description}.`).join('\n');
  if(/skill|tool|stack|language|python|sql|aws|backend/.test(q))return 'His toolkit includes:\n\n'+skills.map(s=>`- **${s.title === 'SASS/ERP/Tools' ? 'Platforms & tools' : s.title}:** ${s.skills.map(i=>i.name).join(', ')}.`).join('\n');
  if(/lead|team|globality|manage/.test(q))return 'At **Globality (May 2021–May 2023)**, Bharadwaj was Lead Application Engineer, leading Integrations and Business Applications teams. His work included a bid-proposal evaluation app, NPS reporting, engineering design reviews, roadmaps, and integrations with platforms such as Slack, NetSuite, and Salesforce.';
  if(/experience|career|work|background|about|who|kaiser|anthem/.test(q))return 'Bharadwaj is an engineer and builder whose listed experience includes:\n\n'+workExp.map(j=>`- **${j.role}**, ${j.company} (${j.period}).`).join('\n')+'\n\nHis focus spans software development, enterprise integrations, and engineering leadership.';
  if(/contact|connect|hire|linkedin|github|hello|hi\b/.test(q))return 'You can connect with Bharadwaj on [LinkedIn](https://linkedin.com/in/bharadwaj-ramachandran-51bb32a3) or explore his code on [GitHub](https://github.com/zbram101). You can also ask here about his experience, skills, or projects.';
  return 'I can help with Bharadwaj’s experience, skills, projects, and contact links. Ask me about one of those topics.';
}
export function Chat({onBusyChange}) {
  const [messages,setMessages]=useState([greeting]);
  const [query,setQuery]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [failedQuestion,setFailedQuestion]=useState('');
  const [mode,setMode]=useState(chatApiUrl?'loading':'profile');
  const log=useRef();const input=useRef();const controller=useRef();const inFlight=useRef(false);
  useEffect(()=>{if(!chatApiUrl)return undefined;const abort=new AbortController();fetch(chatApiUrl,{signal:abort.signal}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(d=>setMode(d.mode)).catch(()=>setMode('unavailable'));return()=>{abort.abort();controller.current?.abort();};},[]);
  useEffect(()=>{if(log.current)log.current.scrollTop=log.current.scrollHeight;},[messages,busy,error]);
  async function send(question,retry=false){
    question=question.trim();if(!question || inFlight.current)return;
    inFlight.current=true;setBusy(true);onBusyChange?.(true);setError('');setFailedQuestion('');setQuery('');
    const next=retry?messages:[...messages,{role:'user',content:question}];
    setMessages(next);controller.current=new AbortController();
    const timeout=setTimeout(()=>controller.current.abort(),30000);
    try{
      if(!chatApiUrl){
        setMessages([...next,{role:'assistant',content:profileAnswer(question)}]);
        return;
      }
      const history=next.slice(1).slice(-8).map(m=>({role:m.role,content:m.content.slice(0,4000)}));
      const response=await fetch(chatApiUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history}),signal:controller.current.signal});
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
