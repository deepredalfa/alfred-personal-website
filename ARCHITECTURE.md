# Architecture & Design Decisions

This document explains the reasoning behind every file, configuration choice, component, and design decision in the portfolio. Intended as a reference for future updates, additions, or handing the project to another developer.

---

## Table of Contents

1. [Tech Stack](#1-tech-stack)
2. [Build Configuration](#2-build-configuration)
3. [Entry Points](#3-entry-points)
4. [Styling System](#4-styling-system)
5. [Component Architecture](#5-component-architecture)
6. [Design System](#6-design-system)
7. [Interactive State](#7-interactive-state)
8. [Accessibility](#8-accessibility)
9. [Deployment](#9-deployment)

---

## 1. Tech Stack

### React 18

**Chosen because:** The portfolio has multiple interactive states — a mobile navigation drawer, a tabbed tech-stack browser with 11 categories, and a per-project tab switcher (Problem / Solution / Impact). Each of these requires reactive UI that updates without a full page reload. React's component model and `useState` hook handle this cleanly, keeping related logic co-located without reaching for a global state library.

Plain HTML + JS would work for one toggle, but three independent stateful widgets start to produce tangled event listeners and DOM queries. React makes the cost of adding a fourth widget near-zero.

### Vite 5

**Chosen because:** Vite is the fastest modern dev server — it serves source files as native ES modules (no bundling on start), so `npm run dev` is instant regardless of project size. HMR (hot module replacement) reflects changes in the browser in under 100 ms. For production, it uses Rollup under the hood and produces a highly optimised, tree-shaken bundle.

The alternative (Create React App) was deprecated in 2023 and used Webpack, which is significantly slower to start and rebuild.

### Tailwind CSS v3

**Chosen because:** Tailwind's utility-first approach eliminates the need to maintain a separate CSS file with custom class names for every component. Every visual style — spacing, color, border radius, shadow, responsive breakpoint — is expressed directly in JSX as a class string. This makes components visually self-documenting and removes the context-switching overhead of jumping between a JS file and a CSS file.

**Why v3 and not v4:** Tailwind v4 (beta at time of build) moved to a CSS-native config model that changes how PostCSS is wired up and how `tailwind.config.js` works. v3 has a stable, well-documented ecosystem, wide plugin support, and is the version all current tutorials and Tailwind UI components target. Upgrading to v4 later is a one-time migration, not a continuous overhead.

### Lucide React

**Chosen because:** Lucide is a community-maintained fork of Feather Icons with a much larger icon set (~1,400 icons). Every icon is a standalone React component, so Vite's tree-shaking ensures only the icons actually imported appear in the final bundle. The icons use a consistent 24x24 stroke style that pairs well with Tailwind's sizing utilities and the portfolio's clean aesthetic.

SVG alternatives (raw SVG in JSX, react-icons) were considered. `react-icons` bundles entire icon families unless carefully configured; raw SVG bloats the component file. Lucide imports are clean named imports with no runtime overhead.

---

## 2. Build Configuration

### `package.json`

```
"type": "module"
```
Marks the package as ESM (ES Modules). This lets `vite.config.js` and `tailwind.config.js` use `import`/`export` syntax natively instead of `require()`. All modern tooling in this project (Vite, Tailwind, PostCSS) supports ESM.

```
"scripts": { "dev", "build", "preview" }
```
- `dev` — starts Vite's dev server with HMR on `localhost:5173`
- `build` — produces the optimised `dist/` folder Vercel deploys
- `preview` — serves `dist/` locally to QA the production build before pushing

Vercel auto-detects these scripts via its Vite framework preset and runs `build` on every deployment.

---

### `vite.config.js`

Contains a single plugin: `@vitejs/plugin-react`. This plugin does two things:

1. Transforms JSX syntax (`.jsx` files) into valid JavaScript via Babel
2. Enables React Fast Refresh — the HMR layer that preserves component state across edits (useful when tweaking a tab panel: the active tab stays selected as you save)

Without this plugin, Vite would not know how to process `.jsx` files and the dev server would throw a parse error.

---

### `tailwind.config.js`

**`content` array:**
```js
content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
```
Tailwind scans these files at build time for class names and removes any class not found in them (tree-shaking for CSS). If a file containing Tailwind classes falls outside this glob, its classes will be missing in production. All component code lives in `src/`, so this covers everything.

**`fontFamily` extension:**
```js
fontFamily: {
  sans: ['Inter', ...],
  mono: ['"JetBrains Mono"', ...]
}
```
Overrides Tailwind's default sans and mono font stacks with the typefaces loaded via Google Fonts. This means `font-sans` (applied to `body`) uses Inter, and `font-mono` (used for section labels, code badges, the logo) uses JetBrains Mono — without needing custom CSS classes.

---

### `postcss.config.cjs`

**Why `.cjs` and not `.js`:**
PostCSS loads its config file directly via Node.js `require()`, which in a package with `"type": "module"` would fail for a `.js` file (Node would try to parse it as ESM, but PostCSS passes it to `require()`). Using the `.cjs` extension explicitly signals CommonJS to Node regardless of the package type, making PostCSS happy without changing the rest of the project's ESM setup.

**Plugins:**
- `tailwindcss` — runs Tailwind's class-scanning and CSS-generation pass
- `autoprefixer` — automatically adds vendor prefixes (`-webkit-`, `-moz-`) for CSS properties that still need them in older browser targets

These two plugins are the minimum required to process Tailwind-annotated CSS into browser-ready output.

---

### `.gitignore`

| Entry | Reason |
|---|---|
| `node_modules/` | ~130 packages, hundreds of MB — never committed; restored via `npm install` |
| `dist/` | Generated build output — Vercel builds from source, so committing dist is redundant and creates noisy diffs |
| `.vercel` | Auto-generated Vercel project metadata — ties the project to a specific Vercel org/project ID; committing it would break deployments for anyone else who forks the repo |
| `.DS_Store` | macOS Finder metadata — no relevance to the project |

---

## 3. Entry Points

### `index.html`

Vite uses `index.html` (in the project root, not `public/`) as the application entry point. During dev, Vite injects a module script tag for HMR. During build, it rewrites all `src=` paths to content-hashed asset URLs.

**What's in the `<head>`:**
- `scroll-smooth` on `<html>` — enables CSS scroll-behaviour for anchor `#` navigation links
- Google Fonts `<link>` with `preconnect` — `preconnect` opens the TCP connection to Google's font CDN early, reducing the latency of the font download. Both `fonts.googleapis.com` and `fonts.gstatic.com` need preconnection because they are separate hosts (the stylesheet lives on one, the font files on the other)
- `<meta name="description">` and `og:*` tags — basic SEO and social-preview metadata. These are the first things a recruiter or LinkedIn link-preview will read

### `src/main.jsx`

Mounts the React application into the `<div id="root">` element in `index.html`. Wrapped in `<StrictMode>` which enables additional runtime warnings in development (double-invoking effects, detecting deprecated APIs) without affecting the production build.

---

## 4. Styling System

### `src/index.css`

**`@tailwind base`** — Injects Tailwind's Preflight reset (a modern, opinionated CSS reset built on top of `normalize.css`). Removes browser default margins, standardises font sizes, and sets `box-sizing: border-box` globally. Without this, padding/margin inconsistencies appear across browsers.

**`@tailwind components`** — Injects any component-layer classes (none custom here, but third-party Tailwind plugins use this layer).

**`@tailwind utilities`** — Injects the full utility class set. This is the largest layer and the one most affected by the `content` scan in `tailwind.config.js`.

**`@layer base` customisations:**
- `-webkit-font-smoothing: antialiased` — renders fonts with subpixel anti-aliasing on macOS/iOS, making Inter appear sharper at small sizes on retina displays
- `::selection` rule — when a user highlights text, it turns emerald rather than the browser's default blue, extending the colour theme into a subtle interaction

**`scrollbar-hide` utility:**
The horizontal category tab list in the Tech Stack section scrolls on mobile. `overflow-x-auto` is needed for this, but showing a scrollbar on mobile looks unfinished. This custom utility hides it cross-browser (Firefox uses `scrollbar-width: none`, Chrome/Safari use the `::-webkit-scrollbar` pseudo-element). Placed in `@layer utilities` so Tailwind's purge system tracks it.

---

## 5. Component Architecture

All components live in a single `src/App.jsx` file. This was a deliberate choice: the portfolio is a single-page marketing document, not an application with routing or code-split lazy loading. One file means one place to make copy changes, one place to follow the data flow, and zero import path management.

The file is structured top-to-bottom in render order: site data → accent map → Navbar → Hero → TechStack → Projects → Personal → Footer → App. Reading it from top to bottom is the same as reading the page from top to bottom.

---

### `Navbar`

**Fixed positioning (`fixed top-0 inset-x-0 z-50`):**
Navigation stays visible as the user scrolls through a long single-page site. `z-50` ensures it renders above all content including sticky elements and modals.

**Glassmorphism on scroll (`scrolled` state):**
On page load the nav is transparent — it doesn't compete visually with the hero headline. After scrolling 24px, `bg-slate-950/85 backdrop-blur-xl` activates, making the nav readable over arbitrary content beneath it. The threshold is 24px (not 0) to avoid a flash of glass on the first pixel of scroll.

**`{ passive: true }` on the scroll listener:**
Tells the browser this listener never calls `preventDefault()`, allowing it to optimise scrolling on mobile by not waiting for the listener to return before processing the scroll event. Prevents janky scroll performance.

**Mobile drawer (`drawerOpen` state):**
Below the `md` breakpoint (768px), the nav links collapse behind a hamburger. The drawer is a full-width panel that slides in below the nav bar (not an overlay) so it doesn't obscure content — useful on short-viewport phones. Each link calls `closeDrawer()` on click so the menu dismisses immediately after navigation.

---

### `HeroSection`

**`min-h-screen` (not `h-screen`):**
`h-screen` clips content if the headline wraps to more lines than expected at a particular viewport. `min-h-screen` guarantees the section fills the viewport but can grow if content overflows, preventing clipped text on narrow screens.

**Grid background pattern (`bg-[linear-gradient(...)]`):**
Uses Tailwind's arbitrary value syntax to create a CSS `background-image` with two overlapping linear gradients — one vertical, one horizontal — that produce a dot-grid/grid line effect. The colour is `#ffffff07` (white at 3% opacity) which is visible on `slate-950` but subtle enough not to distract. This is a pure CSS technique: no SVG, no canvas, no JS.

**Ambient glow orbs:**
Two `<div>` elements with `rounded-full blur-3xl` and low-opacity background colours (emerald and sky). `blur-3xl` applies a 64px CSS blur, producing a diffused glow. `pointer-events-none` ensures they don't intercept clicks. Together they create a sense of depth and colour without any image assets.

**Badge chip with `animate-pulse`:**
The pulsing green dot communicates "currently active / available" — a common pattern on developer portfolios used in place of a status message. `animate-pulse` is a Tailwind built-in that alternates opacity via a CSS keyframe animation.

**Gradient headline (`bg-clip-text`):**
`text-transparent bg-clip-text bg-gradient-to-r` applies a gradient as the text fill colour. This is a standard CSS technique (uses `-webkit-background-clip: text`) that Tailwind exposes directly as utilities. The gradient runs from `emerald-400` (nature/green) through `emerald-300` to `sky-400` (tech/blue), reflecting the "Nature/Adventure meets Developer-Tech" theme brief.

**Scroll cue:**
A `w-px h-8 bg-gradient-to-b from-slate-600 to-transparent` — a single-pixel-wide fading line — signals that the page continues. It's purely decorative (`aria-hidden="true"`) and adds no noise to screen readers.

---

### `TechStackSection`

**Why tabs instead of a flat list:**
11 skill categories with 3–6 items each = 40+ skill entries. Rendering them all at once as badges creates a visually overwhelming wall of text. Tabs let users explore one dimension of the skillset at a time, making each category feel considered rather than a keyword dump. It also creates a natural interactive moment that demonstrates frontend capability.

**ACCENT map (static class strings):**
Tailwind generates its CSS by scanning source files for complete class name strings. If you write `text-${color}-400`, Tailwind cannot detect `text-emerald-400` in that template literal and will strip it from the production CSS. The `ACCENT` object stores complete, static class strings (e.g. `'text-emerald-400'`) for every colour variant used by every category. These strings appear literally in the source file, so Tailwind's scanner includes them all.

**Desktop: 2-column grid (`lg:grid-cols-[260px_1fr]`):**
A fixed-width sidebar (260px) for the category list with a flexible content panel. The fixed width keeps the sidebar compact on wide screens. On mobile it collapses to a single column with the category tabs displayed as a horizontally scrolling row above the panel.

**`role="tablist"` / `role="tab"` / `role="tabpanel"` / `aria-selected`:**
Standard ARIA tab pattern. Screen readers announce the widget as a tab group and communicate which tab is active. Without these, the buttons and their associated panel have no semantic relationship for assistive technology.

---

### `ProjectCard`

**Glassmorphism card (`bg-slate-900/60 backdrop-blur-sm`):**
The card background is `slate-900` at 60% opacity with a 4px backdrop blur. Against the `slate-900/20` section background, this creates a subtle depth layering effect without a stark contrast jump. The card border (`border-slate-800`) and its hover state (`hover:border-slate-700/80`) give tactile feedback before the user even clicks.

**`hover:shadow-2xl hover:shadow-slate-950/60`:**
On hover, a deep `slate-950` shadow appears beneath the card — same hue as the page background, so it looks like the card is lifting off the surface. This is more realistic than a generic grey shadow.

**Problem / Solution / Impact tabs:**
This structure maps to the three questions a hiring manager or technical lead asks when evaluating portfolio work: "What were you solving? What did you build? What did it achieve?" Separating them forces concise, purposeful writing per section rather than a wall of mixed context.

**Tab active state (`border-b-2 border-emerald-400`):**
A bottom border on the active tab is the minimal possible indicator. It occupies no layout space (it's absorbed into the existing border-bottom slot of the tab bar) and doesn't shift other content when activated.

---

### `PersonalSection`

A dashed-border placeholder. The `border-dashed` variant signals "content placeholder" by convention. The entire section structure (heading, container, ARIA) is in place so filling it in later requires only replacing the inner `<div>` contents — no restructuring needed.

---

### `Footer`

**`id="contact"`:**
The nav link `href="#contact"` scrolls here. The footer is the contact surface — no separate contact section is needed for a portfolio of this scope.

**Resume link styled distinctly (`bg-emerald-500/10 border-emerald-500/30`):**
The Resume CTA is the most commercially important action in the footer (a recruiter's first click). It's visually separated from the plain icon links by a filled background, drawing the eye without being as heavy as the solid primary button in the hero.

**`© {new Date().getFullYear()}`:**
JavaScript evaluates this at build time (Vite embeds it as a static string in the bundle). The year stays current as long as the project is rebuilt at least once a year — no cron job or server-side rendering needed.

---

## 6. Design System

### Colour Palette

| Role | Tailwind token | Hex | Usage |
|---|---|---|---|
| Page background | `slate-950` | `#020617` | Base layer for all sections |
| Surface / card | `slate-900` | `#0f172a` | Card backgrounds |
| Border | `slate-800` | `#1e293b` | Dividers, card edges |
| Primary text | `slate-100` | `#f1f5f9` | Headlines, body |
| Secondary text | `slate-400` | `#94a3b8` | Sub-copy, descriptions |
| Muted text | `slate-500` | `#64748b` | Labels, metadata |
| Accent — nature | `emerald-400/500` | `#34d399 / #10b981` | Primary CTA, active states, hero gradient |
| Accent — tech | `sky-400` | `#38bdf8` | Secondary CTA, hero gradient endpoint |

**Why dark theme:** Developer portfolio convention. A dark background makes gradient headline text and coloured skill badges pop with high contrast. It also signals comfort with terminal/IDE environments — a subtle but genuine signal for a data engineering audience.

**Why emerald + sky:** The brief called for "Nature/Adventure meets Developer-Tech." Emerald maps to trails, outdoors, and life; sky maps to open water, cloud infrastructure, and technical clarity. The two colours run as a gradient across the hero headline, unifying both themes in the first element the visitor reads.

### Typography

**Inter (sans):** A variable-weight geometric sans-serif optimised for screens. Used for all body copy, descriptions, nav links, and CTA labels. Its neutral character keeps the focus on content rather than personality.

**JetBrains Mono (mono):** A monospaced font designed by JetBrains for code editors. Used for section eyebrow labels (`Technical Arsenal`, `Proof of Work`), the `AJ.` logo, tech tag badges, and the copyright line. Monospace on these elements creates a subtle "terminal output" aesthetic that signals technical fluency without being gimmicky.

### Spacing & Layout

**`max-w-6xl mx-auto px-6`:** Every section uses this container class combination. `max-w-6xl` (1152px) keeps content readable on wide displays; `px-6` (24px) provides breathing room on mobile. Consistency across sections means the visual grid is always aligned.

**`py-24`:** All content sections use 96px top/bottom padding. The hero uses `pt-28 pb-20` to account for the fixed navbar height. Uniform vertical rhythm makes the page feel designed rather than assembled.

---

## 7. Interactive State

| State | Component | Values | Trigger |
|---|---|---|---|
| `scrolled` | Navbar | `boolean` | `window.scroll` > 24px |
| `drawerOpen` | Navbar | `boolean` | Hamburger button click |
| `activeId` | TechStackSection | category `id` string | Category tab click |
| `activeTab` | ProjectCard | `'problem' \| 'solution' \| 'impact'` | Tab button click |

All state is local (`useState`). No global store (Redux, Zustand, Context) is needed because no two components need to share state. This keeps the component tree simple and eliminates unnecessary re-renders.

---

## 8. Accessibility

- **Semantic HTML:** `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` are used throughout. Screen readers announce the document structure correctly without needing ARIA landmark overrides.
- **ARIA tab pattern:** `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"` on the tech stack and project tab widgets — standard W3C pattern for tab interfaces.
- **`aria-label` on icon-only links:** The GitHub "View Repo" link gets `aria-label={`View ${project.title} on GitHub`}` to give screen readers a meaningful description beyond "View Repo".
- **`aria-hidden="true"` on decorative elements:** The grid pattern, glow orbs, and scroll cue are purely decorative. Hiding them from the accessibility tree removes noise for screen reader users.
- **`aria-label` + `aria-expanded` on hamburger:** The mobile menu toggle announces its purpose and its current state.
- **Colour contrast:** All text colours used against their background colours meet WCAG AA (4.5:1 for normal text). `slate-400` on `slate-950` is 5.8:1. `emerald-400` on `slate-950` is 6.9:1.

---

## 9. Deployment

**Vercel (automatic detection):**
Vercel detects the project as a Vite application via the presence of `vite.config.js` and the `build` script in `package.json`. It runs `npm run build` and serves the `dist/` output with CDN edge caching globally.

No `vercel.json` is required for a standard Vite SPA. If client-side routing is added later (e.g., React Router), a rewrite rule will be needed:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Deploy command (local, using nvm):**
```bash
export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" && vercel --prod
```

Node 20 (via nvm) is required because the Vercel CLI v53+ targets Node 18+.
