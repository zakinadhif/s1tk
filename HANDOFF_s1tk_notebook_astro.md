# Project Handoff — S1TK Notebook (Astro + Svelte)

> **For:** Claude Code (autonomous implementation agent)
> **By:** Course design team, Prodi S1 Teknik Komputer, Universitas Telkom
> **Stack:** Astro (static) + Svelte islands + MDX content
> **Reference architecture:** [github.com/atiohaidar/s2if](https://github.com/atiohaidar/s2if) (SvelteKit version — read for feature parity, not code reuse)

---

## 0. TL;DR

Build **S1TK Notebook** — an interactive digital lab-notebook for S1 Computer Engineering students at Universitas Telkom. It is spiritually the same product as [atiohaidar/s2if](https://github.com/atiohaidar/s2if) but rebuilt with a better-suited stack for its content-heavy nature:

- **Astro** handles routing, static generation, and all non-interactive content (zero JS shipped for static parts).
- **Svelte** handles the interactive islands: annotator, video sync, circuit simulations, quizzes.
- **MDX** is the authoring format — dosen write Markdown and drop in component tags. No `.svelte` files for content.
- **Astro Content Collections + Zod** replace the entire custom `validate-content.ts` CLI that s2if had to build by hand.

Seed the project with the **FET module (Weeks 8–11) for TKI2H4 Elektronika Dasar**, content for which is in `seed-content/aktivitas_pembelajaran_FET_v2.md`.

---

## 1. Why This Stack

| Problem | SvelteKit (s2if) solution | Astro solution |
|---|---|---|
| Lesson content lives alongside markup | Content hardcoded in `.svelte` files | Content in `.mdx` files — Markdown-first |
| Schema validation for topic metadata | Custom `validate-content.ts` CLI script | Zod schema in Content Collections — free at build time |
| Slug uniqueness | Custom uniqueness checker | Filesystem — two files can't share a slug |
| Title ↔ manifest consistency | Custom regex parser | Not needed — frontmatter IS the metadata |
| JS bundle for static pages | Full Svelte runtime loads on every page | Zero JS on static content; JS only where islands are |
| Complex interactive components | Normal Svelte — fine | Svelte islands via `client:visible` / `client:load` — same code, smarter loading |

The only validation that stays custom is **acyclic prereq checking** (DFS cycle detection on the `prereq` frontmatter field). Everything else is handled by the framework.

---

## 2. Tech Stack (non-negotiable unless flagged)

| Layer | Choice |
|---|---|
| Framework | Astro (latest stable, `>=4.0`) |
| Output | `output: 'static'` — no adapter needed for GitHub Pages |
| Interactive components | `@astrojs/svelte` — Svelte 5 |
| Content | `@astrojs/mdx` + Astro Content Collections |
| Math | `remark-math` + `rehype-katex` |
| Syntax highlight | Shiki (Astro built-in) — no PrismJS needed |
| Styling | Plain CSS — `src/styles/global.css` design tokens + Astro scoped styles |
| Persistence | `localStorage` keyed by route path |
| Linter | ESLint + Prettier |
| Node | LTS (≥ 20) |
| Package manager | npm |

**Do not add:** Tailwind, any UI component library, any backend, any database, any auth, any analytics, React, Vue. Keep it lean.

---

## 3. Repository Structure

```
s1tk/
├── public/
│   ├── favicon.svg
│   └── og-image.png
│
├── scripts/
│   └── validate-prereqs.ts        # ONLY remaining custom validation: DFS cycle detection
│                                  # Run via: npm run validate
│
├── src/
│   ├── styles/
│   │   └── global.css             # design tokens + global styles (see §6)
│   │
│   ├── components/
│   │   │
│   │   │  — Static components (.astro — ship zero JS) —
│   │   ├── Callout.astro
│   │   ├── NoteHeader.astro
│   │   ├── Sticker.astro
│   │   │
│   │   │  — Interactive islands (.svelte — hydrated on client) —
│   │   ├── CircuitSim.svelte      # NEW — see §5.1
│   │   ├── InlineAnnotator.svelte # see §5.2
│   │   ├── Quiz.svelte            # see §5.3
│   │   ├── VideoSidebar.svelte    # see §5.4
│   │   └── VideoSyncArticle.svelte
│   │
│   ├── layouts/
│   │   └── NoteLayout.astro       # wraps all topic pages
│   │
│   ├── content/
│   │   ├── config.ts              # Zod schema — the single source of truth for metadata
│   │   └── elektronika-dasar/     # one folder per subject; slug = filename stem
│   │       ├── aktivitas-1-nmosfet-dasar.mdx
│   │       ├── aktivitas-2-pmosfet-simetri.mdx
│   │       ├── aktivitas-3-bias-q-point.mdx
│   │       ├── aktivitas-4-common-source.mdx
│   │       ├── aktivitas-5-source-follower.mdx
│   │       └── aktivitas-6-common-gate.mdx
│   │
│   └── pages/
│       ├── index.astro            # curriculum landing — lists all subjects + topics
│       └── [subject]/
│           ├── index.astro        # subject overview page
│           └── [slug].astro       # dynamic topic route
│
├── tests/
│   └── validate-prereqs.test.ts  # unit tests for cycle detection helpers
│
├── .github/
│   └── workflows/
│       ├── validate.yml
│       └── deploy.yml
│
├── astro.config.mjs
├── package.json
├── tsconfig.json
│
│  — Author guides (write all four) —
├── Tambah-Materi.md
├── Tambah-Materi-Reference.md
├── Tambah-Video-Sync.md
└── Tambah-Simulasi-CircuitJS.md
```

---

## 4. Content Model

### 4.1 Content Collection Schema

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const topics = defineCollection({
  type: 'content', // MDX
  schema: z.object({
    title: z.string(),
    summary: z.string().max(200),
    subject: z.string(),                 // e.g. 'elektronika-dasar'
    courseCode: z.string(),              // e.g. 'TKI2H4'
    semester: z.number().int().min(1).max(8),
    week: z.number().int().optional(),
    order: z.number().int(),
    type: z.enum(['aktivitas', 'materi', 'kuis', 'praktikum', 'referensi']),
    renderMode: z.enum(['standard', 'video-sync']).default('standard'),
    tags: z.array(z.string()).default([]),
    prereq: z.array(z.string()).default([]),  // array of slug strings
    learningObjectives: z.array(z.string()).optional(),
    estimatedMinutes: z.number().int().optional(),
    videoId: z.string().optional(),           // YouTube video ID, required if renderMode='video-sync'
    videoSectionMap: z.array(z.object({       // required if renderMode='video-sync'
      id: z.string(),
      start: z.number(),
      end: z.number(),
    })).optional(),
  }),
});

export const collections = { topics };
```

If any `.mdx` file is missing a required field or has a wrong type, **Astro throws a build error automatically**. No custom schema validation needed.

### 4.2 MDX Frontmatter Example

```mdx
---
title: "Aktivitas 1: Pembentukan Saluran dan Mode Operasi MOSFET-n"
summary: "Eksplorasi langsung pembentukan saluran konduksi NMOS dan batas antara mode triode dan saturasi menggunakan simulasi interaktif."
subject: elektronika-dasar
courseCode: TKI2H4
semester: 3
week: 8
order: 1
type: aktivitas
renderMode: standard
tags: [mosfet, nmos, threshold-voltage, triode, saturation, channel-formation]
prereq: []
estimatedMinutes: 30
learningObjectives:
  - Mengidentifikasi tegangan batas V_t dari kurva simulasi
  - Membedakan perilaku MOSFET di mode triode dan saturasi
  - Menghubungkan pembentukan saluran dengan persamaan I_D
---
```

### 4.3 Routing

In `src/pages/[subject]/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import NoteLayout from '../../layouts/NoteLayout.astro';

export async function getStaticPaths() {
  const topics = await getCollection('topics');
  return topics.map(topic => ({
    params: {
      subject: topic.data.subject,
      slug: topic.slug.split('/').at(-1), // strip subject prefix from slug
    },
    props: { topic },
  }));
}

const { topic } = Astro.props;
const { Content } = await topic.render();
---

<NoteLayout frontmatter={topic.data}>
  <Content />
</NoteLayout>
```

### 4.4 Prereq Cycle Detection (the one remaining custom script)

```ts
// scripts/validate-prereqs.ts
// Run with: npx tsx scripts/validate-prereqs.ts

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter'; // npm install gray-matter

// 1. Glob all .mdx files under src/content/
// 2. Parse frontmatter with gray-matter
// 3. Build directed graph: slug → prereq[]
// 4. Run DFS cycle detection
// 5. Exit 1 with cycle path if found, exit 0 otherwise

function findCycle(graph: Record<string, string[]>): string[] | null {
  const visited = new Set<string>();
  const stack = new Set<string>();

  function dfs(node: string, path: string[]): string[] | null {
    if (stack.has(node)) return [...path, node]; // cycle found
    if (visited.has(node)) return null;
    visited.add(node);
    stack.add(node);
    for (const neighbor of graph[node] ?? []) {
      const result = dfs(neighbor, [...path, node]);
      if (result) return result;
    }
    stack.delete(node);
    return null;
  }

  for (const node of Object.keys(graph)) {
    const cycle = dfs(node, []);
    if (cycle) return cycle;
  }
  return null;
}

// Wire it up: read files, build graph, call findCycle, report
```

Write unit tests in `tests/validate-prereqs.test.ts` covering:
- `findCycle` returns `null` for acyclic graph
- `findCycle` returns the cycle path for a simple A→B→A loop
- `findCycle` returns the cycle path for a multi-node cycle

---

## 5. Component Specs

### 5.1 `CircuitSim.svelte` (most important — new, unique to S1TK)

Renders a Falstad CircuitJS simulation as a first-class embedded lab instrument.

**Props:**
```ts
export let url: string;           // Falstad URL (?startCircuit= or ?cct=)
export let title: string;         // label shown above the frame
export let caption: string = '';  // explanatory text below
export let height: number = 480;
export let pending: boolean = false; // true = simulation not ready yet
```

**When `pending={true}`:**
Render a card with a ⚗️ icon, the title, and the text: *"Simulasi sedang disiapkan oleh tim dosen."* No iframe. Style as a dashed-border placeholder in the graph-paper theme.

**When `pending={false}` (normal flow):**
1. **Before interaction:** show a placeholder card containing the title, caption, and a prominent `<button>▶ Muat Simulasi</button>` button. Also includes an "↗ Buka di tab baru" `<a>` link to the URL.
2. **On button click OR when card enters viewport** (use `IntersectionObserver`): replace placeholder with `<iframe>`.
3. **iframe attributes:**
   ```html
   <iframe
     src={url}
     {title}
     width="100%"
     height={height}
     sandbox="allow-scripts allow-same-origin allow-popups"
     loading="lazy"
   />
   ```
4. After mounting iframe, show a small dismiss-able banner: *"Klik komponen di dalam simulator untuk mengubah nilai."*

**Styling:** Graph-paper-bordered card. The iframe sits inside a `<figure>` with a `<figcaption>` below. Looks like a circuit was pasted into the lab notebook.

**Usage in MDX:**
```mdx
import CircuitSim from '../../components/CircuitSim.svelte';

<CircuitSim
  client:visible
  url="https://www.falstad.com/circuit/circuitjs.html?startCircuit=nmosfet.txt"
  title="Simulasi n-MOSFET — Tegangan Batas dan Mode Operasi"
  caption="Geser slider V_GS dan V_DS. Amati kapan arus mulai mengalir dan kapan kurva mendatar."
/>
```

`client:visible` is critical — it tells Astro to hydrate this island only when it scrolls into view. With 4–6 CircuitSim instances per page, this prevents the browser from loading 6 heavy iframes at once.

---

### 5.2 `InlineAnnotator.svelte`

Replicate s2if's annotator. Key behaviors:

- Listens for `selectionchange` on the `.note-article` container.
- Floating toolbar appears above any text selection with: 5 highlight color swatches, 📝 sticky note, 📋 copy.
- **Highlighting:** splits text nodes via DOM `splitText`, wraps target in `<mark class="hl-{color}" data-ann-id="{uuid}">`.
- **Sticky notes:** clicking 📝 opens an inline `<textarea>` popover anchored to the selection. Text saved to annotation store.
- **Persistence:** all annotations stored in `localStorage` under key `s1tk-annotations:{pathname}` as a JSON array. Re-applied on mount by walking the DOM.
- Use `client:load` (must be ready immediately, not lazy).
- Guards: no annotation on `<code>`, `<pre>`, or `<iframe>` targets.

---

### 5.3 `Quiz.svelte`

```ts
export let question: string;
export let options: string[];
export let correctIndex: number | number[];  // supports single or multi-answer
export let explanation: string;
```

- Before submit: render each option as a clickable pill; selected = highlighted.
- On submit: lock options, show ✓ (green) on correct, ✗ (red) on incorrect selections.
- Reveal explanation in a `<Callout variant="tip">` below.
- Use `client:visible`.

---

### 5.4 `VideoSidebar.svelte` + `VideoSyncArticle.svelte`

Replicate s2if's bidirectional sync. Only used when `renderMode: 'video-sync'` in frontmatter.

- `VideoSidebar`: loads YouTube IFrame API dynamically, renders the player, emits `timeupdate` events.
- `VideoSyncArticle`: wraps the lesson body. Accepts `sectionMap` from frontmatter. On time events from the sidebar, highlights the current section with class `video-highlight` and smooth-scrolls to it. Timestamp anchor clicks (`<a class="ts-anchor" data-seconds={n}>`) seek the player.
- Manual scroll detection suspends auto-scroll and shows a floating *"Ikuti Video Lagi"* button.
- Both use `client:load`.
- In `NoteLayout.astro`, render the three-column layout (nav | content | video) only when `frontmatter.renderMode === 'video-sync'`.

---

### 5.5 Static components (`.astro`)

**`Callout.astro`**
```astro
---
interface Props {
  variant: 'tip' | 'info' | 'warning' | 'danger' | 'catatan';
  title?: string;
}
const { variant, title } = Astro.props;
---
<aside class={`callout callout-${variant}`}>
  {title && <p class="callout-title">{title}</p>}
  <slot />
</aside>
```

**`NoteHeader.astro`** — receives `frontmatter` prop, renders title, course code badge, week badge, estimated time, and learning objectives as a styled header block. No JS.

**`Sticker.astro`** — decorative rotated badge. Slot-based. Variants: `type`, `week`, `lab`.

---

## 6. Design System

**Theme:** "Engineer's Lab Notebook" — graph-paper background, dark navy spine, hand-lettered stickers.

```css
/* src/styles/global.css */
:root {
  /* Surfaces */
  --color-paper:         #faf8f1;
  --color-grid:          #dce8f0;     /* graph-paper lines */
  --color-binder:        #1e3a5f;     /* dark navy spine */
  --color-ink:           #1a1d29;
  --color-ink-muted:     #4a5060;
  --color-accent:        #c1272d;     /* Telkom red */
  --color-accent-soft:   #ffeae6;

  /* Annotation highlights */
  --hl-yellow: hsl(50  95% 78%);
  --hl-blue:   hsl(205 75% 80%);
  --hl-green:  hsl(135 55% 78%);
  --hl-purple: hsl(275 55% 82%);
  --hl-red:    hsl(0   70% 82%);

  /* Callout variants */
  --callout-tip:     #2f7d4e;
  --callout-info:    #1e3a8a;
  --callout-warning: #b45309;
  --callout-danger:  #b91c1c;
  --callout-catatan: #4a5060;

  /* Typography */
  --font-body:   "Source Serif Pro", Georgia, serif;
  --font-hand:   "Caveat", cursive;         /* stickers, margin notes */
  --font-mono:   "JetBrains Mono", monospace; /* code, formulas, component values */

  /* Geometry */
  --grid-cell:   24px;
  --radius:      4px;
  --max-prose:   720px;
}
```

**Graph-paper background:** Applied to `body` via an SVG `background-image` of a 24 px grid in `--color-grid`. The `.note-article` panel sits on `--color-paper` with a box shadow, creating the illusion of a pad of paper on a table.

**Font loading:** Load Source Serif Pro, Caveat, and JetBrains Mono from Google Fonts via a `<link>` in the `<head>` of the base layout.

**Layout — desktop:**
```
┌──────────────────────────────────────────────────────────┐
│  [nav sidebar 260px] │ [note article max 720px] │ [toc]  │
└──────────────────────────────────────────────────────────┘
```
Nav sidebar: subject tree (expandable by semester). TOC: auto-generated from `##` headings via Astro's `headings` export from MDX render. Both sidebars sticky, article scrolls.

**Layout — video-sync mode:**
```
┌─────────────────────────────────────────────────────────────────┐
│  [nav 260px] │ [note article max 580px] │ [video sidebar 340px] │
└─────────────────────────────────────────────────────────────────┘
```

**Layout — mobile (≤ 768 px):** Single column. Nav in a top drawer. TOC collapsed behind a "Daftar Isi" button. `CircuitSim` min-height 320 px, horizontally scrollable.

**Shiki theme for code blocks:** Use `github-light` or configure a custom theme matching the paper background. Required languages: `c`, `cpp`, `python`, `bash`, `verilog`, `vhdl`, `asm`.

---

## 7. Astro Config

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  integrations: [
    svelte(),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      theme: 'github-light',
      langs: ['c', 'cpp', 'python', 'bash', 'verilog', 'asm'],
    },
  },
  output: 'static',
});
```

Also install: `remark-math`, `rehype-katex`, `katex` (peer dep), `gray-matter` (for the validate script), `tsx` (for running the TS validate script).

---

## 8. Seed Content (FET Module)

The file `seed-content/aktivitas_pembelajaran_FET_v2.md` contains the full six-activity FET module in Markdown. Port it to six `.mdx` files under `src/content/elektronika-dasar/`.

**Slug ↔ frontmatter ↔ content mapping:**

| Filename | `order` | `week` | `prereq` |
|---|---|---|---|
| `aktivitas-1-nmosfet-dasar.mdx` | 1 | 8 | `[]` |
| `aktivitas-2-pmosfet-simetri.mdx` | 2 | 8 | `['aktivitas-1-nmosfet-dasar']` |
| `aktivitas-3-bias-q-point.mdx` | 3 | 9 | `['aktivitas-2-pmosfet-simetri']` |
| `aktivitas-4-common-source.mdx` | 4 | 10 | `['aktivitas-3-bias-q-point']` |
| `aktivitas-5-source-follower.mdx` | 5 | 11 | `['aktivitas-4-common-source']` |
| `aktivitas-6-common-gate.mdx` | 6 | 11 | `['aktivitas-4-common-source']` |

**Porting rules — apply these transforms to every activity:**

| Source in `_v2.md` | Target in `.mdx` |
|---|---|
| `### 🎯 Skenario Nyata` block | `<Callout variant="info" title="🎯 Skenario Nyata">` |
| `### 🔬 Aktivitas Eksplorasi` | Plain `##` heading + numbered list |
| `### 💭 Pertanyaan Refleksi` | `<Callout variant="catatan" title="💭 Pertanyaan Refleksi">` |
| `### 📐 Kaitan dengan Teori` | Plain `##` heading; display math via `$$...$$` (remark-math renders it) |
| Simulation link (`https://www.falstad.com/...`) | `<CircuitSim client:visible url="..." title="..." caption="..." />` |
| `# 🌐 Mengapa Modul Ini Penting...` section | Goes in `src/pages/[subject]/index.astro` as the subject overview, not in any single activity |
| Tabel Perbandingan Tiga Konfigurasi | Standard Markdown table — renders natively in MDX |

