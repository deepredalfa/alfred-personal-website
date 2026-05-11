// ─────────────────────────────────────────────────────────────────────────────
// Alfred Johnson | Senior Data Engineer & Architect — Portfolio
//
// Quick-edit guide — search for "UPDATE:" to jump to every replaceable value.
//
// Section map:
//   SITE DATA   — All copy, links, skills, and project content
//   ACCENT MAP  — Color tokens (only edit when adding new accent colors)
//   Navbar      — Fixed header with glass-on-scroll + mobile drawer
//   HeroSection — Full-viewport hero: headline, CTAs, status badge
//   TechStack   — Category tabs + skills panel
//   Projects    — Project card with Problem / Solution / Impact tabs
//   Personal    — Placeholder for personal story & passions
//   Footer      — Social links, email, resume download
//   App         — Root component
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import {
  Terminal, Layers, Code2, Server, Cloud, Workflow,
  Activity, Shield, Network, Database, Users,
  Github, Linkedin, Mail, Download,
  MapPin, Menu, X, ArrowUpRight,
} from 'lucide-react'

// ─── SITE DATA ────────────────────────────────────────────────────────────────

// UPDATE: Replace placeholder URLs before deploying
const LINKS = {
  linkedin: 'https://www.linkedin.com/in/alfredjohnsonk/',
  github:   'https://github.com/deepredalfa',
  email:    'hirealfred@gmail.com',
  resume:   'YOUR_RESUME_URL',   // UPDATE: Paste your hosted resume URL here
}

const NAV_ITEMS = ['Stack', 'Projects', 'About', 'Contact']

// UPDATE: Hero copy
const HERO = {
  badge:       'Senior Data Engineer & Architect',
  headline1:   'Architecting Scalable',
  headline2:   'Data Ecosystems.',
  subheadline: 'Designing robust Lakehouse foundations with Databricks, Spark, and Delta Lake. Bridging enterprise scale with local AI innovation.',
  location:    'Based in Sydney, AU',
  status:      'Active on the mountain trails & open waters',
  cta1Label:   'View Architecture Portfolio',
  cta2Label:   'Connect on LinkedIn',
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
    skills: [
      'Azure Databricks', 'Delta Lake', 'Unity Catalog',
      'Databricks Workflows', 'Photon Engine', 'Apache Spark',
    ],
  },
  {
    id: 'modeling',
    label: 'Data Modeling',
    icon: Code2,
    accent: 'violet',
    skills: [
      'Dimensional Modeling (Kimball)',
      'Medallion Architecture',
      'Slowly Changing Dimensions',
    ],
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
    skills: [
      'Azure Key Vault', 'Blob Storage / ADLS Gen2',
      'Entra ID (RBAC)', 'Azure DevOps',
    ],
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
    skills: [
      'Unity Catalog', 'Data Quality Practices',
      'SLA Adherence', 'Production Incident Management',
    ],
  },
  {
    id: 'integration',
    label: 'Integration & Backend',
    icon: Network,
    accent: 'indigo',
    skills: [
      'Mule ESB', 'Spring Boot', 'REST APIs',
      'OAuth / OIDC', 'Event-Driven Architecture',
    ],
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
    skills: [
      'Cross-functional Stakeholder Alignment',
      'Technical Mentorship',
      'Agile / Scrum (Jira · Confluence)',
    ],
  },
]

