// ─────────────────────────────────────────────────────────────────────────────
// Alfred Johnson | Senior Data Engineer & Architect — Portfolio
//
// Quick-edit guide — search "UPDATE:" to jump to every replaceable value.
//
// Section map:
//   SITE DATA    — Copy, links, intro text, skills, projects
//   DOT_COLOR    — Tiny category-dot color tokens (add here if adding categories)
//   useScrollReveal — Shared IntersectionObserver hook for fade-up reveals
//   Navbar       — Fixed, glass-on-scroll, mobile drawer
//   IntroSection — Hero: personal intro, name, CTAs (first thing visitors see)
//   TechStack    — Inline row format: category dot · skills separated by ·
//   Projects     — Card with Problem / Solution / Impact tabs
//   Footer       — Social links, email, resume download
//   App          — Root component
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import {
  Terminal, Layers, Code2, Server, Cloud, Workflow,
  Activity, Shield, Network, Database, Users,
  Github, Linkedin, Mail, Download, FolderOpen,
  Menu, X, ArrowUpRight, Moon, Sun,
} from 'lucide-react'

// ─── SITE DATA ────────────────────────────────────────────────────────────────

// UPDATE: Replace placeholder URLs before deploying
const LINKS = {
  linkedin: 'https://www.linkedin.com/in/alfredjohnsonk/',
  github:   'https://github.com/deepredalfa',
  email:    'hirealfred@gmail.com',
  resume:   'YOUR_RESUME_URL',   // UPDATE: Paste your hosted resume URL here
}

const NAV_ITEMS = [
  { label: 'About',     id: 'about'    },
  { label: 'Skill Set', id: 'stack'    },
  { label: 'Projects',  id: 'projects' },
  { label: 'Contact',   id: 'contact'  },
]

// Words that cycle through the word-flip board in the hero
const FLAP_WORDS = [
  'Databricks',
  'Apache Spark',
  'Delta Lake',
  'Python',
  'PySpark',
  'Dimensional Modeling',
  'Unity Catalog',
  'SQL',
  'Azure Data Lake Storage',
  'Parquet',
  'Azure DevOps'
]

// UPDATE: Personal intro copy
const INTRO = {
  name:  'Alfred Johnson',
  title: 'Senior Data Engineer & Architect',
  // UPDATE: Edit these two bio paragraphs
  bio1:  'Senior Data Engineer with 14 years across fintech, telco, and retail. Lakehouse architecture, Azure Databricks, Delta Lake, Apache Spark — and a strong foundation in API design, event-driven systems, and enterprise integration.',
  bio2:  'Strong coffee. Simple principles.',
  cta1:  'Interesting Works',
  cta2:  'Connect on LinkedIn',
}

const TECH_CATEGORIES = [
  {
    id: 'languages',
    label: 'Languages',
    icon: Terminal,
    accent: 'emerald',
    skills: ['Python (PySpark)', 'SQL', 'Java'],
  },
  {
    id: 'lakehouse',
    label: 'Lakehouse & Compute',
    icon: Layers,
    accent: 'sky',
    skills: ['Azure Databricks', 'Delta Lake', 'Unity Catalog', 'Databricks Workflows', 'Photon Engine', 'Apache Spark'],
  },
  {
    id: 'modeling',
    label: 'Data Modeling',
    icon: Code2,
    accent: 'violet',
    skills: ['Dimensional Modeling (Kimball)', 'Medallion Architecture', 'Slowly Changing Dimensions'],
  },
  {
    id: 'storage',
    label: 'Storage & Formats',
    icon: Server,
    accent: 'amber',
    skills: ['Delta Lake', 'Parquet', 'Avro', 'JSON / XML', 'ADLS Gen2'],
  },
  {
    id: 'cloud',
    label: 'Cloud · Azure',
    icon: Cloud,
    accent: 'blue',
    skills: ['Azure Key Vault', 'Blob Storage / ADLS Gen2', 'Entra ID (RBAC)', 'Azure DevOps'],
  },
  {
    id: 'orchestration',
    label: 'Orchestration & DataOps',
    icon: Workflow,
    accent: 'cyan',
    skills: ['Databricks Workflows', 'Apache Airflow', 'Azure DevOps', 'Jenkins', 'Git'],
  },
  {
    id: 'streaming',
    label: 'Streaming & Messaging',
    icon: Activity,
    accent: 'rose',
    skills: ['Apache Kafka'],
  },
  {
    id: 'governance',
    label: 'Governance & Quality',
    icon: Shield,
    accent: 'green',
    skills: ['Unity Catalog', 'Data Quality Practices', 'SLA Adherence', 'Production Incident Management'],
  },
  {
    id: 'integration',
    label: 'Integration & Backend',
    icon: Network,
    accent: 'indigo',
    skills: ['Mule ESB', 'Spring Boot', 'REST APIs', 'OAuth / OIDC', 'Event-Driven Architecture'],
  },
  {
    id: 'databases',
    label: 'Databases',
    icon: Database,
    accent: 'orange',
    skills: ['PostgreSQL', 'Oracle', 'MySQL', 'Elasticsearch'],
  },
  {
    id: 'leadership',
    label: 'Leadership',
    icon: Users,
    accent: 'teal',
    skills: ['Cross-functional Stakeholder Alignment', 'Technical Mentorship', 'Agile / Scrum (Jira · Confluence)'],
  },
]

