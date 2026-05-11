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
  Github, Linkedin, Mail, Download,
  Menu, X, ArrowUpRight,
} from 'lucide-react'

// ─── SITE DATA ────────────────────────────────────────────────────────────────

// UPDATE: Replace placeholder URLs before deploying
const LINKS = {
  linkedin: 'https://www.linkedin.com/in/alfredjohnsonk/',
  github:   'https://github.com/deepredalfa',
  email:    'hirealfred@gmail.com',
  resume:   'YOUR_RESUME_URL',   // UPDATE: Paste your hosted resume URL here
}

const NAV_ITEMS = ['About', 'Stack', 'Projects', 'Contact']

// UPDATE: Personal intro copy
const INTRO = {
  name:  'Alfred Johnson.',
  title: 'Senior Data Engineer & Architect',
  // UPDATE: Edit these two bio paragraphs
  bio1:  'Senior Data Engineer with 14 years across fintech, telco, and retail. Lakehouse architecture, Azure Databricks, Delta Lake, Apache Spark — and a strong foundation in API design, event-driven systems, and enterprise integration.',
  bio2:  'Strong coffee. Simple principles.',
  cta1:  'My Projects',
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

// ─── NAVBAR ───────────────────────────────────────────────────────────────────

function Navbar() {
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
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-stone-100'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="font-mono text-sm font-semibold text-stone-900 hover:text-indigo-600 transition-colors"
          aria-label="Home"
        >
          AJ<span className="text-indigo-600">.</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="text-sm text-stone-500 hover:text-stone-900 transition-colors font-medium"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Hire Me */}
        <a
          href={`mailto:${LINKS.email}`}
          className="hidden md:inline-flex text-sm px-4 py-2 rounded-lg border border-stone-200 text-stone-600 font-medium hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
        >
          Hire Me
        </a>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-stone-500 hover:text-stone-900 transition-colors"
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-label="Toggle menu"
          aria-expanded={drawerOpen}
        >
          {drawerOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="md:hidden bg-white border-b border-stone-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setDrawerOpen(false)}
                className="text-sm font-medium text-stone-700 hover:text-indigo-600 transition-colors py-1"
              >
                {item}
              </a>
            ))}
            <a
              href={`mailto:${LINKS.email}`}
              className="text-sm px-4 py-2.5 rounded-lg border border-stone-200 text-stone-600 text-center hover:border-indigo-300 hover:text-indigo-600 transition-all"
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
    <section id="about" className="relative min-h-screen flex items-center bg-stone-50 overflow-hidden">

      {/*
        Animated gradient blobs — slow-drifting, heavily blurred shapes.
        Colors are very light (indigo-200, violet-200, sky-200) at low opacity
        so the effect is ambient warmth, not decoration.
      */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-24  w-[560px] h-[560px] rounded-full bg-indigo-200/40 blur-3xl animate-blob-1" />
        <div className="absolute top-1/2  -right-32 w-[480px] h-[480px] rounded-full bg-violet-200/30 blur-3xl animate-blob-2" />
        <div className="absolute -bottom-24 left-1/3 w-[420px] h-[420px] rounded-full bg-sky-200/25   blur-3xl animate-blob-3" />
      </div>

      {/* Subtle dot grid — adds quiet technical texture without sci-fi feel */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle,#00000009_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 w-full">

        {/* Greeting — sits close to the name so they read as one natural intro */}
        <p className="text-stone-400 text-lg font-light mb-2">Hi, I'm</p>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-stone-900 tracking-tight leading-[1.06] mb-5">
          {INTRO.name}
        </h1>

        {/* Title */}
        <p className="text-xl md:text-2xl text-stone-500 font-light mb-10">
          {INTRO.title}
        </p>

        {/* Bio — two short paragraphs, warm and direct */}
        <div className="max-w-xl space-y-4 mb-12">
          <p className="text-stone-600 text-lg leading-relaxed">{INTRO.bio1}</p>
          <p className="text-stone-500 text-base leading-relaxed">{INTRO.bio2}</p>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-600/20 active:translate-y-0"
          >
            {INTRO.cta1}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-stone-200 text-stone-600 font-semibold text-sm hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            {INTRO.cta2}
            <Linkedin size={16} aria-hidden="true" />
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
    <section id="stack" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        {/* Section header */}
        <div className="mb-14">
          <span className="text-xs font-mono text-indigo-500 tracking-widest uppercase">Technical Arsenal</span>
          <h2 className="text-4xl font-bold text-stone-900 mt-2 mb-3">The Stack</h2>
          <p className="text-stone-400 max-w-lg text-sm">
            14 years of depth across the modern data landscape — from legacy ESB integration to cloud-native Lakehouse design.
          </p>
        </div>

        {/*
          Inline row layout:
          [colored dot] [CATEGORY LABEL]    skill · skill · skill

          Hover effect uses an inset box-shadow for the left accent line —
          avoids layout shift that a real border-left would cause.
        */}
        <div ref={ref} className="divide-y divide-stone-100">
          {TECH_CATEGORIES.map((cat, i) => (
            <div
              key={cat.id}
              className={[
                'group flex gap-6 md:gap-12 py-4 -mx-4 px-4 rounded-xl',
                'transition-all duration-200',
                'hover:bg-stone-50 hover:shadow-[inset_3px_0_0_#a5b4fc]',
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
                <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest leading-snug group-hover:text-stone-600 transition-colors">
                  {cat.label}
                </span>
              </div>

              {/* Skills as inline text — no boxes, separated by · */}
              <p className="text-sm text-stone-600 leading-relaxed flex-1">
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
    <article className="rounded-2xl border border-stone-200 bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/80">

      {/* Indigo top accent bar */}
      <div className="h-[3px] bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-500" aria-hidden="true" />

      {/* Card header */}
      <div className="p-6 md:p-8 border-b border-stone-100">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-mono text-stone-400 mb-1.5 block">{project.year}</span>
            <h3 className="text-xl font-bold text-stone-900 leading-snug">{project.title}</h3>
            <p className="text-sm text-stone-500 mt-1.5 max-w-lg">{project.subtitle}</p>
          </div>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-500 hover:border-indigo-300 hover:text-indigo-600 text-xs font-medium transition-all"
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
              className="px-2.5 py-1 rounded-md bg-stone-50 text-stone-500 text-xs font-mono border border-stone-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex border-b border-stone-100" role="tablist" aria-label="Project details">
        {PROJECT_TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`${project.id}-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-3.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === tab
                ? 'border-indigo-500 text-indigo-600 bg-indigo-50/60'
                : 'border-transparent text-stone-400 hover:text-stone-700 hover:bg-stone-50'
            }`}
          >
            {PROJECT_TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div id={`${project.id}-${activeTab}`} role="tabpanel" className="p-6 md:p-8">
        <p className="text-stone-600 text-sm leading-relaxed">{project.tabs[activeTab]}</p>
      </div>
    </article>
  )
}

function ProjectsSection() {
  const [ref, visible] = useScrollReveal()

  return (
    <section id="projects" className="py-24 bg-stone-50">
      <div ref={ref} className="max-w-6xl mx-auto px-6">

        <div className={`mb-14 ${visible ? 'animate-fade-up' : 'opacity-0'}`}>
          <span className="text-xs font-mono text-indigo-500 tracking-widest uppercase">Proof of Work</span>
          <h2 className="text-4xl font-bold text-stone-900 mt-2 mb-3">My Projects</h2>
          <p className="text-stone-400 max-w-lg text-sm">
            Real-world data systems built at scale — from design decisions to production delivery.
          </p>
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
    <footer id="contact" className="bg-white border-t border-stone-100 py-14">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          {/* Brand + tagline */}
          <div>
            <span className="font-mono text-sm font-semibold text-stone-900">
              AJ<span className="text-indigo-600">.</span>
            </span>
            <p className="text-stone-500 text-sm mt-1.5 max-w-xs leading-relaxed">
              Let's connect and build something great.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-200 text-stone-500 hover:border-indigo-300 hover:text-indigo-600 text-sm transition-all duration-200"
            >
              <Linkedin size={15} aria-hidden="true" />
              LinkedIn
            </a>
            <a
              href={`mailto:${LINKS.email}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-200 text-stone-500 hover:border-indigo-300 hover:text-indigo-600 text-sm transition-all duration-200"
            >
              <Mail size={15} aria-hidden="true" />
              Email
            </a>
            {/* UPDATE: Replace LINKS.resume with your hosted resume URL */}
            <a
              href={LINKS.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-medium hover:bg-indigo-100 hover:border-indigo-300 transition-all duration-200"
            >
              <Download size={15} aria-hidden="true" />
              Resume
            </a>
          </div>
        </div>

        <div className="border-t border-stone-100 pt-6">
          <p className="text-stone-400 text-xs font-mono">
            © {new Date().getFullYear()} Alfred Johnson. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main>
        <IntroSection />
        <TechStackSection />
        <ProjectsSection />
      </main>
      <Footer />
    </div>
  )
}
