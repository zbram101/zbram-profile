import { useState } from 'react';
import { Calendar, Copy, Check, ArrowUpRight } from 'lucide-react';
import { profile } from '../profile';

export function MeetingCard({ card }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const options = card.scheduling || {};
  return <div className="meeting-card">
    <div className="agent-card-heading"><Calendar size={18}/><strong>{card.title}</strong><span>Draft · not sent</span></div>
    <p className="meeting-draft">{card.draft}</p>
    <div className="agent-card-actions">
      <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(card.draft); setCopied(true); setCopyError(false); } catch { setCopyError(true); } }}>{copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? 'Copied' : 'Copy message'}</button>
      <a href={options.contactUrl || profile.linkedin} target="_blank" rel="noopener noreferrer">Open LinkedIn <ArrowUpRight size={15}/></a>
    </div>
    <p className="meeting-note" role="status">{copyError ? 'Select the message above and copy it manually.' : 'Copy your message, then send it on LinkedIn. Bharadwaj will need to confirm a time.'}</p>
    {options.bookingUrl && <a className="meeting-booking-link" href={options.bookingUrl} target="_blank" rel="noopener noreferrer">Choose a time on the booking page <ArrowUpRight size={16}/></a>}
  </div>;
}
