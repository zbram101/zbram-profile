import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDown, Github, Linkedin, Code2, Layers, MessageSquare, Menu, X, FileText } from 'lucide-react';
import { profile, workExp, skills, projects, contributions, education } from './profile';
import { recordVisit } from './analytics';
import ProjectVisual from './components/ProjectVisual';
import './components/experience.css';
const CharacterStage = lazy(() => import('./components/CharacterStage'));
const Chat = lazy(() => import('./components/Chat').then(m => ({default:m.Chat})));
const navigationSections = ['about', 'skills', 'experience', 'projects', 'contact'];
const sections = ['about', 'skills', 'experience', 'projects', 'open-source', 'education', 'contact'];
const labels = ['Intro', 'Skills', 'Experience', 'Projects', 'Let’s talk'];

export default function App() {
  const [active, setActive] = useState('about');
  const [menuOpen, setMenuOpen] = useState(false);
  const [skill, setSkill] = useState(0);
  const [chatBusy, setChatBusy] = useState(false);
  useEffect(() => {
    const update = () => {
      const marker = window.innerHeight * .36;
      const current = sections.filter(id => document.getElementById(id)?.getBoundingClientRect().top <= marker).pop();
      setActive(current || 'about');
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  useEffect(() => { recordVisit(); }, []);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header">
      <a className="wordmark" href="#about" aria-label="Bharadwaj home">br<span>.</span><small>AI & ENGINEERING LEADER</small></a>
      <button className="menu-toggle icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="navigation" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
      <nav id="navigation" className={menuOpen ? 'navigation open' : 'navigation'} aria-label="Main navigation"><a href="/blog/" onClick={() => setMenuOpen(false)}>Writing <ArrowUpRight size={16}/></a>{navigationSections.map((id, i) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined}>{labels[i]}{i === 4 && <ArrowUpRight size={16}/>}</a>)}</nav>
    </header>
    <main id="main" className="page-shell">
      <aside className="character-column" aria-label="Interactive character">
        <div className="character-panel"><div className="stage-topline"><span><i className="status-dot"/> THE HUMAN BEHIND THE CODE</span><span>BR / 3D</span></div>
          <Suspense fallback={<div className="character-fallback"><img src="/images/myavatar.png" alt="Bharadwaj’s character"/><span>Getting ready…</span></div>}><CharacterStage section={active} busy={chatBusy}/></Suspense>
        </div>
      </aside>
      <div className="page-content">
        <section id="about" className="hero section">
          <div className="eyebrow"><span className="little-line"/> HELLO, WORLD. I’M BHARADWAJ.</div>
          <h1>Good ideas.<br/>Thoughtful code.<br/><span>Real impact.</span></h1>
          <p className="hero-description">I’m {profile.name}. {profile.summary}</p>
          <div className="button-row"><a className="button primary" href="#projects">Explore my work <ArrowUpRight size={19}/></a><a className="button text-button" href="#contact">Meet my AI assistant <MessageSquare size={17}/></a><a className="button text-button" href={profile.resume} download><FileText size={17}/> Download resume</a></div>
          <div className="hero-notes"><span><Code2 size={17}/> Enterprise AI & engineering</span><span><Layers size={17}/> Leading eight engineers</span></div>
          <p className="hero-biography">{profile.biography}</p>
          <nav className="profile-jump-links" aria-label="More about Bharadwaj"><a href="#open-source">Open source & technical projects</a><a href="#education">Education</a></nav>
          <a className="scroll-cue" href="#skills"><ArrowDown size={16}/> A little more about me</a>
        </section>
        <section id="skills" className="section">
          <SectionTitle number="01" label="LEADERSHIP & TECHNICAL CAPABILITIES" title={<>Setting direction.<br/>Building capability.</>}/>
          <p className="section-intro">I grow engineering teams, set technical direction, and lead delivery across business groups. These are the capabilities and technologies behind that work.</p>
          <div className="skill-tabs" role="group" aria-label="Skill categories">{skills.map((item,i) => <button key={item.title} className={skill === i ? 'selected' : ''} aria-pressed={skill === i} onClick={() => setSkill(i)}>{item.title}</button>)}</div>
          <div className="skill-display">
            <div className="skill-display-heading"><Code2 size={24}/><span className="skill-display-title">{skills[skill].title}</span><span className="muted">{String(skills[skill].skills.length).padStart(2,'0')} {skills[skill].skills.length === 1 ? 'area' : 'areas'}</span></div>
            <div className="skill-grid">{skills[skill].skills.map((item,i) => <div className="skill-item" key={item.name}><span className="skill-index" aria-hidden="true">{String(i+1).padStart(2,'0')}</span><div className="skill-copy"><span>{item.name}</span><p>{item.description}</p></div><span className="skill-plus" aria-hidden="true">+</span></div>)}</div>
          </div>
        </section>
        <section id="experience" className="section">
          <SectionTitle number="02" label="THE JOURNEY" title={<>Building software.<br/>Growing teams.</>}/>
          <p className="section-intro">12+ years across software engineering, enterprise automation, and data engineering. Now Senior Manager, AI Solutions at Thermo Fisher Scientific.</p>
          <div className="timeline">{workExp.map((job,i) => <details key={job.company} className={`experience-item${job.current ? ' current-experience' : ''}`} open={i === 0 ? true : undefined}>
            <summary><span className="company-mark">{job.company.charAt(0)}</span><span className="job-heading"><span className="job-date">{job.period}{job.current && <span className="current-role-label">Current role</span>}</span><h3>{job.role}</h3>{job.additionalRole && <span className="additional-role">{job.additionalRole}</span>}<span className="company-name">{job.company}</span></span><span className="details-plus">+</span></summary>
            <div className="experience-details"><p className="job-description">{job.description}</p>{job.highlights && <dl className="experience-highlights">{job.highlights.map(item => <div key={item.label}><dt>{item.value}</dt><dd>{item.label}</dd></div>)}</dl>}<ul>{job.responsibilities.map(item => <li key={item}>{item}</li>)}</ul>{job.previousRoles?.map(role => <div className="previous-role" key={role.role}><h4>{role.role}</h4><p className="job-date">{role.period}</p><ul>{role.responsibilities.map(item => <li key={item}>{item}</li>)}</ul></div>)}</div>
          </details>)}</div>
        </section>
        <section id="projects" className="section">
          <SectionTitle number="03" label="SELECTED WORK" title={<>Ideas out of my head.<br/>Into the world.</>}/>
          <p className="section-intro">Independent products and experiments, alongside my enterprise AI work. Explore my open-source contribution and MHS example below.</p>
          <div className="project-grid">{projects.map((project,i) => <article className={`project-card project-${i}`} key={project.title}>
            <ProjectVisual type={project.visual}/>
            <div className="project-body"><div className="project-category">{project.category}<span>{String(i+1).padStart(2,'0')}</span></div><h3>{project.title}</h3><p>{project.description}</p>{project.title === "trytherapy.ai" && <span className="project-status">{project.status}</span>}{project.accomplishments.length > 0 && <details className="project-details"><summary>Behind the project <span>+</span></summary><ul>{project.accomplishments.map(item => <li key={item}>{item}</li>)}</ul></details>}{project.link ? <a className="project-link" href={project.link} target="_blank" rel="noreferrer">Visit project <ArrowUpRight size={17}/></a> : project.status && <span className="project-status">{project.status}</span>}</div>
          </article>)}</div>
        </section>
        <section id="open-source" className="section">
          <SectionTitle number="04" label="OPEN SOURCE & TECHNICAL PROJECTS" title={<>Sharing examples.<br/>Connecting systems.</>}/>
          <div className="background-list">{contributions.map(item => <article className="background-card" key={item.title}><span className="background-kicker">{item.kind} · {item.status}</span><h3>{item.title}</h3><p>{item.description}</p>{item.link && <a className="project-link" href={item.link} target="_blank" rel="noreferrer">View merged contribution <ArrowUpRight size={17}/></a>}</article>)}</div>
        </section>
        <section id="education" className="section">
          <SectionTitle number="05" label="EDUCATION & PROFESSIONAL DEVELOPMENT" title={<>Always building.<br/>Always learning.</>}/>
          <div className="background-list">{education.map(item => <article className="background-card" key={item.title}><span className="background-kicker">{item.period}</span><h3>{item.title}</h3><p>{item.institution}</p>{item.credential && <a className="project-link" href={item.credential} target="_blank" rel="noreferrer">View credential <ArrowUpRight size={17}/></a>}</article>)}</div>
        </section>
        <section id="contact" className="section contact-section">
          <SectionTitle number="06" label="LET’S CONNECT" title={<>A conversation is<br/>a good place to start.</>}/>
          <p className="section-intro">Explore engineering leadership, enterprise AI, or a collaboration. My assistant can help you learn about the work and arrange a conversation.</p>
          <div className="social-row"><a href={profile.github} target="_blank" rel="noreferrer"><Github size={18}/> GitHub <ArrowUpRight size={16}/></a><a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={18}/> LinkedIn <ArrowUpRight size={16}/></a><a href={profile.resume} download><FileText size={18}/> Resume PDF</a></div>
          <Suspense fallback={<p>Loading assistant…</p>}><Chat onBusyChange={setChatBusy}/></Suspense>
        </section>
      </div>
    </main>
    <footer className="footer"><a className="wordmark" href="#about">br<span>.</span></a><span>Made with curiosity. Built by Bharadwaj. Anonymous visit analytics help improve this site.</span><a href="#about">Back to top ↑</a></footer>
  </>;
}
function SectionTitle({ number, label, title }) { return <><div className="eyebrow"><span className="section-number">{number}</span>{label}</div><h2>{title}</h2></>; }
