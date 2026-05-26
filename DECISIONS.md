# DECISIONS.md — Keputusan Implementasi

Dokumen ini mencatat keputusan non-obvious yang diambil saat mengimplementasikan S1TK Notebook, beserta alasannya. Dimaksudkan untuk membantu pengembang berikutnya memahami "mengapa" di balik pilihan-pilihan tertentu.

---

## 1. Content collection bernama `topics` dengan glob loader

**Keputusan:** Satu collection `topics` dengan `loader: glob({ base: './src/content' })`, bukan satu collection per subject folder.

**Alasan:** Astro v5 memperkenalkan Content Layer API baru yang menggunakan `loader`. Pendekatan ini:
- Memungkinkan `getCollection('topics')` mengambil semua topik lintas subject sekaligus (berguna untuk halaman kurikulum utama dan nav)
- Menghindari keharusan mendaftarkan collection baru setiap kali subject baru ditambahkan
- Entry `id` berformat `subject/slug` sehingga subject tetap bisa diekstrak

**Trade-off:** Semua topik berada dalam satu collection, jadi filter per subject harus dilakukan secara manual via `getCollection('topics', t => t.data.subject === 'elektronika-dasar')`. Ini masih lebih sederhana daripada mendaftarkan collection baru.

---

## 2. Halaman subject `/elektronika-dasar/index.astro` dibuat statis, bukan `[subject]/index.astro`

**Keputusan:** `src/pages/elektronika-dasar/index.astro` (file statis), bukan `src/pages/[subject]/index.astro` (rute dinamis).

**Alasan:** Konten "Mengapa Modul Ini Penting" di halaman overview subject bersifat spesifik per mata kuliah dan tidak mudah diabstraksikan ke template generik. Membuat file statis per subject lebih mudah dipahami dosen yang menambah konten, dan tidak ada kerugian performa karena output tetap static.

Ketika subject baru ditambahkan, cukup buat `src/pages/[nama-subject]/index.astro` baru.

---

## 3. Svelte 5 runes syntax digunakan secara selektif

**Keputusan:** `$state()`, `$props()`, dan `$effect()` digunakan di komponen Svelte, bukan `export let` dan `onMount` saja.

**Alasan:** `@astrojs/svelte` menginstal Svelte 5. Runes adalah API resmi Svelte 5. Komponen yang sudah dibuat dengan runes (`CircuitSim`, `Quiz`, `InlineAnnotator`, dll.) tetap bekerja di Svelte 5, dan lebih idiomatis untuk versi ini.

---

## 4. `InlineAnnotator` tidak re-apply highlight dari localStorage saat mount

**Keputusan:** Implementasi awal tidak menyimpan XPath/offset dari highlight ke localStorage sehingga highlight tidak di-restore setelah reload.

**Alasan:** Re-applying DOM mutations dari localStorage memerlukan serialisasi XPath atau node reference yang kompleks dan rentan terhadap perubahan DOM (misalnya jika konten MDX berubah). Untuk v1, state tersimpan dalam memori selama sesi berlangsung. Fitur restore-on-reload ditandai sebagai enhancement untuk v2.

---

## 5. `pnpm` sebagai package manager

**Keputusan:** Proyek menggunakan `pnpm`, bukan `npm`.

**Alasan:** `npm install` mengalami masalah `EBUSY` pada Windows karena konflik binary esbuild. `pnpm` berhasil menginstal semua dependensi tanpa masalah.

---

## 6. Content config di `src/content.config.ts`, bukan `src/content/config.ts`

**Keputusan:** File konfigurasi koleksi berada di `src/content.config.ts`.

**Alasan:** Astro v6 menghapus dukungan untuk lokasi lama `src/content/config.ts` dan sekarang **mengharuskan** file ada di `src/content.config.ts`. Build akan gagal dengan `LegacyContentConfigError` jika file ada di lokasi lama.

---

## 7. KaTeX CSS dimuat dari CDN

**Keputusan:** `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.17.0/dist/katex.min.css" />` di `NoteLayout.astro`.

**Alasan:** `rehype-katex` menghasilkan HTML dengan class KaTeX tetapi tidak secara otomatis menyertakan CSS. Memuat dari CDN adalah cara yang paling sederhana. Untuk deployment offline, CSS bisa di-copy ke `public/` dan direferensikan secara lokal.