// UPDATE: Project content
const PROJECTS = [
  {
    id: 'au-property',
    title: 'AU Property Intelligence Platform',
    subtitle: 'End-to-end Lakehouse pipeline unifying Australian property market data with an AI-powered analytics layer',
    year: '2024',
    tags: ['PySpark', 'Delta Lake', 'dbt', 'Apache Airflow', 'LangChain', 'Claude API', 'Kubernetes', 'MinIO'],
    github: 'https://github.com/deepredalfa/au-property-intelligence',
    tabs: {
      problem: `Australia's property market generates fragmented data across five state governments and multiple federal APIs — auction results, ABS macro-economic indicators, RBA interest rate series — with no unified, analysis-ready foundation. Manual data pulls, schema mismatches, and stale reporting cycles made it impossible to surface timely, trustworthy market intelligence at scale.`,
      solution: `Built a full Medallion Architecture (Bronze → Silver → Gold) on a self-hosted Kubernetes cluster using Apache Spark for distributed processing and MinIO as an S3-compatible Delta Lake store. Apache Airflow with the KubernetesExecutor orchestrates scheduled ingestion and dbt transformation jobs, with data quality gates at every tier. A RAG conversational layer — LangChain, Claude API, and ChromaDB vector embeddings — enables natural-language queries against the property knowledge base. Apache Superset and Streamlit serve BI dashboards and the chat interface.`,
      impact: `Delivers a production-grade analytical foundation processing millions of quarterly property records with full ACID guarantees via Delta Lake time-travel. dbt enforces lineage documentation and automated data quality testing across all models. The AI layer allows non-technical stakeholders to interrogate market trends in plain English — correlating prices with interest rates, migration, and affordability — without writing a single query.`,
    },
  },
]

const PROJECT_TABS       = ['problem', 'solution', 'impact']
const PROJECT_TAB_LABELS = { problem: 'The Problem', solution: 'The Solution', impact: 'The Impact' }

// ─── DOT COLOR MAP ────────────────────────────────────────────────────────────
// Tiny colored dot per skill category — complete static strings for Tailwind purge
const DOT_COLOR = {
  emerald: 'bg-emerald-400',
  sky:     'bg-sky-400',
  violet:  'bg-violet-400',
  amber:   'bg-amber-400',
  blue:    'bg-blue-400',
  cyan:    'bg-cyan-400',
  rose:    'bg-rose-400',
  green:   'bg-green-400',
  indigo:  'bg-indigo-400',
  orange:  'bg-orange-400',
  teal:    'bg-teal-400',
}

// ─── DARK MODE HOOK ───────────────────────────────────────────────────────────
// Reads localStorage + OS preference, toggles .dark on <html>, persists choice.
function useDarkMode() {
  const [dark, setDark] = useState(() =>
    typeof window !== 'undefined' &&
    (localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches))
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return [dark, () => setDark(d => !d)]
}

// ─── SHARED HOOK ─────────────────────────────────────────────────────────────
// Fires once when the observed element enters the viewport, then disconnects.
function useScrollReveal(threshold = 0.08) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return [ref, visible]
}

// ─── WORD-FLIP BOARD ──────────────────────────────────────────────────────────
// Flips the entire word as a single unit using a 3D rotateX CSS animation.
// Fixed card width is set by the longest phrase so the layout never shifts.