// UPDATE: Project content — replace with your actual outcomes and architecture details
const PROJECTS = [
  {
    id: 'au-property',
    title: 'AU Property Intelligence Platform',
    subtitle: 'End-to-end Lakehouse pipeline unifying Australian property market data with an AI-powered analytics layer',
    year: '2024',
    tags: ['PySpark', 'Delta Lake', 'dbt', 'Apache Airflow', 'LangChain', 'Claude API', 'Kubernetes', 'MinIO'],
    github: 'https://github.com/deepredalfa/au-property-intelligence',
    tabs: {
      problem: `Australia's property market generates fragmented data across five state governments and multiple federal APIs — auction results, ABS macro-economic indicators, RBA interest rate series — with no unified, analysis-ready foundation. Manual data pulls, schema mismatches, and stale reporting cycles made it impossible to surface timely, trustworthy market intelligence at scale or answer nuanced questions without a team of analysts.`,

      solution: `Built a full Medallion Architecture (Bronze → Silver → Gold) on a self-hosted Kubernetes cluster using Apache Spark for distributed processing and MinIO as an S3-compatible Delta Lake store. Apache Airflow with the KubernetesExecutor orchestrates scheduled ingestion and dbt transformation jobs, with data quality gates enforced at every tier. A RAG conversational layer — built with LangChain, Claude API, and ChromaDB vector embeddings — sits atop the Gold layer, enabling natural-language queries against the property knowledge base. Apache Superset and a Streamlit frontend serve BI dashboards and the chat interface.`,

      impact: `Delivers a production-grade analytical foundation processing millions of quarterly property records with full ACID guarantees via Delta Lake time-travel and versioning. dbt enforces lineage documentation and automated data quality testing across all models. The AI layer allows non-technical stakeholders to interrogate market trends in plain English — correlating property prices with interest rate movements, migration patterns, and affordability metrics — without writing a single query. GitHub Actions CI/CD enforces dbt tests and Python linting on every push.`,
    },
  },
]

// UPDATE: Edit personal intro copy here
const PERSONAL_INTRO = {
  setup:  'A senior data architect built on simple principles:',
  values: [
    { text: 'strong black coffee,',              delay: 1.1 },
    { text: 'humanity over dogma,',              delay: 1.9 },
    { text: 'and kindness in every connection.', delay: 2.7 },
  ],
  belief: 'I believe the best systems are built by keeping things human.',
  sig:    'Alfred Johnson',
}

