# S1TK Notebook

Digital lab notebook untuk mahasiswa **S1 Teknik Komputer**, Fakultas Teknik Elektro, Universitas Telkom.

Dibangun dengan Astro (static) + Svelte islands + MDX — konten Markdown-first, simulasi interaktif CircuitJS, anotasi teks, dan sinkronisasi video kuliah.

**Live site:** https://zakinadhif.github.io/s1tk

---

## Stack

| Layer | Pilihan |
|---|---|
| Framework | Astro 6 (static output) |
| Interactive islands | Svelte 5 (`client:visible` / `client:load`) |
| Konten | MDX + Astro Content Collections + Zod |
| Math | remark-math + rehype-katex |
| Syntax highlight | Shiki (github-light) |
| Styling | Plain CSS — design tokens + scoped styles |
| Persistence | `localStorage` per route |
| Package manager | pnpm |

---

## Memulai

```bash
pnpm install
pnpm dev
```

Buka `http://localhost:4321`.

---

## Perintah

| Perintah | Aksi |
|---|---|
| `pnpm dev` | Dev server di `localhost:4321` |
| `pnpm build` | Validasi prereq + build ke `dist/` |
| `pnpm preview` | Preview hasil build lokal |
| `pnpm validate` | Cek siklus pada graf prereq (DFS) |
| `pnpm test` | Unit test untuk `findCycle` |
| `pnpm sync` | Regenerasi tipe Astro Content |

---

## Struktur Proyek

```
s1tk/
├── public/                          # Aset statis
├── scripts/
│   └── validate-prereqs.ts          # Cycle detection pada graf prereq
├── src/
│   ├── styles/global.css            # Design tokens + layout global
│   ├── content.config.ts            # Zod schema untuk Content Collections
│   ├── components/
│   │   ├── Callout.astro            # Callout box (info/tip/warning/danger/catatan)
│   │   ├── NoteHeader.astro         # Header halaman topik
│   │   ├── Sticker.astro            # Label dekoratif
│   │   ├── CircuitSim.svelte        # Embed simulasi Falstad CircuitJS
│   │   ├── InlineAnnotator.svelte   # Highlight teks + sticky notes
│   │   ├── Quiz.svelte              # Soal pilihan ganda (single/multi)
│   │   ├── VideoSidebar.svelte      # YouTube player sidebar
│   │   └── VideoSyncArticle.svelte  # Sinkronisasi artikel ↔ video
│   ├── layouts/
│   │   └── NoteLayout.astro         # Layout tiga kolom untuk semua halaman topik
│   ├── content/
│   │   └── elektronika-dasar/       # Konten MDX modul FET (Pekan 8–11)
│   └── pages/
│       ├── index.astro              # Kurikulum landing page
│       ├── elektronika-dasar/
│       │   └── index.astro          # Halaman overview mata kuliah
│       └── [subject]/
│           └── [slug].astro         # Halaman topik dinamis
├── tests/
│   └── validate-prereqs.test.ts     # Unit test findCycle
├── seed-content/                    # Sumber konten asli sebelum diport ke MDX
└── .github/workflows/
    ├── validate.yml                 # CI: validasi + test + build (PR/non-main)
    └── deploy.yml                   # CD: deploy ke GitHub Pages (push to main)
```

---

## Menambah Konten

Lihat panduan berikut di root repo:

- **`Tambah-Materi.md`** — langkah demi langkah membuat topik baru
- **`Tambah-Materi-Reference.md`** — cheatsheet frontmatter, math, semua komponen
- **`Tambah-Video-Sync.md`** — cara menyinkronkan artikel dengan video YouTube
- **`Tambah-Simulasi-CircuitJS.md`** — cara embed simulasi Falstad

---

## Deployment

Push ke branch `main` otomatis memicu `deploy.yml` yang akan:

1. Menjalankan `pnpm validate` (cek prereq)
2. Menjalankan `pnpm test`
3. Build dengan `astro build`
4. Deploy hasil `dist/` ke GitHub Pages

Pastikan **Settings → Pages → Source** di repo GitHub diatur ke **"GitHub Actions"**.

---

## Konten Saat Ini

| Mata Kuliah | Kode | Topik |
|---|---|---|
| Elektronika Dasar — Modul FET | TKI2H4 | 6 aktivitas (Pekan 8–11) |

---

---

## Kredit

Proyek ini mengacu pada **[atiohaidar/s2if](https://github.com/atiohaidar/s2if)** — digital notebook untuk mahasiswa S2 IF yang dibangun dengan SvelteKit. Konsep dan fitur-fiturnya (InlineAnnotator, VideoSync, Quiz, struktur kurikulum) dijadikan acuan dan diimplementasikan ulang dalam Astro.

---

**Prodi S1 Teknik Komputer — Fakultas Teknik Elektro — Universitas Telkom**
