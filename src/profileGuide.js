import { profile, projectAnswer } from './profile.js';

function roleAnswer(job) {
  return `**${job.role}${job.additionalRole ? ` / ${job.additionalRole}` : ''}**, ${job.company} (${job.period})\n\n${job.description}\n\n`
    + job.responsibilities.map(item => `- ${item}`).join('\n')
    + (job.previousRoles || []).map(role => `\n\n**${role.role}** (${role.period})\n\n${role.responsibilities.map(item => `- ${item}`).join('\n')}`).join('');
}

export function profileAnswer(question) {
  const q = question.toLowerCase();
  const asksAboutSkills = /skill|tool|stack|language|capabilit|expertise/.test(q);
  if (/citizen|visa|available|availability|salary|phone|email/.test(q)) return `That information isn’t listed in the portfolio. Please connect with Bharadwaj on [LinkedIn](${profile.linkedin}) for the latest details.`;
  if (/resume|résumé|\bcv\b/.test(q)) return `Download Bharadwaj’s [portfolio resume PDF](${profile.resume}).`;
  if (/education|certificate|credential|berkeley|degree|university/.test(q)) return profile.education.map(item => `**${item.title}**\n\n${item.institution} · ${item.period}${item.credential ? `\n\n[View credential](${item.credential})` : ''}`).join('\n\n');
  if (/open.source|contribut|autogen|\bmhs\b|model hardware standard/.test(q)) return profile.contributions.map(item => `**${item.title}** · ${item.kind} · ${item.status}\n\n${item.description}${item.link ? `\n\n[View contribution](${item.link})` : ''}`).join('\n\n');
  if (/achievement|impact|revenue|accuracy|saving|licensing|e&o/.test(q)) return profile.achievements.map(item => `- **${item.value} — ${item.title}:** ${item.description}`).join('\n');
  const project = projectAnswer(q);
  if (project) return project;
  const job = profile.workExp.find(item => [item.company, ...(item.aliases || [])].some(name => q.includes(name.toLowerCase())));
  if (job) return roleAnswer(job);
  if (/lead|team|manag|current|latest role|today|\bai\b|\bmcp\b|\brag\b|agent/.test(q) && !asksAboutSkills) return roleAnswer(profile.workExp[0]);
  if (/react|frontend|front.end|angular|javascript|typescript/.test(q)) return 'Yes — Bharadwaj’s portfolio includes React, Angular, JavaScript, and TypeScript. At Kaiser Permanente, he built Angular components and services, developed AEM components, and collaborated with product managers and designers.';
  if (/project|build|built|skirmesh|fiji|bot/.test(q)) return 'His projects include:\n\n' + profile.projects.map(p => `- **${p.title}:** ${p.description.replace(/\.$/, '')}.`).join('\n');
  if (asksAboutSkills || /python|sql|aws|backend|grafana|observability|entra|azure ad|identity|kubernetes/.test(q)) return 'His leadership and technical capabilities include:\n\n' + profile.skills.map(s => `**${s.title}**\n${s.skills.map(i => `- **${i.name}:** ${i.description}.`).join('\n')}`).join('\n\n');
  if (/experience|career|work|background|about|who/.test(q)) return `${profile.summary}\n\n` + profile.workExp.map(j => `- **${j.role}${j.additionalRole ? ` / ${j.additionalRole}` : ''}**, ${j.company} (${j.period}).`).join('\n');
  if (/contact|connect|hire|linkedin|github|hello|hi\b/.test(q)) return `You can connect with Bharadwaj on [LinkedIn](${profile.linkedin}) or explore his code on [GitHub](${profile.github}). You can also ask here about his experience, skills, or projects.`;
  return 'I can help with Bharadwaj’s experience, skills, projects, and contact links. Ask me about one of those topics.';
}
