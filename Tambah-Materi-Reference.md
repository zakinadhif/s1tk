# Referensi Cepat — Komponen dan Frontmatter

---

## Frontmatter — Semua Field

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `title` | `string` | ✅ | Judul lengkap topik |
| `summary` | `string` (maks 200 karakter) | ✅ | Ringkasan satu kalimat untuk kartu kurikulum |
| `subject` | `string` | ✅ | Slug folder subject, misal `elektronika-dasar` |
| `courseCode` | `string` | ✅ | Kode mata kuliah, misal `TKI2H4` |
| `semester` | `number` (1–8) | ✅ | Semester di mana mata kuliah ini ditawarkan |
| `order` | `number` | ✅ | Urutan dalam daftar topik (integer, mulai dari 1) |
| `type` | `'aktivitas' \| 'materi' \| 'kuis' \| 'praktikum' \| 'referensi'` | ✅ | Jenis konten |
| `renderMode` | `'standard' \| 'video-sync'` | — | Default: `standard`. Gunakan `video-sync` jika ada YouTube |
| `week` | `number` | — | Pekan kuliah |
| `tags` | `string[]` | — | Kata kunci untuk pencarian di masa depan |
| `prereq` | `string[]` | — | Array slug yang harus diselesaikan sebelum ini |
| `learningObjectives` | `string[]` | — | Tujuan pembelajaran, ditampilkan di header halaman |
| `estimatedMinutes` | `number` | — | Estimasi waktu pengerjaan, ditampilkan di header |
| `videoId` | `string` | — | YouTube video ID (wajib jika `renderMode: 'video-sync'`) |
| `videoSectionMap` | `{ id, start, end }[]` | — | Peta bagian video ke section heading (wajib jika video-sync) |

**Contoh lengkap dari seed content:**

```yaml
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
tags: [mosfet, nmos, threshold-voltage, triode, saturation]
prereq: []
estimatedMinutes: 30
learningObjectives:
  - Mengidentifikasi tegangan batas V_t dari kurva simulasi
  - Membedakan perilaku MOSFET di mode triode dan saturasi
---
```

---

## Math

**Display math** (persamaan di baris terpisah):

```
$$I_D = \tfrac{1}{2} k_n (V_{GS} - V_t)^2$$
```

Hasil:

$$I_D = \tfrac{1}{2} k_n (V_{GS} - V_t)^2$$

**Inline math** (dalam kalimat):

```
Nilai $V_{GS}$ yang lebih besar menghasilkan $I_D$ yang lebih besar.
```

---

## Komponen `Callout`

```astro
import Callout from '../../components/Callout.astro';
```

| Variant | Kapan dipakai |
|---|---|
| `info` | Skenario nyata, konteks industri |
| `tip` | Penjelasan, insight tambahan |
| `warning` | Peringatan, hal yang sering salah |
| `danger` | Kesalahan fatal yang harus dihindari |
| `catatan` | Pertanyaan refleksi, catatan dari dosen |

**Contoh dari Aktivitas 1:**

```mdx
<Callout variant="info" title="🎯 Skenario Nyata">

Bayangkan Anda sedang men-*debug* sebuah rangkaian *gate driver* untuk MOSFET daya...

</Callout>
```

```mdx
<Callout variant="catatan" title="💭 Pertanyaan Refleksi">

- Pada V_GS = 3 V dan V_t = 1,5 V, berapa nilai V_DS yang menjadi batas triode/saturasi?
- Mengapa MOSFET sebagai switch digital beroperasi di mode triode saat on?

</Callout>
```

---

## Komponen `Quiz`

```astro
import Quiz from '../../components/Quiz.svelte';
```

**Contoh soal pilihan tunggal:**

```mdx
<Quiz
  client:visible
  question="Pada mode saturasi, apa yang terjadi pada I_D jika V_DS terus dinaikkan?"
  options={[
    "I_D terus bertambah secara linier",
    "I_D tetap konstan (tidak berubah signifikan)",
    "I_D berkurang karena MOSFET mulai terbakar",
    "I_D bertambah secara kuadratik"
  ]}
  correctIndex={1}
  explanation="Di mode saturasi, saluran konduksi mengalami pinch-off di dekat drain. Penambahan V_DS tidak lagi memperlebar saluran, sehingga I_D menjadi hampir konstan — itulah yang Anda amati di langkah 4 Aktivitas 1."
/>
```

**Contoh soal multi-jawaban:**

```mdx
<Quiz
  client:visible
  question="Mana dari berikut yang merupakan aplikasi konfigurasi source follower?"
  options={[
    "Tahap output op-amp",
    "Penguat pertama receiver radio",
    "Buffer antara DAC dan jack headphone",
    "LNA pada modem 5G"
  ]}
  correctIndex={[0, 2]}
  explanation="Source follower (common-drain) dipakai sebagai buffer berimpedansi rendah. Op-amp output stage dan DAC-to-headphone driver adalah contoh klasiknya. LNA RF lebih cocok pakai common-gate."
/>
```

Props:
- `question` — teks pertanyaan
- `options` — array pilihan jawaban
- `correctIndex` — indeks jawaban benar (angka untuk single, array untuk multi)
- `explanation` — teks penjelasan yang muncul setelah submit

---

## Komponen `Sticker`

```astro
import Sticker from '../../components/Sticker.astro';
```

```mdx
<Sticker variant="lab">Lab Week 8</Sticker>
<Sticker variant="week" rotate={2}>Pekan 10</Sticker>
<Sticker variant="type" rotate={-4}>Aktivitas</Sticker>
```

Variants: `type` (kuning), `week` (biru), `lab` (hijau).

---

## Komponen `CircuitSim`

Lihat `Tambah-Simulasi-CircuitJS.md` untuk panduan lengkap.

```mdx
import CircuitSim from '../../components/CircuitSim.svelte';

<CircuitSim
  client:visible
  url="https://www.falstad.com/circuit/circuitjs.html?startCircuit=nmosfet.txt"
  title="Simulasi n-MOSFET"
  caption="Geser slider V_GS dan V_DS."
/>
```
