import { meetingDraft, schedulingOptions } from './scheduling.js';

// A small guided conversation for the explicitly labeled, no-key portfolio mode.
// This is draft data supplied by the browser, never authority to send or book.
const questions = {
  topic: 'What would you like to discuss with Bharadwaj?',
  timezone: 'What time zone are you in?',
  preferredTimes: 'Are there any dates or times that work well for you? It’s fine to say “I’m flexible.”',
};
const edits = { editTopic: 'topic', editTimezone: 'timezone', editTimes: 'preferredTimes' };
const startsMeeting = text => /\b(meet|meeting|schedule|scheduling|book a|arrange a|set\s*up (a |some )?time|time to (talk|chat)|talk (with|to) (you|him|bharadwaj)|hop on a call)\b/i.test(text);
const isFlexible = text => /^(skip|none|no preference|i[’']?m flexible|flexible|any\s*time)[.!]?$/i.test(text);

export function meetingGuide(message, context, env = {}) {
  if (context != null && (
    typeof context !== 'object' || Array.isArray(context)
    || ![...Object.keys(questions), ...Object.keys(edits), 'review', 'edit'].includes(context.step)
    || Object.keys(context).some(key => !['step', 'topic', 'timezone', 'preferredTimes'].includes(key))
    || ['topic', 'timezone', 'preferredTimes'].some(key => typeof context[key] !== 'string' || context[key].length > 1000)
  )) throw new Error('The meeting conversation could not be read. Start a new conversation.');

  const reply = (text, meetingContext = context, cards = []) => ({ text, meetingContext, cards, mode: 'profile' });
  const draft = details => reply('Here’s a message you can send to Bharadwaj. If you’d like to change the topic, time zone, or preferred times, tell me here.', { ...details, step: 'review' }, meetingDraft(details, env).cards);
  const text = message.trim();
  if (context && /\b(cancel|never\s*mind|stop|forget (it|that))\b/i.test(text)) return reply('No problem. We can leave the meeting request here. What else would you like to know about Bharadwaj?', null);
  if (!context) {
    if (!startsMeeting(text)) return null;
    const options = schedulingOptions(env);
    if (options.bookingUrl) return reply(`You can [choose a time on Bharadwaj’s booking page](${options.bookingUrl}). Your meeting is confirmed after you complete the booking there.${options.details ? `\n\n${options.details}` : ''}`, null);
    return reply(`I can help you put together a message to coordinate a time. ${questions.topic}`, { step: 'topic', topic: '', timezone: '', preferredTimes: '' });
  }
  if (context.step === 'review' || context.step === 'edit') {
    if (/\b(topic|discuss|subject)\b/i.test(text)) return reply('What would you like the discussion to focus on instead?', { ...context, step: 'editTopic' });
    if (/\b(time\s*zone|timezone)\b/i.test(text)) return reply('What time zone should I use instead?', { ...context, step: 'editTimezone' });
    if (/\b(time|date|day|availability|when)\b/i.test(text)) return reply('What dates or times should I include instead?', { ...context, step: 'editTimes' });
    if (/\b(change|update|edit|revise|instead)\b/i.test(text)) return reply('What would you like to change: the topic, your time zone, or preferred times?', { ...context, step: 'edit' });
    // A finished draft does not trap unrelated portfolio questions in scheduling.
    return null;
  }
  const field = edits[context.step] || context.step;
  const updated = { ...context, [field]: field === 'preferredTimes' && isFlexible(text) ? '' : text };
  if (edits[context.step] || field === 'preferredTimes') return draft(updated);
  const nextStep = field === 'topic' ? 'timezone' : 'preferredTimes';
  return reply(questions[nextStep], { ...updated, step: nextStep });
}