// ─── ACCENT MAP ───────────────────────────────────────────────────────────────
// Tailwind requires complete class strings — no dynamic template literals.
const ACCENT = {
  emerald: {
    text:   'text-emerald-400',
    bg:     'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    badge:  'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25',
    active: 'border-emerald-500/40 text-emerald-400',
  },
  sky: {
    text:   'text-sky-400',
    bg:     'bg-sky-500/10',
    border: 'border-sky-500/30',
    badge:  'bg-sky-500/15 text-sky-300 border border-sky-500/25',
    active: 'border-sky-500/40 text-sky-400',
  },
  violet: {
    text:   'text-violet-400',
    bg:     'bg-violet-500/10',
    border: 'border-violet-500/30',
    badge:  'bg-violet-500/15 text-violet-300 border border-violet-500/25',
    active: 'border-violet-500/40 text-violet-400',
  },
  amber: {
    text:   'text-amber-400',
    bg:     'bg-amber-500/10',
    border: 'border-amber-500/30',
    badge:  'bg-amber-500/15 text-amber-300 border border-amber-500/25',
    active: 'border-amber-500/40 text-amber-400',
  },
  blue: {
    text:   'text-blue-400',
    bg:     'bg-blue-500/10',
    border: 'border-blue-500/30',
    badge:  'bg-blue-500/15 text-blue-300 border border-blue-500/25',
    active: 'border-blue-500/40 text-blue-400',
  },
  cyan: {
    text:   'text-cyan-400',
    bg:     'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    badge:  'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25',
    active: 'border-cyan-500/40 text-cyan-400',
  },
  rose: {
    text:   'text-rose-400',
    bg:     'bg-rose-500/10',
    border: 'border-rose-500/30',
    badge:  'bg-rose-500/15 text-rose-300 border border-rose-500/25',
    active: 'border-rose-500/40 text-rose-400',
  },
  green: {
    text:   'text-green-400',
    bg:     'bg-green-500/10',
    border: 'border-green-500/30',
    badge:  'bg-green-500/15 text-green-300 border border-green-500/25',
    active: 'border-green-500/40 text-green-400',
  },
  indigo: {
    text:   'text-indigo-400',
    bg:     'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    badge:  'bg-indigo-500/15 text-indigo-300 border border-indigo-500/25',
    active: 'border-indigo-500/40 text-indigo-400',
  },
  orange: {
    text:   'text-orange-400',
    bg:     'bg-orange-500/10',
    border: 'border-orange-500/30',
    badge:  'bg-orange-500/15 text-orange-300 border border-orange-500/25',
    active: 'border-orange-500/40 text-orange-400',
  },
  teal: {
    text:   'text-teal-400',
    bg:     'bg-teal-500/10',
    border: 'border-teal-500/30',
    badge:  'bg-teal-500/15 text-teal-300 border border-teal-500/25',
    active: 'border-teal-500/40 text-teal-400',
  },
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

  const closeDrawer = () => setDrawerOpen(false)

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/60 shadow-lg shadow-slate-950/20'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="font-mono text-sm font-semibold text-slate-100 tracking-widest hover:text-emerald-400 transition-colors duration-200"
          aria-label="Home"
        >
          AJ<span className="text-emerald-400">.</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="text-sm text-slate-400 hover:text-slate-100 transition-colors duration-200 font-medium"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <a
          href={`mailto:${LINKS.email}`}
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 text-sm text-slate-300 font-medium hover:border-emerald-500/60 hover:text-emerald-400 transition-all duration-200"
        >
          Hire Me
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-2 text-slate-400 hover:text-slate-100 transition-colors"
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={drawerOpen}
        >
          {drawerOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800">
          <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col gap-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={closeDrawer}
                className="py-2 text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
              >
                {item}
              </a>
            ))}
            <a
              href={`mailto:${LINKS.email}`}
              className="mt-1 px-4 py-2.5 rounded-lg border border-slate-700 text-sm text-slate-300 text-center font-medium hover:border-emerald-500/60 hover:text-emerald-400 transition-all"
            >
              Hire Me
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-slate-950 overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff07_1px,transparent_1px),linear-gradient(to_bottom,#ffffff07_1px,transparent_1px)] bg-[size:48px_48px]"
      />
      {/* Ambient glow orbs */}
      <div aria-hidden="true" className="absolute top-1/3 -left-24 w-[500px] h-[500px] bg-emerald-500/6 rounded-full blur-3xl pointer-events-none" />
      <div aria-hidden="true" className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-sky-500/6 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20">
        {/* Role chip */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span className="text-xs font-mono text-emerald-400 tracking-wider">{HERO.badge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-100 leading-[1.08] tracking-tight mb-6">
          {HERO.headline1}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-sky-400">
            {HERO.headline2}
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10">
          {HERO.subheadline}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 mb-14">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            {HERO.cta1Label}
            <ArrowUpRight size={16} />
          </a>
          <a
            href={LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700 text-slate-300 font-semibold text-sm hover:border-sky-500/50 hover:text-sky-400 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          >
            {HERO.cta2Label}
            <Linkedin size={16} />
          </a>
        </div>

        {/* Location & status */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1.5">
            <MapPin size={13} className="text-emerald-400/80" />
            {HERO.location}
          </span>
          <span className="text-slate-700" aria-hidden="true">·</span>
          <span>{HERO.status}</span>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-600" aria-hidden="true">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase">scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
      </div>
    </section>
  )
}

// ─── TECH STACK ───────────────────────────────────────────────────────────────

function TechStackSection() {
  const [activeId, setActiveId] = useState(TECH_CATEGORIES[0].id)

  const active = TECH_CATEGORIES.find((c) => c.id === activeId)
  const acc    = ACCENT[active.accent]
  const Icon   = active.icon

  return (
    <section id="stack" className="py-24 bg-slate-950">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="mb-14">
          <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase">Technical Arsenal</span>
          <h2 className="text-4xl font-bold text-slate-100 mt-2 mb-3">The Stack</h2>
          <p className="text-slate-400 max-w-lg">
            14 years of engineering depth across the modern data landscape — from legacy ESB integration to cloud-native Lakehouse design.
          </p>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          {/* Category list — horizontal scroll on mobile, vertical on desktop */}
          <div
            className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 lg:overflow-visible scrollbar-hide"
            role="tablist"
            aria-label="Tech categories"
          >
            {TECH_CATEGORIES.map((cat) => {
              const CatIcon  = cat.icon
              const isActive = cat.id === activeId
              const catAcc   = ACCENT[cat.accent]
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${cat.id}`}
                  onClick={() => setActiveId(cat.id)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-left whitespace-nowrap lg:whitespace-normal transition-all duration-200 border shrink-0 ${
                    isActive
                      ? `${catAcc.bg} ${catAcc.active} ${catAcc.text} font-medium`
                      : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <CatIcon size={15} className="shrink-0" aria-hidden="true" />
                  <span className="text-sm">{cat.label}</span>
                </button>
              )
            })}
          </div>

          {/* Skills panel */}
          <div
            id={`panel-${active.id}`}
            role="tabpanel"
            className={`rounded-2xl border ${acc.border} ${acc.bg} p-8 min-h-[220px] transition-colors duration-300`}
          >
            <div className={`flex items-center gap-3 mb-6 ${acc.text}`}>
              <Icon size={20} aria-hidden="true" />
              <h3 className="text-base font-semibold">{active.label}</h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {active.skills.map((skill) => (
                <span
                  key={skill}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium ${acc.badge}`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

const PROJECT_TABS   = ['problem', 'solution', 'impact']
const PROJECT_TAB_LABELS = {
  problem:  'The Problem',
  solution: 'The Solution',
  impact:   'The Impact',
}

function ProjectCard({ project }) {
  const [activeTab, setActiveTab] = useState('problem')

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden hover:border-slate-700/80 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-950/60">
      {/* Card header */}
      <div className="p-6 md:p-8 border-b border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-mono text-slate-500 mb-1.5 block">{project.year}</span>
            <h3 className="text-xl font-bold text-slate-100 leading-snug">{project.title}</h3>
            <p className="text-sm text-slate-400 mt-1.5 max-w-lg">{project.subtitle}</p>
          </div>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 self-start flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 text-xs font-medium transition-all duration-200"
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
              className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-400 text-xs font-mono border border-slate-700/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex border-b border-slate-800" role="tablist" aria-label="Project details">
        {PROJECT_TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`${project.id}-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-3.5 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === tab
                ? 'border-emerald-400 text-emerald-400 bg-emerald-500/5'
                : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
            }`}
          >
            {PROJECT_TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div
        id={`${project.id}-${activeTab}`}
        role="tabpanel"
        className="p-6 md:p-8"
      >
        <p className="text-slate-300 text-sm leading-relaxed">{project.tabs[activeTab]}</p>
      </div>
    </article>
  )
}

function ProjectsSection() {
  return (
    <section id="projects" className="py-24 bg-slate-900/20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase">Proof of Work</span>
          <h2 className="text-4xl font-bold text-slate-100 mt-2 mb-3">Architecture Portfolio</h2>
          <p className="text-slate-400 max-w-lg">
            Real-world data systems built at scale — from design decisions to production delivery.
          </p>
        </div>

        <div className="grid gap-8 max-w-4xl">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PERSONAL ─────────────────────────────────────────────────────────────────

function PersonalSection() {
  const [brewing, setBrewing] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBrewing(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // Generates animation class; "both" fill-mode keeps phrase hidden during its delay
  const b = (extra = '') =>
    `${brewing ? 'animate-brew' : 'opacity-0'} ${extra}`

  return (
    <section id="about" className="py-24 bg-slate-950 relative overflow-hidden">

      {/* Warm ambient glow — softens the cold dark background behind the card */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-amber-950/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative max-w-6xl mx-auto px-6">

        <div className="mb-12">
          <span className="text-xs font-mono text-amber-500/70 tracking-widest uppercase">
            The Human Element
          </span>
          <h2 className="text-4xl font-bold text-slate-100 mt-2">Beyond the Terminal</h2>
        </div>

        {/* Quote card */}
        <div ref={ref} className="max-w-xl">
          <div className="relative rounded-2xl border border-stone-800/70 bg-stone-900/30 px-8 pt-10 pb-10 md:px-12 md:pt-12 overflow-hidden">

            {/* Top warm hairline — signals a different emotional register from the tech sections */}
            <div
              aria-hidden="true"
              className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"
            />

            {/* Decorative open-quote glyph — positioned in the top-left corner, behind text */}
            <div
              aria-hidden="true"
              className="absolute -top-3 left-5 text-[7rem] leading-none font-serif text-amber-400/[0.09] select-none pointer-events-none"
            >
              ❝
            </div>

            {/* Setup line — muted, sets the stage */}
            <p
              className={b('relative text-stone-400 text-base md:text-lg leading-relaxed mb-5')}
              style={{ animationDelay: '0s' }}
            >
              {PERSONAL_INTRO.setup}
            </p>

            {/* Core values — bolder, framed by amber left border */}
            <div className="border-l-2 border-amber-500/40 pl-5 mb-6 space-y-2">
              {PERSONAL_INTRO.values.map(({ text, delay }) => (
                <p
                  key={text}
                  className={b('text-xl md:text-2xl font-semibold text-stone-100 leading-snug')}
                  style={{ animationDelay: `${delay}s` }}
                >
                  {text}
                </p>
              ))}
            </div>

            {/* Closing belief — italic, warm, full width */}
            <p
              className={b('relative text-stone-300 text-base md:text-lg leading-relaxed italic mb-8')}
              style={{ animationDelay: '3.7s' }}
            >
              {PERSONAL_INTRO.belief}
            </p>

            {/* Signature */}
            <div
              className={b('flex items-center gap-3')}
              style={{ animationDelay: '4.9s' }}
            >
              <div className="h-px w-5 bg-amber-500/40" aria-hidden="true" />
              <span className="text-amber-500/55 text-sm font-mono tracking-wide">
                {PERSONAL_INTRO.sig}
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer id="contact" className="py-16 border-t border-slate-800/60 bg-slate-950">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
          {/* Brand + tagline */}
          <div>
            <span className="font-mono text-sm font-semibold text-slate-100">
              AJ<span className="text-emerald-400">.</span>
            </span>
            <p className="text-slate-500 text-sm mt-1.5 max-w-xs">
              Open to senior data engineering & architecture opportunities.
            </p>
          </div>

          {/* Social & contact links */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-800 text-sm text-slate-400 hover:border-sky-500/40 hover:text-sky-400 transition-all duration-200"
            >
              <Linkedin size={15} aria-hidden="true" />
              LinkedIn
            </a>
            <a
              href={`mailto:${LINKS.email}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-800 text-sm text-slate-400 hover:border-emerald-500/40 hover:text-emerald-400 transition-all duration-200"
            >
              <Mail size={15} aria-hidden="true" />
              Email
            </a>
            {/* UPDATE: Replace LINKS.resume with your actual hosted resume URL */}
            <a
              href={LINKS.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-400 font-medium hover:bg-emerald-500/15 hover:border-emerald-500/50 transition-all duration-200"
            >
              <Download size={15} aria-hidden="true" />
              Resume
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800/40 pt-6">
          <p className="text-slate-700 text-xs font-mono">
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
    <div className="min-h-screen bg-slate-950">
      <Navbar />
      <main>
        <HeroSection />
        <TechStackSection />
        <ProjectsSection />
        <PersonalSection />
      </main>
      <Footer />
    </div>
  )
}
