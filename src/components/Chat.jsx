import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { ArrowUp, MessageSquare, RotateCcw, Calendar, ArrowUpRight, Square } from 'lucide-react';
import { chatApiUrl } from '../analytics';
import { chatRequest, pollAgent } from '../agentClient';
import { MeetingCard } from './MeetingCard';
import './chat.css';

const greeting = { role: 'assistant', content: 'Hi, I’m Bharadwaj’s assistant. I can help you explore his work, compare his experience with a role, or prepare to arrange a conversation.' };
const prompts = ['Find relevant AI projects', 'Explore GitHub projects', 'What did he build at Thermo?'];

function SourceCards({ cards = [] }) {
  return <div className="agent-cards">{cards.map(card => card.type === 'meeting' ? <MeetingCard key={card.id} card={card}/> : card.type === 'source' ? <a className="agent-source-card" key={card.id} href={card.url} target={card.url.startsWith('/') ? undefined : '_blank'} rel="noopener noreferrer"><span>{card.kind}</span><strong>{card.title}<ArrowUpRight size={15}/></strong><p>{card.summary}</p></a> : null)}</div>;
}

export function Chat({ onBusyChange }) {
  const [messages, setMessages] = useState([greeting]);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('loading');
  const [liveCards, setLiveCards] = useState([]);
  const log = useRef();
  const input = useRef();
  const controller = useRef();
  const inFlight = useRef(false);
  const sessionToken = useRef(null);
  const meetingContext = useRef(null);
  const pending = useRef(null);
  const stopped = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    const abort = new AbortController();
    fetch(chatApiUrl, { signal: abort.signal }).then(response => {
      if (!response.ok) throw new Error();
      return response.json();
    }).then(data => { setMode(data.mode); }).catch(error => { if (error.name !== 'AbortError') setMode('unavailable'); });
    return () => { mounted.current = false; abort.abort(); controller.current?.abort(); };
  }, []);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages, busy, error, liveCards]);

  async function send(question, retry = false) {
    question = question.trim();
    if (!question || inFlight.current || (pending.current && !retry)) return;
    inFlight.current = true; stopped.current = false; setBusy(true); onBusyChange?.(true); setError(''); setQuery(''); setLiveCards([]);
    const next = retry ? messages : [...messages, { role: 'user', content: question }];
    setMessages(next);
    controller.current = new AbortController();
    pending.current ||= { question, requestId: crypto.randomUUID(), submitted: false };
    const signal = controller.current.signal;
    setProgress(mode === 'agent' ? 'Starting your request…' : 'Thinking…');
    try {
      let data;
      if (mode === 'agent') {
        if (!sessionToken.current) {
          // Session creation has no provider retry guarantee. An uncertain
          // response must not silently resubmit the first paid model turn.
          pending.current.createUncertain = true;
          data = await chatRequest(chatApiUrl, { action: 'create', message: question, requestId: pending.current.requestId }, signal);
          sessionToken.current = data.sessionToken;
          pending.current.submitted = true;
          pending.current.createUncertain = false;
        }
        if (!pending.current.submitted) {
          await chatRequest(chatApiUrl, { action: 'message', message: question, requestId: pending.current.requestId, sessionToken: sessionToken.current }, signal);
          pending.current.submitted = true;
        }
        data = await pollAgent({ url: chatApiUrl, sessionToken: sessionToken.current, signal, onProgress: data => { setProgress(data.progress || 'Working…'); setLiveCards(data.cards || []); } });
        sessionToken.current = data.sessionToken;
      } else {
        const history = next.slice(1).slice(-8).map(message => ({ role: message.role, content: message.content.slice(0, 4000) }));
        data = await chatRequest(chatApiUrl, { messages: history, ...(mode === 'profile' ? { meetingContext: meetingContext.current } : {}) }, signal);
      }
      if (typeof data.text !== 'string' || !data.text.trim()) throw new Error('The assistant returned an empty answer. Please try again.');
      if (mode === 'profile') meetingContext.current = data.meetingContext || null;
      setMessages(current => [...current, { role: 'assistant', content: data.text, cards: data.cards || [] }]);
      pending.current = null;
    } catch (error) {
      if (!mounted.current) return;
      if (stopped.current && sessionToken.current) {
        setProgress('Stopping…');
        try {
          const cleanup = new AbortController();
          controller.current = cleanup;
          await chatRequest(chatApiUrl, { action: 'cancel', sessionToken: sessionToken.current }, cleanup.signal);
          const result = await pollAgent({ url: chatApiUrl, sessionToken: sessionToken.current, signal: cleanup.signal, onProgress: () => {} });
          sessionToken.current = result.sessionToken;
          setMessages(current => [...current, { role: 'assistant', content: result.text, cards: result.cards || [] }]);
          pending.current = null;
        } catch { setError('Could not confirm that the request stopped. Retry to check it, or start a new conversation.'); }
      } else setError(pending.current?.createUncertain ? 'Could not confirm that this conversation started. Use Start over to begin a new one.' : error.name === 'AbortError' ? 'The request was interrupted. Retry to continue it.' : error.message);
    } finally {
      inFlight.current = false;
      if (mounted.current) { setBusy(false); setLiveCards([]); onBusyChange?.(false); input.current?.focus(); }
    }
  }

  async function reset() {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError(''); setProgress('Deleting this conversation…');
    try {
      if (sessionToken.current) await chatRequest(chatApiUrl, { action: 'reset', sessionToken: sessionToken.current }, new AbortController().signal);
      sessionToken.current = null; pending.current = null; meetingContext.current = null;
      setMessages([greeting]); setQuery(''); setLiveCards([]);
    } catch (error) { setError(error.message); }
    finally { inFlight.current = false; setBusy(false); input.current?.focus(); }
  }
  const modeLabel = mode === 'agent' ? 'Portfolio agent' : mode === 'ai' ? 'AI conversation' : mode === 'profile' ? 'Portfolio guide' : mode === 'loading' ? 'Connecting…' : 'Connection unavailable';
  const chatDisabled = busy || Boolean(pending.current) || ['loading', 'unavailable'].includes(mode);
  return <div className="chat-panel">
    <div className="chat-header"><span className="chat-avatar"><MessageSquare size={20}/></span><div><h3>Bharadwaj’s assistant</h3><span className="chat-mode"><i className="status-dot"/>{modeLabel}</span></div><button className="icon-button" aria-label="Delete this conversation and start a new one" title="Delete conversation and start over" disabled={busy || (messages.length === 1 && !sessionToken.current)} onClick={reset}><RotateCcw size={16}/></button></div>
    <div className="chat-task-bar" aria-label="Things the assistant can help with">
      <button type="button" disabled={chatDisabled} onClick={() => send('I’d like to arrange a time to talk with Bharadwaj.')}><Calendar size={15}/> Arrange a conversation</button>
      {mode === 'agent' && <button type="button" disabled={chatDisabled} onClick={() => { setQuery('Compare Bharadwaj’s experience with this role:\n\n'); input.current?.focus(); }}>Compare a role <ArrowUpRight size={15}/></button>}
    </div>
    <div ref={log} className="chat-messages" role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions text" aria-busy={busy}>
      {messages.map((message, index) => <div className={`chat-message ${message.role}`} key={index}><span className="message-label">{message.role === 'user' ? 'YOU' : 'BR / ASSISTANT'}</span><div className="message-content"><ReactMarkdown components={{ a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer"/> }}>{message.content}</ReactMarkdown></div><SourceCards cards={message.cards}/></div>)}
      {busy && <div className="agent-progress" role="status"><span className="chat-thinking" aria-hidden="true"><span/><span/><span/></span><span>{progress}</span>{mode === 'agent' && pending.current?.submitted && <button type="button" onClick={() => { stopped.current = true; controller.current?.abort(); }} aria-label="Stop current request"><Square size={12}/> Stop</button>}</div>}
      {busy && <SourceCards cards={liveCards}/>}
    </div>
    {messages.length === 1 && <div className="chat-prompts">{prompts.map(prompt => <button key={prompt} disabled={chatDisabled} onClick={() => send(prompt)}>{prompt}<span>↗</span></button>)}</div>}
    {error && <div className="chat-error" role="alert"><span>{error}</span>{pending.current && !pending.current.createUncertain && <button disabled={busy} onClick={() => send(pending.current.question, true)}>Retry</button>}</div>}
    <form className="chat-form" onSubmit={event => { event.preventDefault(); send(query); }}><label className="sr-only" htmlFor="chat-question">Ask about Bharadwaj or arrange a conversation</label><textarea ref={input} id="chat-question" disabled={chatDisabled} rows={2} maxLength={mode === 'agent' ? 8000 : 1000} value={query} onChange={event => setQuery(event.target.value)} placeholder="Explore my work or plan a conversation…" onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(query); } }}/><button type="submit" aria-label="Send message" disabled={chatDisabled || !query.trim()}><ArrowUp size={20}/></button></form>
    <p className="chat-footnote">{mode === 'agent' ? 'AI conversations are processed and stored by OpenAI. Start over deletes this session. Meeting drafts are not sent automatically.' : mode === 'profile' ? 'Portfolio facts and public GitHub sources. Meeting drafts are not sent automatically.' : 'Confirm important details directly. Meeting requests need confirmation.'}</p>
  </div>;
}
