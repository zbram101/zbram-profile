import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { Chat } from "./Chat";
import { currentExpAtom, workExp } from "./WorkExp";
import { currentProjectAtom } from "./Projects";
import { currentSkillAtom, skills } from "./Skills";
import { profile, selectedInitiatives } from "../data/profile";
import { useViewport } from "../hooks/useViewport";
import { useReducedMotionPreference } from "../hooks/useReducedMotionPreference";
import { getMotionPreset } from "../ui/motionPresets";
import { getRailDensity } from "../ui/layoutPresets";

export const Section = ({ children, className = "", motionPreset }) => {
  const safeMotionPreset = motionPreset || getMotionPreset();

  return (
    <motion.section
      className={`section-shell mx-auto flex min-h-[100svh] w-screen max-w-screen-2xl flex-col justify-start overflow-visible px-5 pb-10 pt-24 md:px-8 lg:justify-center lg:px-10 lg:pb-8 lg:pt-10 xl:px-12 ${className}`}
      initial={{ opacity: 0, y: safeMotionPreset.sectionReveal.offsetY }}
      viewport={{ once: true, amount: 0.24 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: safeMotionPreset.sectionReveal.duration,
          delay: safeMotionPreset.sectionReveal.delay,
        },
      }}
    >
      {children}
    </motion.section>
  );
};

const FloatingPanel = ({
  children,
  className = "",
  index = 0,
  motionPreset,
  reducedMotion,
  density = "comfortable",
  motionVariant = "static",
}) => {
  const panelRef = useRef(null);
  const frameRef = useRef(null);
  const pendingRef = useRef({ x: 50, y: 50 });

  useEffect(() => {
    const node = panelRef.current;

    if (!node) {
      return;
    }

    node.style.setProperty("--hover-x", "50%");
    node.style.setProperty("--hover-y", "50%");
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
    node.style.setProperty("--sweep-alpha", `${motionPreset.hover.sweepOpacity}`);
    node.style.setProperty("--hover-lift", `${motionPreset.hover.lift}px`);
    node.style.setProperty("--hover-scale", `${motionPreset.hover.scale}`);
  }, [motionPreset]);

  useEffect(
    () => () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    },
    []
  );

  function updatePointerStyles() {
    const node = panelRef.current;

    if (!node) {
      frameRef.current = null;
      return;
    }

    const { x, y } = pendingRef.current;
    const rotateY = ((x - 50) / 50) * motionPreset.hover.tiltY;
    const rotateX = -((y - 50) / 50) * motionPreset.hover.tiltX;

    node.style.setProperty("--hover-x", `${x.toFixed(2)}%`);
    node.style.setProperty("--hover-y", `${y.toFixed(2)}%`);
    node.style.setProperty("--tilt-x", `${rotateX.toFixed(3)}deg`);
    node.style.setProperty("--tilt-y", `${rotateY.toFixed(3)}deg`);
    frameRef.current = null;
  }

  function handlePointerMove(event) {
    const node = panelRef.current;

    if (!node || reducedMotion || window.matchMedia("(hover: none)").matches) {
      return;
    }

    const rect = node.getBoundingClientRect();
    pendingRef.current = {
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    };

    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(updatePointerStyles);
    }
  }

  function handlePointerLeave() {
    const node = panelRef.current;

    if (!node) {
      return;
    }

    pendingRef.current = { x: 50, y: 50 };
    node.style.setProperty("--hover-x", "50%");
    node.style.setProperty("--hover-y", "50%");
    node.style.setProperty("--tilt-x", "0deg");
    node.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: motionPreset.panelReveal.offsetY,
        scale: motionPreset.panelReveal.scaleFrom,
      }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 16,
        duration: motionPreset.panelReveal.duration,
        delay: index * motionPreset.panelReveal.delayStep,
      }}
    >
      <motion.div
        ref={panelRef}
        className={`${className} hover-elevate panel-density-${density} panel-variant-${motionVariant}`}
        style={{ willChange: "transform" }}
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

async function parseActionResponse(response) {
  const rawPayload = await response.text();

  if (!rawPayload || !rawPayload.trim()) {
    throw new Error("Empty response from server. Please try again.");
  }

  try {
    return JSON.parse(rawPayload);
  } catch {
    throw new Error("The server returned an invalid response.");
  }
}