**Simulation URLs to embed per activity:**

| Activity | URL | `pending` |
|---|---|---|
| 1 — NMOS | `https://www.falstad.com/circuit/circuitjs.html?startCircuit=nmosfet.txt` | `false` |
| 2 — PMOS | `https://www.falstad.com/circuit/circuitjs.html?startCircuit=pmosfet.txt` | `false` |
| 3 — DC Bias | `https://www.falstad.com/circuit/circuitjs.html?cct=PENDING` | **`true`** |
| 4 — CS Amp | `https://www.falstad.com/circuit/circuitjs.html?startCircuit=mosfetamp.txt` | `false` |
| 5 — Source Follower | `https://www.falstad.com/circuit/circuitjs.html?startCircuit=mosfollower.txt` | `false` |
| 6 — Common Gate | `https://www.falstad.com/circuit/circuitjs.html?cct=PENDING` | **`true`** |

---

## 9. Author Documentation

Write these four files at repo root. Each must include at least one complete worked example from the actual seed content (not a toy "foo/bar" example).

1. **`Tambah-Materi.md`** — end-to-end guide: create the `.mdx` file, fill frontmatter, write content, run `npm run validate`, check `npm run dev`.

2. **`Tambah-Materi-Reference.md`** — cheatsheet:
   - All frontmatter fields with types and examples
   - How to write display math: `$$I_D = \tfrac{1}{2} k_n (V_{GS} - V_t)^2$$`
   - How to write inline math: `$V_{GS}$`
   - All Callout variants with rendered examples
   - Quiz component with a full worked example
   - How to use Sticker