function WordFlipBoard({ words }) {
  const [idx, setIdx]     = useState(0)
  const [phase, setPhase] = useState('idle') // 'idle' | 'out' | 'in'
  const nextIdxRef        = useRef(1)

  useEffect(() => {
    if (phase !== 'idle') return
    const t = setTimeout(() => {
      nextIdxRef.current = (idx + 1) % words.length
      setPhase('out')
    }, 1500)
    return () => clearTimeout(t)
  }, [idx, phase, words])

  function handleAnimationEnd() {
    if (phase === 'out') {
      setIdx(nextIdxRef.current)
      setPhase('in')
    } else if (phase === 'in') {
      setPhase('idle')
    }
  }

  const cardClass = [
    'wf-card',
    phase === 'out' && 'wf-out',
    phase === 'in'  && 'wf-in',
  ].filter(Boolean).join(' ')

  return (
    <div className="wf-wrapper" role="status" aria-live="polite" aria-atomic="true">
      <div className={cardClass} onAnimationEnd={handleAnimationEnd}>
        {words[idx]}
      </div>
    </div>
  )
}

// ─── GLOBAL BACKGROUND ────────────────────────────────────────────────────────
// Canvas particle network — dots drift and draw lines to nearby neighbours.
// Colours pulled from the site accent palette (indigo / violet / sky / teal).

const PARTICLE_COLORS = [
  '99,102,241',  // indigo
  '139,92,246',  // violet
  '56,189,248',  // sky
  '45,212,191',  // teal
  '167,139,250', // purple
  '96,165,250',  // blue
]

function GlobalBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId
    let W, H, particles

    const SPEED = 0.35

    function resize() {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }

    function init() {
      const mobile = W < 768
      const COUNT     = mobile ? 35  : 80
      const LINK_DIST = mobile ? 100 : 160
      particles = Array.from({ length: COUNT }, () => ({
        _linkDist: LINK_DIST,
        x:     Math.random() * W,
        y:     Math.random() * H,
        vx:    (Math.random() - 0.5) * SPEED,
        vy:    (Math.random() - 0.5) * SPEED,
        r:     Math.random() * 1.8 + 1.2,
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      }))
    }

    function frame() {
      ctx.clearRect(0, 0, W, H)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > W) p.vx *= -1
        if (p.y < 0 || p.y > H) p.vy *= -1
      }

      // Lines between nearby pairs
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < a._linkDist) {
            const alpha = (1 - dist / a._linkDist) * 0.45
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${a.color},${alpha})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      // Dots
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},0.75)`
        ctx.fill()
      }

      animId = requestAnimationFrame(frame)
    }

    function onResize() { resize(); init() }

    resize()
    init()
    frame()
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 bg-stone-50 dark:bg-[#0a0a18] transition-colors duration-300" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar({ dark, toggleDark }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/40'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-sm text-stone-800 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white transition-colors font-medium"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop: dark toggle + Hire Me */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg border border-white/30 dark:border-slate-600/40 bg-white/10 dark:bg-slate-800/30 text-stone-700 dark:text-stone-300 hover:border-indigo-400/60 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all duration-200"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a
            href={`mailto:${LINKS.email}`}
            className="text-sm px-4 py-2 rounded-lg border border-white/30 dark:border-slate-600/40 bg-white/10 dark:bg-slate-800/30 text-stone-800 dark:text-stone-200 font-medium hover:border-indigo-400/60 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all duration-200"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile: dark toggle + hamburger */}
        <div className="md:hidden flex items-center gap-1">
          <button
            onClick={toggleDark}
            className="p-2 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors"
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="p-2 -mr-2 text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition-colors"
            onClick={() => setDrawerOpen(!drawerOpen)}
            aria-label="Toggle menu"
            aria-expanded={drawerOpen}
          >
            {drawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="md:hidden bg-white/10 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/40">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setDrawerOpen(false)}
                className="text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors py-1"
              >
                {item.label}
              </a>
            ))}
            <a
              href={`mailto:${LINKS.email}`}
              className="text-sm px-4 py-2.5 rounded-lg border border-white/30 dark:border-slate-600/40 bg-white/10 dark:bg-slate-800/30 text-stone-800 dark:text-stone-200 text-center hover:border-indigo-400/60 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all"
            >
              Hire Me
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

// ─── INTRO / HERO ─────────────────────────────────────────────────────────────
// First thing visitors see — personal introduction replaces the old tech headline.

function IntroSection() {
  return (
    <section id="about" className="relative min-h-screen flex items-center overflow-hidden bg-transparent">

      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 w-full">

        {/* Greeting — sits close to the name so they read as one natural intro */}
        <p className="text-stone-600 dark:text-stone-400 text-lg font-light mb-2">Hi, I'm</p>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-stone-900 dark:text-stone-50 tracking-tight leading-[1.06] mb-5">
          {INTRO.name}
        </h1>

        {/* Impact sentence — board sits inline so the line wraps naturally on mobile */}
        <p className="text-stone-800 dark:text-stone-200 text-lg md:text-xl font-medium leading-loose mb-12">
          I build high-scale data pipelines and ecosystems using{' '}
          <WordFlipBoard words={FLAP_WORDS} />
        </p>

        {/* CTAs — icon-only on mobile (28px), icon + label on desktop */}
        <div className="flex flex-nowrap gap-3">

          {/* Projects */}
          <a
            href="#projects"
            aria-label="My Projects"
            className="inline-flex items-center justify-center p-4 md:gap-2 md:px-6 md:py-3.5 rounded-xl border border-indigo-400/50 bg-indigo-500/15 backdrop-blur-sm text-indigo-900 dark:text-indigo-300 font-semibold text-sm hover:bg-indigo-500/25 hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <FolderOpen size={28} className="md:hidden" aria-hidden="true" />
            <FolderOpen size={16} className="hidden md:block shrink-0" aria-hidden="true" />
            <span className="hidden md:inline">{INTRO.cta1}</span>
          </a>

          {/* LinkedIn */}
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Connect on LinkedIn"
            className="inline-flex items-center justify-center p-4 md:gap-2 md:px-6 md:py-3.5 rounded-xl border border-violet-400/50 bg-violet-500/15 backdrop-blur-sm text-violet-900 dark:text-violet-300 font-semibold text-sm hover:bg-violet-500/25 hover:border-violet-500/60 hover:shadow-lg hover:shadow-violet-500/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Linkedin size={28} className="md:hidden" aria-hidden="true" />
            <Linkedin size={16} className="hidden md:block shrink-0" aria-hidden="true" />
            <span className="hidden md:inline">{INTRO.cta2}</span>
          </a>

          {/* Skill Set */}
          <a
            href="#stack"
            aria-label="Skill Set"
            className="inline-flex items-center justify-center p-4 md:gap-2 md:px-6 md:py-3.5 rounded-xl border border-teal-400/50 bg-teal-500/15 backdrop-blur-sm text-teal-900 dark:text-teal-300 font-semibold text-sm hover:bg-teal-500/25 hover:border-teal-500/60 hover:shadow-lg hover:shadow-teal-500/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Layers size={28} className="md:hidden" aria-hidden="true" />
            <Layers size={16} className="hidden md:block shrink-0" aria-hidden="true" />
            <span className="hidden md:inline">Skill Set</span>
          </a>

        </div>

      </div>
    </section>
  )
}

// ─── TECH STACK ───────────────────────────────────────────────────────────────
// Skills displayed as inline prose rows (category · skill · skill · skill)
// instead of large boxed panels — scannable, editorial, no visual clutter.

function TechStackSection() {
  const [ref, visible] = useScrollReveal()

  return (
    <section id="stack" className="py-24 bg-white/5">
      <div className="max-w-6xl mx-auto px-6">

        {/* Section header */}
        <div className="mb-10">
          <span className="text-xs font-mono text-indigo-700 dark:text-indigo-400 tracking-widest uppercase">Skill Set</span>
        </div>

        {/*
          Inline row layout:
          [colored dot] [CATEGORY LABEL]    skill · skill · skill

          Hover effect uses an inset box-shadow for the left accent line —
          avoids layout shift that a real border-left would cause.
        */}
        <div ref={ref} className="divide-y divide-white/25 dark:divide-white/10">
          {TECH_CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              className={[
                'group flex gap-6 md:gap-12 py-4 -mx-4 px-4 rounded-xl',
                'transition-all duration-200',
                'hover:bg-white/20 dark:hover:bg-white/8 hover:shadow-[inset_3px_0_0_#a5b4fc]',
                visible ? 'animate-fade-up' : 'opacity-0',
              ].join(' ')}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              {/* Category label with dot */}
              <div className="flex items-start gap-2 w-40 md:w-48 shrink-0 pt-0.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-[5px] shrink-0 ${DOT_COLOR[cat.accent]}`}
                  aria-hidden="true"
                />
                <span className="text-[10px] font-mono text-stone-600 dark:text-stone-400 uppercase tracking-widest leading-snug group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors">
                  {cat.label}
                </span>
              </div>

              {/* Skills as inline text — no boxes, separated by · */}
              <p className="text-sm text-stone-800 dark:text-stone-300 leading-7 flex-1">
                {cat.skills.join('  ·  ')}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

