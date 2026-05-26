# Tambah Materi — Panduan Langkah demi Langkah

Panduan ini menjelaskan cara menambahkan topik baru ke S1TK Notebook, dari membuat file `.mdx` hingga melihatnya berjalan di browser.

---

## Prasyarat

- Node.js ≥ 20 dan pnpm sudah terinstal
- Repository sudah di-clone dan `pnpm install` sudah dijalankan

---

## Langkah 1 — Buat file `.mdx` baru

File konten disimpan di `src/content/[subject]/[slug].mdx`.

**Aturan penamaan slug:**
- Huruf kecil semua, kata dipisah tanda hubung (`-`)
- Harus unik dalam satu subject
- Contoh: `aktivitas-7-diferensial-pair.mdx`

Buat file baru di folder yang sesuai:

```
src/content/elektronika-dasar/aktivitas-7-diferensial-pair.mdx
```

---

## Langkah 2 — Isi frontmatter

Salin templat berikut ke bagian atas file dan isi semua field:

```yaml
---
title: "Aktivitas 7: Pasangan Diferensial — Fondasi Op-Amp"
summary: "Pelajari cara kerja differential pair sebagai inti dari setiap op-amp dan ADC modern."
subject: elektronika-dasar
courseCode: TKI2H4
semester: 3
week: 12
order: 7
type: aktivitas
renderMode: standard
tags: [differential-pair, op-amp, common-mode-rejection]
prereq: ['aktivitas-4-common-source']
estimatedMinutes: 40
learningObjectives:
  - Mengidentifikasi sinyal common-mode dan differential-mode
  - Mengukur CMRR dari simulasi
---
```

Field yang **wajib diisi**: `title`, `summary`, `subject`, `courseCode`, `semester`, `order`, `type`.

Field opsional: `week`, `tags`, `prereq`, `estimatedMinutes`, `learningObjectives`.

Lihat referensi lengkap di `Tambah-Materi-Reference.md`.

---

## Langkah 3 — Tulis konten

Setelah frontmatter, tulis konten dalam Markdown + JSX. Import komponen di bagian atas (setelah baris `---` penutup frontmatter):

```mdx
import CircuitSim from '../../components/CircuitSim.svelte';
import Callout from '../../components/Callout.astro';
import Quiz from '../../components/Quiz.svelte';
```

Contoh struktur konten untuk satu aktivitas:

```mdx
<Callout variant="info" title="🎯 Skenario Nyata">

Setiap op-amp yang pernah Anda pakai — LM358, TL071, NE5532 — di dalamnya terdapat
sebuah *differential pair* sebagai tahap pertama. Aktivitas ini membongkar cara kerjanya.

</Callout>

<CircuitSim
  client:visible
  url="https://www.falstad.com/circuit/circuitjs.html?startCircuit=diffpair.txt"
  title="Simulasi Differential Pair"
  caption="Ubah tegangan masukan V1 dan V2. Amati kapan arus bergeser dari satu sisi ke sisi lain."
/>

## Aktivitas Eksplorasi

1. Atur V1 = V2 = 1 V (common-mode). Berapa I_D masing-masing MOSFET?
2. Buat V1 = 1,1 V, V2 = 0,9 V (sinyal diferensial kecil). Apa yang berubah?

<Callout variant="catatan" title="💭 Pertanyaan Refleksi">

Mengapa differential pair sangat kebal terhadap noise yang mengenai kedua input sekaligus?

</Callout>

## Kaitan dengan Teori

$$A_{diff} = g_m R_D, \quad \text{CMRR} = \frac{A_{diff}}{A_{cm}} = 2 g_m R_{SS}$$
```

---

## Langkah 4 — Jalankan validasi

```bash
pnpm validate
```

Perintah ini menjalankan DFS pada graf prereq. Jika Anda menambahkan `prereq` yang membentuk siklus, validator akan gagal dan mencetak jalur siklus tersebut.

Contoh output sukses:
```
  ok: Prereq graph is acyclic (7 topics checked).
```

---

## Langkah 5 — Cek di browser

```bash
pnpm dev
```

Buka `http://localhost:4321`. Topik baru Anda akan muncul di:
- Halaman kurikulum utama (`/`)
- Daftar aktivitas di `/elektronika-dasar`
- Halaman individual di `/elektronika-dasar/aktivitas-7-diferensial-pair`

---

## Langkah 6 — Build final

```bash
pnpm build
```

Build menjalankan validasi + Zod schema check secara otomatis. Jika ada field frontmatter yang salah tipe atau hilang, Astro akan melempar error dengan pesan yang jelas.

---

## Troubleshooting umum

| Gejala | Kemungkinan penyebab |
|---|---|
| `pnpm build` error Zod | Field frontmatter hilang atau tipe salah — baca pesan error Astro |
| `pnpm validate` gagal dengan "Cycle detected" | `prereq` Anda membentuk siklus — periksa rantai prereq |
| Halaman 404 saat `pnpm dev` | Slug di URL tidak cocok dengan nama file — pastikan konsisten |
| Math tidak render | Pastikan menggunakan `$$...$$` untuk display math dan `$...$` untuk inline |
| CircuitSim tidak muncul | Cek apakah `client:visible` ada pada tag komponen di MDX |