3. **`Tambah-Video-Sync.md`** — how to set `renderMode: 'video-sync'`, get a YouTube video ID, build the `videoSectionMap` array, write `<a class="ts-anchor" data-seconds={n}>` timestamp anchors inline in content.

4. **`Tambah-Simulasi-CircuitJS.md`** — how to:
   - Use a built-in Falstad circuit (`?startCircuit=name.txt`)
   - Get a custom `?cct=` URL from the Falstad editor (File → Export URL → Copy)
   - Use `<CircuitSim>` in MDX (with and without `pending`)
   - Write a caption that frames what students should observe (not just "this is a circuit")
   - Set `pending={true}` when the simulation URL isn't ready yet

---

## 10. CI / Deployment

**`validate.yml`** — triggers on PR and push to any non-main branch:
```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with: { node-version: 20, cache: npm }
  - run: npm ci
  - run: npm run validate      # prereq cycle detection
  - run: npm test              # unit tests
  - run: npm run build         # Astro build (also runs Zod schema checks)
```

**`deploy.yml`** — triggers on push to main:
```yaml
steps:
  - validate + build (same as above)
  - uses: actions/upload-pages-artifact@v3
    with: { path: dist }
  - uses: actions/deploy-pages@v4
```

Set `base` in `astro.config.mjs` if deploying to a subpath (e.g. `github.io/s1tk`):
```js
export default defineConfig({
  site: 'https://<username>.github.io',
  base: '/s1tk',
  // ...
});
```