function ProjectCard({ project }) {
  const [activeTab, setActiveTab] = useState('problem')

  return (
    <article className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/15 dark:bg-white/5 backdrop-blur-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/20">

      {/* Indigo top accent bar */}
      <div className="h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500" aria-hidden="true" />

      {/* Card header */}
      <div className="p-6 md:p-8 border-b border-white/20 dark:border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-mono text-stone-600 dark:text-stone-400 mb-1.5 block">{project.year}</span>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 leading-snug">{project.title}</h3>
            <p className="text-sm text-stone-700 dark:text-stone-400 mt-1.5 max-w-lg leading-6 text-justify hyphens-auto">{project.subtitle}</p>
          </div>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/30 dark:border-white/15 bg-white/10 dark:bg-white/5 text-stone-700 dark:text-stone-400 hover:border-indigo-400/60 hover:text-indigo-700 dark:hover:text-indigo-400 text-xs font-medium transition-all"
            aria-label={`View ${project.title} on GitHub`}
          >
            <Github size={13} aria-hidden="true" />
            View Repo
          </a>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md bg-white/15 dark:bg-white/5 text-stone-700 dark:text-stone-400 text-xs font-mono border border-white/25 dark:border-white/10"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex border-b border-white/20 dark:border-white/10" role="tablist" aria-label="Project details">
        {PROJECT_TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`${project.id}-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-3.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === tab
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-900/30'
                : 'border-transparent text-stone-700 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100 hover:bg-white/15 dark:hover:bg-white/8'
            }`}
          >
            {PROJECT_TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div id={`${project.id}-${activeTab}`} role="tabpanel" className="p-6 md:p-8">
        <p className="text-stone-800 dark:text-stone-300 text-sm leading-7 text-justify hyphens-auto">{project.tabs[activeTab]}</p>
      </div>
    </article>
  )
}

function ProjectsSection() {
  const [ref, visible] = useScrollReveal()

  return (
    <section id="projects" className="py-24 bg-transparent">
      <div ref={ref} className="max-w-6xl mx-auto px-6">

        <div className={`mb-14 ${visible ? 'animate-fade-up' : 'opacity-0'}`}>
          <span className="text-xs font-mono text-indigo-700 dark:text-indigo-400 tracking-widest uppercase">Interesting Works</span>
        </div>

        <div
          className={`grid gap-8 max-w-4xl ${visible ? 'animate-fade-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.12s' }}
        >
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
// Dark footer grounds the light page and gives social links visual weight.

function Footer() {
  return (
    <footer id="contact" className="bg-white/5 border-t border-white/20 py-14">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          {/* Tagline */}
          <div>
            <p className="text-stone-700 dark:text-stone-400 text-sm max-w-xs leading-7 tracking-wide">
              Let's connect and build something great.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/30 dark:border-white/15 bg-white/10 dark:bg-white/5 text-stone-700 dark:text-stone-400 hover:border-indigo-400/60 hover:text-indigo-700 dark:hover:text-indigo-400 text-sm transition-all duration-200"
            >
              <Linkedin size={15} aria-hidden="true" />
              LinkedIn
            </a>
            <a
              href={`mailto:${LINKS.email}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/30 dark:border-white/15 bg-white/10 dark:bg-white/5 text-stone-700 dark:text-stone-400 hover:border-indigo-400/60 hover:text-indigo-700 dark:hover:text-indigo-400 text-sm transition-all duration-200"
            >
              <Mail size={15} aria-hidden="true" />
              Email
            </a>
            {/* UPDATE: Replace LINKS.resume with your hosted resume URL */}
            <a
              href={LINKS.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/20 dark:bg-indigo-500/15 border border-indigo-400/50 dark:border-indigo-400/30 text-indigo-900 dark:text-indigo-300 text-sm font-medium hover:bg-indigo-500/30 hover:border-indigo-500/60 transition-all duration-200"
            >
              <Download size={15} aria-hidden="true" />
              Resume
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 dark:border-white/10 pt-6">
          <p className="text-stone-600 dark:text-stone-500 text-xs font-mono">
            © {new Date().getFullYear()} Alfred Johnson. Ctrl+C is highly encouraged ;)
          </p>
        </div>

      </div>
    </footer>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [dark, toggleDark] = useDarkMode()
  return (
    <div className="min-h-screen">
      <GlobalBackground />
      <Navbar dark={dark} toggleDark={toggleDark} />
      <main>
        <IntroSection />
        <TechStackSection />
        <ProjectsSection />
      </main>
      <Footer />
    </div>
  )
}
