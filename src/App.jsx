import { lazy, Suspense, useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDown, Github, Linkedin, Code2, Layers, MessageSquare, Menu, X } from 'lucide-react';
import { workExp, skills, projects } from './profile';
import { recordVisit } from './analytics';
import ProjectVisual from './components/ProjectVisual';
import './components/experience.css';
const CharacterStage = lazy(() => import('./components/CharacterStage'));
const Chat = lazy(() => import('./components/Chat').then(m => ({default:m.Chat})));
const sections = ['about', 'skills', 'experience', 'projects', 'contact'];
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
      <a className="wordmark" href="#about" aria-label="Bharadwaj home">br<span>.</span><small>ENGINEER & BUILDER</small></a>
      <button className="menu-toggle icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="navigation" aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
      <nav id="navigation" className={menuOpen ? 'navigation open' : 'navigation'} aria-label="Main navigation"><a href="/blog/" onClick={() => setMenuOpen(false)}>Writing <ArrowUpRight size={16}/></a>{sections.map((id, i) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)} className={active === id ? 'active' : ''} aria-current={active === id ? 'location' : undefined}>{labels[i]}{i === 4 && <ArrowUpRight size={16}/>}</a>)}</nav>
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
          <p className="hero-description">I’m Bharadwaj Ramachandran. An engineering leader building enterprise AI at Thermo Fisher Scientific, with 12+ years of turning real-world problems into useful software.</p>
          <div className="button-row"><a className="button primary" href="#projects">Explore my work <ArrowUpRight size={19}/></a><a className="button text-button" href="#contact">Meet my AI assistant <MessageSquare size={17}/></a></div>
          <div className="hero-notes"><span><Code2 size={17}/> Enterprise AI & engineering</span><span><Layers size={17}/> Team leadership</span></div>
          <a className="scroll-cue" href="#skills"><ArrowDown size={16}/> A little more about me</a>
        </section>
        <section id="skills" className="section">
          <SectionTitle number="01" label="THE TOOLKIT" title={<>Built on curiosity.<br/>Backed by experience.</>}/>
          <p className="section-intro">From the interface to the infrastructure. The tools I use to bring the pieces together.</p>
          <div className="skill-tabs" role="group" aria-label="Skill categories">{skills.map((item,i) => <button key={item.title} className={skill === i ? 'selected' : ''} aria-pressed={skill === i} onClick={() => setSkill(i)}>{item.title === 'SASS/ERP/Tools' ? 'Platforms & tools' : item.title}</button>)}</div>
          <div className="skill-display"><div className="skill-display-heading"><Code2 size={24}/><span>{skills[skill].title === 'SASS/ERP/Tools' ? 'Platforms & tools' : skills[skill].title}</span><span className="muted">{String(skills[skill].skills.length).padStart(2,'0')} tools</span></div><div className="skill-grid">{skills[skill].skills.map((item,i) => <div className="skill-item" key={item.name}><span className="skill-index">{String(i+1).padStart(2,'0')}</span>{item.name}<span className="skill-plus">+</span></div>)}</div></div>
        </section>
        <section id="experience" className="section">
          <SectionTitle number="02" label="THE JOURNEY" title={<>Building software.<br/>Growing teams.</>}/>
          <p className="section-intro">12+ years across enterprise AI, software engineering, and data. Now leading AI solutions at Thermo Fisher Scientific.</p>
          <div className="timeline">{workExp.map((job,i) => <details key={job.company} className={`experience-item${job.current ? ' current-experience' : ''}`} open={i === 0 ? true : undefined}>
            <summary><span className="company-mark">{job.company.charAt(0)}</span><span className="job-heading"><span className="job-date">{job.period}{job.current && <span className="current-role-label">Current role</span>}</span><h3>{job.role}</h3>{job.additionalRole && <span className="additional-role">{job.additionalRole}</span>}<span className="company-name">{job.company}</span></span><span className="details-plus">+</span></summary>
            <div className="experience-details"><p className="job-description">{job.description}</p>{job.highlights && <dl className="experience-highlights">{job.highlights.map(item => <div key={item.label}><dt>{item.value}</dt><dd>{item.label}</dd></div>)}</dl>}<ul>{job.responsibilities.map(item => <li key={item}>{item}</li>)}</ul></div>
          </details>)}</div>
        </section>
        <section id="projects" className="section">
          <SectionTitle number="03" label="SELECTED WORK" title={<>Ideas out of my head.<br/>Into the world.</>}/>
          <p className="section-intro">A few things I’ve helped build, rethink, and bring to life.</p>
          <div className="project-grid">{projects.map((project,i) => <article className={`project-card project-${i}`} key={project.title}>
            <ProjectVisual type={project.visual}/>
            <div className="project-body"><div className="project-category">{project.category}<span>{String(i+1).padStart(2,'0')}</span></div><h3>{project.title}</h3><p>{project.description}</p>{project.title === "trytherapy.ai" && <span className="project-status">{project.status}</span>}{project.accomplishments.length > 0 && <details className="project-details"><summary>Behind the project <span>+</span></summary><ul>{project.accomplishments.map(item => <li key={item}>{item}</li>)}</ul></details>}{project.link ? <a className="project-link" href={project.link} target="_blank" rel="noreferrer">Visit project <ArrowUpRight size={17}/></a> : project.status && <span className="project-status">{project.status}</span>}</div>
          </article>)}</div>
        </section>
        <section id="contact" className="section contact-section">
          <SectionTitle number="04" label="LET’S CONNECT" title={<>A conversation is<br/>a good place to start.</>}/>
          <p className="section-intro">Explore my experience with my assistant, or connect with me directly.</p>
          <div className="social-row"><a href="https://github.com/zbram101" target="_blank" rel="noreferrer"><Github size={18}/> GitHub <ArrowUpRight size={16}/></a><a href="https://linkedin.com/in/bharadwaj-ramachandran-51bb32a3" target="_blank" rel="noreferrer"><Linkedin size={18}/> LinkedIn <ArrowUpRight size={16}/></a></div>
          <Suspense fallback={<p>Loading assistant…</p>}><Chat onBusyChange={setChatBusy}/></Suspense>
        </section>
      </div>
    </main>
    <footer className="footer"><a className="wordmark" href="#about">br<span>.</span></a><span>Made with curiosity. Built by Bharadwaj. Anonymous visit analytics help improve this site.</span><a href="#about">Back to top ↑</a></footer>
  </>;
}
function SectionTitle({ number, label, title }) { return <><div className="eyebrow"><span className="section-number">{number}</span>{label}</div><h2>{title}</h2></>; }
