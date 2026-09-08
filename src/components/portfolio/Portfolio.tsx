"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  Download,
  Github,
  Linkedin,
  Asterisk,
  ArrowDownLeft,
  Menu,
  MessageCircle,
  Plus,
  X,
} from "lucide-react";
import { projects, awards } from "./content";
import { HangingPortrait } from "./HangingPortrait";
import { PaintedBackground } from "./PaintedBackground";
import { LEADERSHIP_EVENTS } from "../sections/leadership/data";

type Project = (typeof projects)[number];
type Filter = "All work" | "AI & automation" | "Applications";
const filters: Filter[] = ["All work", "AI & automation", "Applications"];
const shortNames = projects.map((p) => p.shortName);
const categories = projects.map((p) => p.category);
const summaries = projects.map((p) => p.summary);
const nav = [
  ["About", "about"],
  ["Experience", "journey"],
  ["Work", "portfolio"],
  ["Playground", "playground"],
];
const email = "tanwaiken552@gmail.com";

function GuideArt({
  className = "",
  eager = false,
}: { className?: string; eager?: boolean }) {
  // The white painted asset blends into its paper surface without a synthetic cutout edge.
  return (
    <img
      className={`guide-art ${className}`}
      src="/art/guide.webp"
      alt=""
      width="480"
      height="721"
      loading={eager ? "eager" : "lazy"}
      draggable="false"
    />
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className="tags" aria-label="Technologies">
      {tags.map((tag) => (
        <li key={tag}>{tag}</li>
      ))}
    </ul>
  );
}

function ProjectLinks({ project }: { project: Project }) {
  if (project.extraLinks && project.extraLinks.length > 0) {
    return (
      <div className="project-links">
        {project.extraLinks.map((link, index) => (
          <a
            key={link.label}
            className={index === 0 ? "button primary" : "text-link"}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.icon === "github" ? (
              <Github size={16} />
            ) : (
              <ArrowUpRight size={16} />
            )}
            {link.label}
            <span className="sr-only"> (opens a new tab)</span>
          </a>
        ))}
      </div>
    );
  }

  const label =
    project.demo.includes("youtu.be") || project.demo.includes("drive.google.com")
      ? "Watch demo"
      : project.demo.includes("linkedin")
        ? "View walkthrough"
        : "Live link";

  return (
    <div className="project-links">
      <a
        className="button primary"
        href={project.demo}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
        <ArrowUpRight size={16} />
        <span className="sr-only"> (opens a new tab)</span>
      </a>
      <a
        className="text-link"
        href={project.github}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Github size={16} />
        {project.github === "https://github.com/TanWaiKen"
          ? "GitHub profile"
          : "Source code"}
        <span className="sr-only"> (opens a new tab)</span>
      </a>
    </div>
  );
}