export const Interface = ({ onSectionChange }) => {
  const { width } = useViewport();
  const reducedMotion = useReducedMotionPreference();
  const motionPreset = getMotionPreset({
    intensity: "medium",
    reducedMotion,
  });
  const density = getRailDensity(width);

  return (
    <div className="flex w-screen flex-col items-center">
      <AboutSection onSectionChange={onSectionChange} motionPreset={motionPreset} reducedMotion={reducedMotion} density={density} />
      <SkillsSection motionPreset={motionPreset} reducedMotion={reducedMotion} density={density} />
      <ExperienceSection motionPreset={motionPreset} reducedMotion={reducedMotion} density={density} />
      <ProjectsSection motionPreset={motionPreset} reducedMotion={reducedMotion} density={density} />
      <ContactSection onSectionChange={onSectionChange} motionPreset={motionPreset} reducedMotion={reducedMotion} density={density} />
      <Chat motionPreset={motionPreset} />
    </div>
  );
};

const AboutSection = ({ onSectionChange, motionPreset, reducedMotion, density }) => {
  return (
    <Section motionPreset={motionPreset}>
      <div className="section-frame section-frame--single">
        <div className="content-rail content-rail--hero">
          <FloatingPanel className="surface-panel space-y-6" index={0} motionPreset={motionPreset} reducedMotion={reducedMotion} density={density}>
            <p className="profile-eyebrow">AI, automation, and software engineering leadership</p>
            <div className="space-y-4">
              <h1 className="profile-hero-title">
                {profile.name}
                <span>{profile.title}</span>
              </h1>
              <p className="profile-lead">{profile.subtitle}</p>
              <p className="profile-body">{profile.heroIntro}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="profile-action profile-action--primary" onClick={() => onSectionChange(5)}>
                Ask the AI briefing
              </button>
              <a className="profile-action" href={profile.resumePath} target="_blank" rel="noreferrer">
                Download resume
              </a>
              <a className="profile-action" href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
            <div className="metric-grid">
              {profile.heroMetrics.map((metric) => (
                <div key={metric.label} className="metric-card">
                  <p className="metric-card__value">{metric.value}</p>
                  <p className="metric-card__label">{metric.label}</p>
                </div>
              ))}
            </div>
            <div className="surface-divider" />
            <div className="surface-grid">
              <div className="surface-subpanel">
                <p className="surface-kicker">Partnership and role focus</p>
                <div className="pill-list pill-list--ink">
                  {profile.targetRoles.map((role) => (
                    <span key={role} className="profile-pill profile-pill--ink">
                      {role}
                    </span>
                  ))}
                </div>
                <div className="surface-divider surface-divider--compact" />
                <p className="surface-kicker">Education</p>
                <div className="surface-stack">
                  <div className="stack-item stack-item--ink">
                    <h3>UC Berkeley Haas</h3>
                    <p>
                      Professional Certificate in Machine Learning and Artificial Intelligence, 2025-2026
                    </p>
                  </div>
                  <div className="stack-item stack-item--ink">
                    <h3>Manav Bharti University</h3>
                    <p>Bachelor of Science in Computer Science, 2008-2012</p>
                  </div>
                </div>
              </div>
              <div className="surface-subpanel">
                <p className="surface-kicker">Leadership pillars</p>
                <div className="surface-stack">
                  {profile.leadershipPillars.map((pillar) => (
                    <div key={pillar.title} className="stack-item stack-item--ink">
                      <h3>{pillar.title}</h3>
                      <p>{pillar.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FloatingPanel>
        </div>
      </div>
    </Section>
  );
};

const SkillsSection = ({ motionPreset, reducedMotion, density }) => {
  const [currentSkillGroup, setCurrentSkillGroup] = useAtom(currentSkillAtom);
  const skillGroup = skills[currentSkillGroup];
  const capability = profile.capabilityHighlights[currentSkillGroup % profile.capabilityHighlights.length];

  return (
    <Section motionPreset={motionPreset}>
      <div className="section-frame section-frame--single">
        <div className="content-rail">
          <FloatingPanel className="surface-panel space-y-6" index={0} motionPreset={motionPreset} reducedMotion={reducedMotion} density={density}>
            <p className="profile-eyebrow">Capability stack</p>
            <h2 className="section-heading">Hands-on depth with manager-level range</h2>
            <p className="profile-body">
              The rotating wheel shows the current capability group without turning the section into
              a keyword wall. It keeps the engineering depth visible while the written story stays
              concise and professional.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                className="profile-action"
                onClick={() => setCurrentSkillGroup((currentSkillGroup - 1 + skills.length) % skills.length)}
              >
                Previous stack
              </button>
              <button
                className="profile-action profile-action--primary"
                onClick={() => setCurrentSkillGroup((currentSkillGroup + 1) % skills.length)}
              >
                Next stack
              </button>
            </div>
            <div className="surface-split">
              <div className="section-card">
                <p className="section-card__eyebrow">Current focus</p>
                <h3 className="section-card__title">{skillGroup.title}</h3>
                <div className="space-y-3 pt-3">
                  {skillGroup.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="mb-1 flex items-center justify-between text-sm text-slate-100">
                        <span>{skill.name}</span>
                        <span>{skill.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <span style={{ width: `${skill.level}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="surface-subpanel surface-subpanel--ink">
                <p className="surface-kicker surface-kicker--ink">Why this matters</p>
                <h3 className="surface-subtitle surface-subtitle--ink">{capability.title}</h3>
                <ul className="detail-list">
                  {capability.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </FloatingPanel>
        </div>
      </div>
    </Section>
  );
};

const ExperienceSection = ({ motionPreset, reducedMotion, density }) => {
  const [currentExperience, setCurrentExperience] = useAtom(currentExpAtom);
  const experience = workExp[currentExperience];

  return (
    <Section motionPreset={motionPreset}>
      <div className="section-frame section-frame--single">
        <div className="content-rail content-rail--wide">
          <FloatingPanel className="surface-panel space-y-5" index={0} motionPreset={motionPreset} reducedMotion={reducedMotion} density={density}>
            <p className="profile-eyebrow">Career arc</p>
            <h2 className="section-heading">Leadership growth grounded in delivery</h2>
            <p className="profile-body">
              The experience selector shows progression from enterprise delivery foundations into
              engineering leadership, platform ownership, and AI-first operating models.
            </p>
            <div className="surface-split">
              <div className="surface-subpanel">
                <p className="surface-kicker">Role sequence</p>
                <div className="timeline-list">
                  {workExp.map((item, index) => (
                    <button
                      key={item.company}
                      className={`timeline-list__item ${index === currentExperience ? "is-active" : ""}`}
                      onClick={() => setCurrentExperience(index)}
                    >
                      <span>{item.company}</span>
                      <small>{item.period}</small>
                    </button>
                  ))}
                </div>
              </div>
              <div className="surface-subpanel surface-subpanel--ink">
                <p className="section-card__eyebrow">{experience.badge}</p>
                <h3 className="section-card__title section-card__title--compact">{experience.company}</h3>
                <p className="section-card__role">{experience.role}</p>
                <p className="section-card__meta">{experience.period}</p>
                <p className="section-card__impact">{experience.impact}</p>
                <p className="section-card__body">{experience.headline}</p>
                <ul className="detail-list">
                  {experience.highlights.slice(0, 4).map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-1">
              <button
                className="profile-action"
                onClick={() => setCurrentExperience((currentExperience - 1 + workExp.length) % workExp.length)}
              >
                Previous role
              </button>
              <button
                className="profile-action profile-action--primary"
                onClick={() => setCurrentExperience((currentExperience + 1) % workExp.length)}
              >
                Next role
              </button>
            </div>
          </FloatingPanel>
        </div>
      </div>
    </Section>
  );
};

const ProjectsSection = ({ motionPreset, reducedMotion, density }) => {
  const [currentProject, setCurrentProject] = useAtom(currentProjectAtom);
  const initiative = selectedInitiatives[currentProject];

  return (
    <Section motionPreset={motionPreset}>
      <div className="section-frame section-frame--single">
        <div className="content-rail content-rail--wide">
          <FloatingPanel className="surface-panel space-y-5" index={0} motionPreset={motionPreset} reducedMotion={reducedMotion} density={density}>
            <p className="profile-eyebrow">Selected impact</p>
            <h2 className="section-heading">Early-stage startups I co-founded and built</h2>
            <p className="profile-body">
              These ventures reflect founder-stage product building across hardware, software, AI,
              and user experience, from concept through early release and traction.
            </p>
            <div className="surface-split">
              <div className="surface-subpanel">
                <p className="surface-kicker">Startup shortlist</p>
                <div className="timeline-list">
                  {selectedInitiatives.map((item, index) => (
                    <button
                      key={item.title}
                      className={`timeline-list__item ${index === currentProject ? "is-active" : ""}`}
                      onClick={() => setCurrentProject(index)}
                    >
                      <span>{item.title}</span>
                      <small>{item.status}</small>
                    </button>
                  ))}
                </div>
              </div>
              <div className="surface-subpanel surface-subpanel--ink">
                <p className="section-card__eyebrow">{initiative.category}</p>
                <h3 className="section-card__title section-card__title--compact">{initiative.title}</h3>
                <p className="section-card__meta">{initiative.status}</p>
                {initiative.link && (
                  <p className="section-card__meta">
                    <a
                      href={initiative.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#9ed7dc] underline underline-offset-2"
                    >
                      {initiative.link}
                    </a>
                  </p>
                )}
                <p className="section-card__impact">{initiative.impact}</p>
                <p className="section-card__body">{initiative.description}</p>
                <ul className="detail-list">
                  {initiative.accomplishments.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </FloatingPanel>
        </div>
      </div>
    </Section>
  );
};

const ContactSection = ({ onSectionChange, motionPreset, reducedMotion, density }) => {
  const [lead, setLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isPhoneUnlocked, setIsPhoneUnlocked] = useState(false);
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [leadSuccess, setLeadSuccess] = useState("");

  function updateLeadField(field, value) {
    setLead((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function submitLead(event) {
    event.preventDefault();
    setLeadError("");
    setLeadSuccess("");

    if (!lead.name.trim() || !lead.email.trim() || !lead.phone.trim()) {
      setLeadError("Name, email, and phone are required to unlock direct phone contact.");
      return;
    }

    setLeadLoading(true);

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lead),
      });

      const payload = await parseActionResponse(response);

      if (!response.ok) {
        throw new Error(payload.error || "Lead submission failed.");
      }

      setIsPhoneUnlocked(true);
      setLeadSuccess("Thanks. Your details were submitted and phone access is now unlocked.");
    } catch (error) {
      setLeadError(error.message || "Lead submission failed.");
    } finally {
      setLeadLoading(false);
    }
  }

  return (
    <Section motionPreset={motionPreset}>
      <div className="section-frame section-frame--single">
        <div className="content-rail content-rail--wide">
          <FloatingPanel className="surface-panel space-y-6" index={0} motionPreset={motionPreset} reducedMotion={reducedMotion} density={density}>
            <p className="profile-eyebrow">Connect</p>
            <h2 className="section-heading">Open to strategic partnerships and aligned leadership scopes</h2>
            <p className="profile-body">{profile.availability}</p>
            <div className="surface-split">
              <div className="section-card">
                <p className="section-card__eyebrow">Reach out</p>
                <div className="contact-grid">
                  <a href={`mailto:${profile.email}`} className="contact-item">
                    <span>Email</span>
                    <strong>{profile.email}</strong>
                  </a>
                  <div className="contact-item contact-item--locked">
                    <span>Phone</span>
                    <strong>{isPhoneUnlocked ? profile.phone : "Locked until lead form is submitted"}</strong>
                  </div>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="contact-item">
                    <span>LinkedIn</span>
                    <strong>View profile</strong>
                  </a>
                  <a href={profile.website} target="_blank" rel="noreferrer" className="contact-item">
                    <span>Location</span>
                    <strong>{profile.location}</strong>
                  </a>
                </div>
                <div className="flex flex-wrap gap-3 pt-4">
                  <a className="profile-action profile-action--primary" href={profile.resumePath} target="_blank" rel="noreferrer">
                    Open resume
                  </a>
                  <button className="profile-action" onClick={() => onSectionChange(5)}>
                    Interview the AI briefing
                  </button>
                </div>
              </div>
              <div className="surface-subpanel">
                <p className="surface-kicker">Collaboration intake form</p>
                <p className="lead-helper">
                  Submit your name, email, and phone to unlock direct phone contact. Your intake is sent by email automatically.
                </p>
                <form className="lead-form" onSubmit={submitLead}>
                  <label className="lead-field">
                    <span>Name</span>
                    <input
                      type="text"
                      value={lead.name}
                      onChange={(event) => updateLeadField("name", event.target.value)}
                      placeholder="Your full name"
                      autoComplete="name"
                    />
                  </label>
                  <label className="lead-field">
                    <span>Email</span>
                    <input
                      type="email"
                      value={lead.email}
                      onChange={(event) => updateLeadField("email", event.target.value)}
                      placeholder="you@company.com"
                      autoComplete="email"
                    />
                  </label>
                  <label className="lead-field">
                    <span>Phone</span>
                    <input
                      type="tel"
                      value={lead.phone}
                      onChange={(event) => updateLeadField("phone", event.target.value)}
                      placeholder="(555) 555-5555"
                      autoComplete="tel"
                    />
                  </label>
                  <label className="lead-field">
                    <span>Company (optional)</span>
                    <input
                      type="text"
                      value={lead.company}
                      onChange={(event) => updateLeadField("company", event.target.value)}
                      placeholder="Company name"
                      autoComplete="organization"
                    />
                  </label>
                  <label className="lead-field">
                    <span>Message (optional)</span>
                    <textarea
                      rows={3}
                      value={lead.message}
                      onChange={(event) => updateLeadField("message", event.target.value)}
                      placeholder="Partnership context, problem space, or hiring timeline"
                    />
                  </label>
                  <button className="profile-action profile-action--primary lead-submit" type="submit" disabled={leadLoading}>
                    {leadLoading ? "Submitting..." : "Submit and unlock phone"}
                  </button>
                </form>
                {leadError && <p className="lead-error">{leadError}</p>}
                {leadSuccess && <p className="lead-success">{leadSuccess}</p>}
              </div>
            </div>
          </FloatingPanel>
        </div>
      </div>
    </Section>
  );
};