---

## 11. Package Scripts

```json
{
  "scripts": {
    "dev":          "astro dev",
    "build":        "npm run validate && astro build",
    "preview":      "astro preview",
    "validate":     "tsx scripts/validate-prereqs.ts",
    "test":         "node --test tests/validate-prereqs.test.ts",
    "sync":         "astro sync"
  }
}
```

---

## 12. Acceptance Criteria (Definition of Done)

- [ ] `npm install && npm run dev` boots on `localhost:4321`, no console errors.
- [ ] `npm run validate` passes on seed content.
- [ ] `npm run build` produces a clean `dist/` directory.
- [ ] Landing page (`/`) shows curriculum tree: Semester 3 → Elektronika Dasar → 6 activities with title, summary, and estimated time.
- [ ] Subject overview (`/elektronika-dasar`) renders the *"Mengapa Modul Ini Penting"* content correctly.
- [ ] All 6 activity pages render fully: Callouts, math, tables, and CircuitSim components.
- [ ] Activities 1, 2, 4, 5: CircuitSim shows lazy-load placeholder → loads iframe on button click or scroll-in.
- [ ] Activities 3, 6: CircuitSim shows `pending` card with *"Simulasi sedang disiapkan"*.
- [ ] Selecting text on any activity page brings up the 5-color highlight toolbar.
- [ ] Highlights and sticky notes survive a page reload (localStorage).
- [ ] Validator catches these deliberate breaks:
  - Add `prereq: ['aktivitas-2-pmosfet-simetri']` to Aktivitas 1 → validator fails, prints cycle path.
  - Remove required `title` from any frontmatter → `astro build` throws a Zod error.