export default function Portfolio() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [filter, setFilter] = useState<Filter>("All work");
  const [selected, setSelected] = useState<number | null>(null);
  const [awardTab, setAwardTab] = useState("Achievements & Competitions");
  const [guideResponse, setGuideResponse] = useState(
    "Hi, I’m the little guide around here. Pick a question and I’ll help you explore Ken’s world.",
  );
  const [wave, setWave] = useState(0);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [widgetHidden, setWidgetHidden] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [activeNav, setActiveNav] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const widgetButton = useRef<HTMLButtonElement>(null);
  const widgetPanel = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const featuredRef = useRef<HTMLButtonElement>(null);
  const tiltFrame = useRef<number | null>(null);
  const tiltBounds = useRef<DOMRect | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      setWidgetHidden(sessionStorage.getItem("ken-guide-hidden") === "yes");
    } catch {
      /* Private storage is optional. */
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
      },
      { threshold: 0.08 },
    );
    // Start content visible in server HTML. Only enhance elements below the viewport.
    document
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((element) => {
        if (
          element.getBoundingClientRect().top > window.innerHeight &&
          !matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
          element.classList.add("reveal-pending");
          observer.observe(element);
        }
      });
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActiveNav(entry.target.id);
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    ["home", "contact", ...nav.map(([, id]) => id)].forEach((id) => {
      const node = document.getElementById(id);
      if (node) sectionObserver.observe(node);
    });
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenu((open) => {
          if (open) menuButton.current?.focus();
          return false;
        });
        setWidgetOpen((open) => {
          if (open) widgetButton.current?.focus();
          return false;
        });
      }
    };
    const reset = () => {
      if (tiltFrame.current) cancelAnimationFrame(tiltFrame.current);
      tiltBounds.current = null;
      if (featuredRef.current) featuredRef.current.style.transform = "";
    };
    const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
    const pointerPreference = matchMedia("(hover: hover) and (pointer: fine)");
    motionPreference.addEventListener("change", reset);
    pointerPreference.addEventListener("change", reset);
    window.addEventListener("resize", reset);
    window.addEventListener("keydown", onEscape);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    return () => {
      observer.disconnect();
      sectionObserver.disconnect();
      window.removeEventListener("keydown", onEscape);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
      motionPreference.removeEventListener("change", reset);
      pointerPreference.removeEventListener("change", reset);
      window.removeEventListener("resize", reset);
      if (tiltFrame.current) cancelAnimationFrame(tiltFrame.current);
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  useEffect(() => {
    if (selected !== null) {
      dialogRef.current?.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [selected]);

  useEffect(() => {
    if (widgetOpen) widgetPanel.current?.focus();
  }, [widgetOpen]);

  function openProject(index: number) {
    returnFocus.current = document.activeElement as HTMLElement;
    setSelected(index);
  }
  function closeProject() {
    dialogRef.current?.close();
    setSelected(null);
    returnFocus.current?.focus();
  }
  function tilt(event: PointerEvent<HTMLButtonElement>) {
    if (
      event.pointerType !== "mouse" ||
      !matchMedia("(hover: hover) and (pointer: fine)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const target = event.currentTarget;
    const bounds =
      tiltBounds.current ??
      (tiltBounds.current = target.getBoundingClientRect());
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 3;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * -3;
    if (tiltFrame.current) cancelAnimationFrame(tiltFrame.current);
    tiltFrame.current = requestAnimationFrame(() => {
      target.style.transform = `perspective(1100px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
  }
  function resetTilt() {
    if (tiltFrame.current) cancelAnimationFrame(tiltFrame.current);
    tiltBounds.current = null;
    if (featuredRef.current) featuredRef.current.style.transform = "";
  }
  function askGuide(topic: "work" | "about" | "hello") {
    setWave((value) => value + 1);
    setGuideResponse(
      topic === "work"
        ? "Start with JusAds for an AI workflow, Invoice → Excel for automation, or VPet for something playful. Each project has notes and a link to explore further."
        : topic === "about"
          ? "Ken focuses on AI workflows and backend integrations. His journey includes APU’s AI Club, hackathons, and business system operations at U Mobile."
          : "Hello, fellow curious human! I’m a small painted companion with a notebook full of shortcuts. There’s plenty to explore here.",
    );
  }
  function goTo(id: string) {
    setWidgetOpen(false);
    setMobileMenu(false);
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    document.getElementById(`${id}-heading`)?.focus({ preventScroll: true });
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setCopyMessage("Email address copied.");
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => {
        setCopied(false);
        setCopyMessage("");
      }, 3000);
    } catch {
      setCopyMessage(`Please copy the address manually: ${email}`);
    }
  }
  function dismissGuide() {
    setWidgetHidden(true);
    setWidgetOpen(false);
    try {
      sessionStorage.setItem("ken-guide-hidden", "yes");
    } catch {
      /* Keep dismissal working without storage. */
    }
  }
  function restoreGuide() {
    setWidgetHidden(false);
    setWidgetOpen(true);
    try {
      sessionStorage.removeItem("ken-guide-hidden");
    } catch {
      /* Optional preference. */
    }
  }

  const featuredIndex = projects.findIndex((p) => p.featured || p.shortName === "JusAds");
  const visibleProjects = projects
    .map((project, index) => ({ project, index }))
    .filter(
      ({ index }) => filter === "All work" || categories[index] === filter,
    );
  const gallery = visibleProjects.filter(({ index }) => index !== featuredIndex);
  const shownAwards = awards.filter((award) => award.category === awardTab);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Tan Wai Ken, home">
          <span className="monogram">k.</span>
          <span>
            Tan Wai Ken<span className="wordmark-dot">.</span>
          </span>
        </a>
        <nav
          className="desktop-nav"
          aria-label="Main navigation"
          data-role="nav"
          data-height-px="76"
          data-single-line="true"
        >
          {nav.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={activeNav === id ? "location" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <a className="button header-contact" href="#contact">
          Let’s talk <ArrowUpRight size={15} />
        </a>
        <button
          className="icon-button menu-toggle"
          ref={menuButton}
          aria-label={mobileMenu ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileMenu}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <X /> : <Menu />}
        </button>
        {mobileMenu && (
          <nav
            className="mobile-nav"
            id="mobile-navigation"
            aria-label="Mobile navigation"
          >
            {[...nav, ["Contact", "contact"]].map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setMobileMenu(false)}>
                {label}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </nav>
        )}
      </header>

      <main id="main">
        <section className="hero" id="home" data-layout="hero">
          <img
            className="hero-paint"
            src="/art/landscape.webp"
            alt=""
            width="1536"
            height="1024"
            fetchPriority="high"
          />
            <div className="hero-content">
            <p className="hero-intro">
              <Asterisk
                className="small-star"
                aria-hidden="true"
                size={24}
                strokeWidth={1.4}
              />{" "}
              Hello World! I’m
            </p>
            <h1>
              Tan Wai Ken<span className="ink-dot">.</span>
            </h1>
            <p className="hero-role">AI & Backend Engineer</p>
            <p className="hero-description" data-role="hero-subtext">
              I build AI-powered workflows and backend systems, connecting
              data from ingestion to insight. Based in Malaysia, always
              learning through building.
            </p>
            <div className="hero-actions">
              <div className="peek-action">
                <div className="peek-window" aria-hidden="true">
                  <GuideArt eager />
                </div>
                <a className="button primary" href="#portfolio">
                  Explore my work <ArrowDown size={16} />
                </a>
              </div>
              <a className="button" href="/Tan_Wai_Ken_CV.pdf" download>
                My résumé <Download size={16} />
              </a>
            </div>
            <div className="hero-socials">
              <a href="https://github.com/TanWaiKen" target="_blank" rel="noopener noreferrer"><Github size={18} /> GitHub</a>
              <a href="#contact"><MessageCircle size={18} /> Let’s connect</a>
            </div>
          </div>
          <HangingPortrait />
          <div className="hero-bottom">
            <span>Based in Malaysia</span>
            <span className="hero-note">AI workflows · Backend integrations · Applications</span>
            <a href="#about" aria-label="Read about Ken">
              <ArrowDown size={19} />
            </a>
          </div>
        </section>

        <PaintedBackground />
        <section className="about-section" id="about" data-layout="split">
          <div className="section-wrap about-layout" data-reveal>
            <figure className="about-photo">
              <img src="/ken_without_bg.JPG" alt="Ken smiling at a university event" width="719" height="892" loading="lazy" />
              <figcaption>Ken, beyond the keyboard.<span>Curious about technology. Happiest building with people.</span></figcaption>
            </figure>
            <div className="about-copy">
              <p className="eyebrow" data-role="eyebrow">
                THE PERSON BEHIND THE PROJECTS
              </p>
              <h2 id="about-heading" tabIndex={-1}>
                About me.
              </h2>
              <p>
                Hello! I’m Ken, an engineer focused on designing and building
                AI-powered workflows, architecture, and backend integrations
                that connect data from ingestion to insight.
              </p>
              <p>
                I love translating ideas into working applications. Taking part
                in national and international hackathons has shaped how I
                approach problem-solving and collaborate under pressure.
              </p>
              <p className="about-belief">
                Growth happens beyond the screen, too. I enjoy sharing what
                I’ve learned with the APU AI community.
              </p>
              <a className="text-link" href="/Tan_Wai_Ken_CV.pdf" download>
                A little more about me <Download size={16} />
              </a>
              <a className="text-link profile-link" href="https://www.linkedin.com/in/tan-wai-ken-92005b266/" target="_blank" rel="noopener noreferrer"><Linkedin size={16} /> More on LinkedIn <ArrowUpRight size={16} /></a>
            </div>
          </div>
          <div className="section-wrap about-details">
            <div className="background-panel">
              <h3>Education</h3>
              <dl><div><dt>Degree</dt><dd>BSc (Hons) in Artificial Intelligence</dd></div>
              <div><dt>University</dt><dd>Asia Pacific University of Technology and Innovation</dd></div>
              <div><dt>Graduation</dt><dd>2025</dd></div><div><dt>CGPA</dt><dd>3.8+ / 4.00</dd></div></dl>
            </div>
            <div className="background-panel">
              <h3>Languages</h3>
              <dl><div><dt>English</dt><dd>Bilingual</dd></div><div><dt>Chinese</dt><dd>Native</dd></div><div><dt>Malay</dt><dd>Conversational</dd></div><div><dt>Cantonese</dt><dd>Beginner</dd></div></dl>
            </div>
          </div>
        </section>

        <section
          className="journey-section section-wrap"
          id="journey"
          data-layout="timeline"
        >
          <div className="section-heading" data-reveal>
            <div>
              <h2 id="journey-heading" tabIndex={-1}>
                Experience & leadership.
              </h2>
            </div>
            <p>
              Professional experience and community roles.
              <br />The teams I’ve worked with and contributed to.
            </p>
          </div>
          <div className="journey-grid" data-reveal>
            <div className="experience-list">
              {[
                {
                  organization: "U Mobile",
                  role: "Business System Operation · Intern",
                  period: "Jul 2025 – Nov 2025",
                  highlights: [
                    "Assisted in business system operations, monitoring, and maintenance.",
                    "Collaborated across teams to improve operational efficiency and system reliability.",
                  ],
                },
                ...LEADERSHIP_EVENTS,
              ].map((item, index) => (
                <details
                  className="journey-item"
                  key={item.role}
                  open={index === 0}
                >
                  <summary>
                    <span className="timeline-dot" />
                    <span>
                      <span className="period">{item.period}</span>
                      <strong>{item.role}</strong>
                      <span className="organization">{item.organization}</span>
                    </span>
                    <Plus className="details-plus" size={18} />
                  </summary>
                  <ul>
                    {item.highlights.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
            <aside className="toolbox">
              <span className="toolbox-title">
                IN MY TOOLBOX <ArrowDownLeft aria-hidden="true" size={27} />
              </span>
              <h3>
                Tools for
                <br />
                <em>making things.</em>
              </h3>
              {[
                [
                  "AI & DATA",
                  "Python · PyTorch · Hugging Face · LangChain · RAG · AI Agents · n8n · MCP · Pandas · Scikit-Learn · XAI",
                ],
                [
                  "APPLICATIONS",
                  "React · Vue.js · TypeScript · Node.js · Flutter · REST APIs",
                ],
                [
                  "SYSTEMS",
                  "PostgreSQL · MySQL · MongoDB · Firebase · Docker · AWS · Azure · GCP · Git / CI/CD",
                ],
              ].map(([title, text]) => (
                <div className="tool-group" key={title}>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>

        <section
          className="work-section section-wrap"
          id="portfolio"
          data-layout="gallery"
        >
          <div className="section-heading" data-reveal>
            <div>
              <p className="eyebrow" data-role="eyebrow">
                A FEW THINGS I’VE BUILT
              </p>
              <h2 id="portfolio-heading" tabIndex={-1}>
                Selected projects<span className="ink-dot">.</span>
              </h2>
            </div>
            <p>
              Applications, AI systems, and hackathon projects.
              <br />Explore the implementation and source code.
            </p>
          </div>
          <div className="filter-bar" role="group" aria-label="Filter projects">
            {filters.map((item) => (
              <button
                key={item}
                aria-pressed={filter === item}
                onClick={() => {
                  setFilter(item);
                  resetTilt();
                }}
              >
                {item}
                <span>
                  {item === "All work"
                    ? 6
                    : categories.filter((c) => c === item).length}
                </span>
              </button>
            ))}
            <p className="sr-only" role="status">
              Showing {visibleProjects.length} projects
            </p>
          </div>
          {visibleProjects.some(({ index }) => index === featuredIndex) && (
            <article className="featured-project">
              <div className="featured-copy">
                <span className="project-kicker">
                  <Asterisk aria-hidden="true" size={19} strokeWidth={1.4} /> IN
                  FOCUS · AI ENGINEERING
                </span>
                <h3>
                  JusAds
                </h3>
                <p className="project-origin">From a team hackathon idea to my final-year project at APU.</p>
                <p>
                  An AI advertising platform for Southeast Asian markets.
                  It connects multimodal generation, compliance review, and
                  remediation with human approval before distribution.
                </p>
                <dl className="project-engineering">
                  <div><dt>How it grew</dt><dd>I continued the hackathon foundation into an end-to-end platform, shaped by conversations with people in retail, technical trades, and marketing.</dd></div>
                  <div><dt>Workflow</dt><dd>Brief → generate → review → remediate → approve</dd></div>
                  <div><dt>Architecture</dt><dd>LangGraph agents, FastAPI streaming APIs, and a React frontend.</dd></div>
                </dl>
                <TagList tags={["LangGraph", "FastAPI", "React", "Gemini"]} />
                <button className="text-link" onClick={() => openProject(featuredIndex)}>
                  Explore JusAds <ArrowUpRight size={17} />
                </button>
                <a className="text-link featured-source" href="https://github.com/TanWaiKen/JusAds" target="_blank" rel="noopener noreferrer"><Github size={17} /> Source code <span className="sr-only">(opens a new tab)</span></a>
                <a className="text-link project-story" href="https://www.linkedin.com/feed/update/urn:li:activity:7493363353176924160/" target="_blank" rel="noopener noreferrer">Read the project story <ArrowUpRight size={16} /></a>
                <span className="feature-caption">
                  JusAds / AI-powered advertising
                </span>
              </div>
              <div className="featured-stage">
                <button
                  ref={featuredRef}
                  className="artwork-frame"
                  aria-label="Open JusAds project notes"
                  onClick={() => openProject(featuredIndex)}
                  onPointerMove={tilt}
                  onPointerLeave={resetTilt}
                  onBlur={resetTilt}
                >
                  <div className="browser-bar" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <p>JusAds / project preview</p>
                  </div>
                  <img
                    src="/jus_ads.png"
                    alt="JusAds advertising platform project preview"
                    width="1200"
                    height="675"
                    loading="lazy"
                  />
                  <span className="artwork-open">
                    <ArrowUpRight size={22} />
                  </span>
                </button>
                <span className="handwritten">
                  Generation, review, and human editorial control.
                </span>
              </div>
            </article>
          )}
          <div className="project-grid" key={filter}>
            {gallery.map(({ project, index }, position) => (
              <article
                key={project.title}
                className={`project-card tone-${index} ${gallery.length % 2 === 1 && position === gallery.length - 1 ? "project-wide" : ""}`}
              >
                <button
                  className="project-image"
                  onClick={() => openProject(index)}
                  aria-label={`Open ${shortNames[index]} project notes`}
                >
                  <img
                    src={project.image}
                    alt={`${shortNames[index]} project preview`}
                    width="900"
                    height="550"
                    loading="lazy"
                  />
                  <span className="image-arrow">
                    <ArrowUpRight size={21} />
                  </span>
                </button>
                <div className="project-info">
                  <div className="project-title">
                    <h3>
                      <button onClick={() => openProject(index)}>
                        {shortNames[index]}
                      </button>
                    </h3>
                    <span>
                      {categories[index] === "Applications"
                        ? "APPLICATION"
                        : "AI EXPLORATION"}
                    </span>
                  </div>
                  <p>{summaries[index]}</p>
                  <TagList tags={project.tags} />
                  <button
                    className="text-link project-note-link"
                    onClick={() => openProject(index)}
                  >
                    Project notes <Plus size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <noscript>
          <div className="no-script-projects section-wrap">
            <h3>Explore the projects</h3>
            <p>
              Interactive notes need JavaScript. You can still open every
              project below.
            </p>
            {projects.map((project, index) => (
              <div key={project.title}>
                <strong>{shortNames[index]}</strong>
                <ProjectLinks project={project} />
              </div>
            ))}
          </div>
        </noscript>
        <section
          className="recognition-section section-wrap"
          id="recognition"
          data-layout="list"
          data-reveal
        >
          <div className="recognition-heading">
            <h2>Achievements & certifications.</h2>
            <span className="handwritten">Competitions and continued learning.</span>
          </div>
          <div
            className="filter-bar award-filters"
            role="group"
            aria-label="Recognition category"
          >
            {["Achievements & Competitions", "Certifications & Training"].map(
              (category) => (
                <button
                  key={category}
                  aria-pressed={awardTab === category}
                  onClick={() => setAwardTab(category)}
                >
                  {category === "Achievements & Competitions"
                    ? "Competitions"
                    : "Learning & certifications"}
                </button>
              ),
            )}
          </div>
          <div className="award-list" key={awardTab}>
            {shownAwards.slice(0, 3).map((award) => (
              <div className="award-row" key={award.id}>
                <span className="award-year">{award.year}</span>
                <h3>{award.issuer}</h3>
                <span>{award.title}</span>
              </div>
            ))}
          </div>
          <details className="more-awards" key={`more-${awardTab}`}>
            <summary>
              See all {shownAwards.length}{" "}
              {awardTab === "Achievements & Competitions"
                ? "competition milestones"
                : "certifications"}
              <ChevronDown size={16} />
            </summary>
            <div className="award-list">
              {shownAwards.slice(3).map((award) => (
                <div className="award-row" key={award.id}>
                  <span className="award-year">{award.year}</span>
                  <h3>{award.issuer}</h3>
                  <span>{award.title}</span>
                </div>
              ))}
            </div>
          </details>
        </section>

        <section
          className="playground-section"
          id="playground"
          data-layout="interactive"
        >
          <div className="section-wrap playground-layout">
            <div className="playground-copy">
              <p className="eyebrow" data-role="eyebrow">
                A SMALL BREAK FROM THE SERIOUS STUFF
              </p>
              <h2 id="playground-heading" tabIndex={-1}>
                Every portfolio needs
                <br />
                <em>a little character.</em>
              </h2>
              <p>
                This one has a painted companion with a curious mind and a
                notebook full of shortcuts. Say hello, or let her show you
                around.
              </p>
              <div className="playground-actions">
                <button className="button" onClick={() => askGuide("hello")}>
                  Say hello <MessageCircle size={16} />
                </button>
                <button className="text-link" onClick={restoreGuide}>
                  Open the little guide <ArrowUpRight size={16} />
                </button>
              </div>
              <p className="guide-disclosure">
                A playful guide with prepared answers about this portfolio.
              </p>
            </div>
            <div className="character-stage">
              <span className="painted-sun" aria-hidden="true" />
              <div className="character-figure" key={wave} data-wave={wave > 0}>
                <GuideArt />
              </div>
              <span className="character-caption handwritten">
                Your curious little companion
              </span>
            </div>
            <div className="guide-conversation">
              <div className="guide-response" role="status" aria-live="polite">
                {guideResponse}
              </div>
              <div className="guide-prompts">
                <button onClick={() => askGuide("work")}>
                  Where should I start? <ArrowUpRight size={14} />
                </button>
                <button onClick={() => askGuide("about")}>
                  What does Ken do? <ArrowUpRight size={14} />
                </button>
                <button onClick={() => goTo("portfolio")}>
                  Take me to the projects <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          className="contact-section section-wrap"
          id="contact"
          data-layout="full"
          data-reveal
        >
          <div className="contact-top">
            <Asterisk
              className="small-star"
              aria-hidden="true"
              size={24}
              strokeWidth={1.4}
            />
          </div>
          <h2 id="contact-heading" tabIndex={-1}>
            Something on your mind?
            <br />
            <em>Let’s make it real.</em>
          </h2>
          <div className="contact-bottom">
            <div>
              <p>
                A project, an interesting idea, or just a hello.
                <br />
                I’d love to hear from you.
              </p>
              <div className="email-row">
                <a href={`mailto:${email}`}>{email}</a>
                <button
                  className="icon-button copy-button"
                  onClick={copyEmail}
                  aria-label={copied ? "Email copied" : "Copy email address"}
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
              <p className="copy-status" role="status">
                {copyMessage}
              </p>
            </div>
            <a className="button primary contact-cta" href={`mailto:${email}`}>
              Let’s start a conversation <ArrowUpRight size={19} />
            </a>
          </div>
          <div className="contact-links">
            <a
              className="text-link"
              href="https://www.linkedin.com/in/tan-wai-ken-92005b266"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} />
            </a>
            <a
              className="text-link"
              href="https://github.com/TanWaiKen"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={16} /> GitHub <ArrowUpRight size={14} />
            </a>
            <a className="text-link" href="tel:0198876422">
              Call me <ArrowUpRight size={14} />
            </a>
            <a className="text-link" href="/Tan_Wai_Ken_CV.pdf" download>
              Résumé <Download size={14} />
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer section-wrap">
        <a className="wordmark" href="#home">
          <span className="monogram">k.</span>
          <span>Made with care & curiosity.</span>
        </a>
        <span>© {new Date().getFullYear()} Tan Wai Ken</span>
        <a className="back-top" href="#home">
          Back to top <ArrowUp size={16} />
        </a>
      </footer>

      {!widgetHidden && (
        <aside className="guide-widget" aria-label="Portfolio guide">
          {widgetOpen && (
            <div
              id="guide-panel"
              className="guide-panel"
              ref={widgetPanel}
              tabIndex={-1}
              role="region"
              aria-label="Guide shortcuts"
            >
              <div className="guide-panel-heading">
                <strong>A little help?</strong>
                <button
                  className="icon-button"
                  onClick={() => {
                    setWidgetOpen(false);
                    widgetButton.current?.focus();
                  }}
                  aria-label="Close guide"
                >
                  <X size={18} />
                </button>
              </div>
              <p>I know a few good places to start.</p>
              <button onClick={() => goTo("portfolio")}>
                Explore the projects <ArrowRight size={16} />
              </button>
              <button onClick={() => goTo("about")}>
                Meet Ken <ArrowRight size={16} />
              </button>
              <button onClick={() => goTo("contact")}>
                Get in touch <ArrowRight size={16} />
              </button>
              <a href="/Tan_Wai_Ken_CV.pdf" download>
                Grab the résumé <Download size={16} />
              </a>
              <button className="dismiss-guide" onClick={dismissGuide}>
                Hide guide for this visit
              </button>
            </div>
          )}
          <button
            ref={widgetButton}
            className="guide-launcher"
            aria-label={
              widgetOpen ? "Close portfolio guide" : "Open portfolio guide"
            }
            onClick={() => setWidgetOpen(!widgetOpen)}
            aria-expanded={widgetOpen}
            aria-controls="guide-panel"
          >
            <span className="launcher-portrait">
              <GuideArt />
            </span>
            <span>{widgetOpen ? "Close guide" : "Need a hand?"}</span>
            {widgetOpen ? <X size={15} /> : <MessageCircle size={15} />}
          </button>
        </aside>
      )}

      <dialog
        ref={dialogRef}
        className="project-dialog"
        aria-labelledby="project-dialog-title"
        onCancel={(event) => {
          event.preventDefault();
          closeProject();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeProject();
        }}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(
              'button, a[href], [tabindex="0"]',
            ),
          );
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
      >
        {selected !== null && (
          <div className="dialog-content">
            <button
              className="icon-button dialog-close"
              autoFocus
              onClick={closeProject}
              aria-label="Close project notes"
            >
              <X size={21} />
            </button>
            <div className={`dialog-art tone-${selected}`}>
              <img
                src={projects[selected].image}
                alt={`${shortNames[selected]} project preview`}
                width="1000"
                height="600"
              />
            </div>
            <div className="dialog-copy">
              <span className="project-kicker">PROJECT NOTEBOOK</span>
              <h2 id="project-dialog-title">{shortNames[selected]}</h2>
              <p>{projects[selected].description}</p>
              <TagList tags={projects[selected].tags} />
              <div className="guide-note">
                <div className="note-portrait">
                  <GuideArt />
                </div>
                <p>
                  <strong>A note from your guide</strong>
                  {summaries[selected]}
                </p>
              </div>
              <ProjectLinks project={projects[selected]} />
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