- [ ] Unit tests for `findCycle` pass (acyclic → null, cyclic → path).
- [ ] Mobile layout (≤ 768 px): nav collapses, content readable, CircuitSim iframes accessible.
- [ ] All four `Tambah-*.md` guides have at least one worked example from the actual FET content.
- [ ] `dist/` from `npm run build` can be served by any static file server (`npx serve dist`) without 404s on any page.

---

## 13. Out of Scope

- Any server-side rendering or API routes.
- Authentication or user accounts.
- A visual editor for content — dosen write `.mdx` files directly.
- Site-wide search (punt to v2).
- Dark mode / theme switcher.
- Comments, discussion, or any social feature.
- Tracking or analytics of any kind.

---

## 14. Working Conventions for Claude Code

- Before writing any component, read `README_PAPER.md` in [atiohaidar/s2if](https://github.com/atiohaidar/s2if) for feature intent. **Do not copy code** — s2if is SvelteKit; reimplement features in Astro idioms.
- The order matters: scaffolding → config → design tokens → static layout → `CircuitSim` → `InlineAnnotator` → `VideoSync` → `Quiz` → seed content → validation script → CI.
- Self-verify against §12 before declaring done.
- If any spec is ambiguous, choose the simpler interpretation and document it in `DECISIONS.md` at repo root.
- All user-facing strings and content are in **Bahasa Indonesia**. All code, comments, commit messages, and this handoff are in **English**.
- `CircuitSim.svelte` is the highest-priority component. It is unique to this project and everything else (Annotator, Video, Quiz) has a clear reference in s2if. If time-constrained, build CircuitSim and the content rendering first.

---

*Files to include alongside this handoff when opening Claude Code:*
1. *This file: `HANDOFF_s1tk_notebook.md`*
2. *`seed-content/aktivitas_pembelajaran_FET_v2.md` — the full FET module content to port*
