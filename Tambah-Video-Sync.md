# Tambah Video Sync — Panduan

Mode `video-sync` menampilkan video YouTube di sidebar kanan dan secara otomatis menyorot bagian artikel yang sedang dibahas sesuai timestamp video. Klik timestamp di artikel akan seek video ke posisi tersebut.

---

## Kapan menggunakan video-sync

Gunakan `renderMode: 'video-sync'` hanya ketika:
- Ada rekaman video kuliah yang menjelaskan konten secara linear
- Setiap bagian besar artikel sesuai dengan segmen waktu di video

Untuk materi tanpa video, gunakan `renderMode: 'standard'` (default).

---

## Langkah 1 — Dapatkan YouTube Video ID

Video ID adalah bagian setelah `v=` di URL YouTube:

```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                ^^^^^^^^^^^^ ini Video ID-nya
```

---

## Langkah 2 — Buat `videoSectionMap`

`videoSectionMap` adalah array yang memetakan setiap bagian artikel (berdasarkan `id` HTML-nya) ke rentang waktu video (dalam detik).

Cara menentukan `id` bagian:
- Setiap heading `##` di MDX otomatis mendapat `id` dari teks heading-nya dalam kebab-case
- Heading `## Aktivitas Eksplorasi` → `id="aktivitas-eksplorasi"`
- Heading `## Kaitan dengan Teori` → `id="kaitan-dengan-teori"`

Cara menentukan `start` dan `end`:
- Putar video, catat timestamp (dalam detik) saat dosen mulai membahas tiap bagian
- Gunakan konversi: 1:23 = 83 detik, 5:30 = 330 detik

**Contoh frontmatter:**

```yaml
---
title: "Aktivitas 4: Penguat Common-Source"
subject: elektronika-dasar
courseCode: TKI2H4
semester: 3
week: 10
order: 4
type: aktivitas
renderMode: video-sync
videoId: "dQw4w9WgXcQ"
videoSectionMap:
  - id: "skenario-nyata"
    start: 0
    end: 95
  - id: "aktivitas-eksplorasi"
    start: 95
    end: 310
  - id: "pertanyaan-refleksi"
    start: 310
    end: 420
  - id: "kaitan-dengan-teori"
    start: 420
    end: 600
---
```

---

## Langkah 3 — Tambahkan timestamp anchors di konten

Di dalam teks artikel, Anda bisa menambahkan link yang akan seek video ke posisi tertentu:

```mdx
Perhatikan bahwa pada menit <a class="ts-anchor" data-seconds={145}>2:25</a>,
dosen mendemonstrasikan bagaimana sinyal keluaran mulai terpotong (*clipping*).
```

Atribut `data-seconds` berisi posisi video dalam detik. Teks di antara tag adalah label yang tampil (biasanya format `m:ss`).

---

## Langkah 4 — Pastikan section IDs cocok

Heading di MDX menghasilkan `id` otomatis. Pastikan `id` di `videoSectionMap` cocok dengan yang dihasilkan Astro:

| Heading MDX | ID yang dihasilkan |
|---|---|
| `## Aktivitas Eksplorasi` | `aktivitas-eksplorasi` |
| `## Kaitan dengan Teori` | `kaitan-dengan-teori` |
| `## Skenario Nyata` | `skenario-nyata` |

Jika tidak yakin, buka halaman di browser dan inspect elemen heading untuk melihat `id`-nya.

---

## Perilaku video sync

- **Auto-scroll**: saat video berjalan, artikel otomatis scroll ke bagian yang sedang dibahas, dan bagian tersebut disorot dengan warna kuning.
- **Manual scroll override**: jika pengguna scroll sendiri, auto-scroll ditunda selama 3 detik. Muncul tombol **"▶ Ikuti Video Lagi"** untuk kembali ke mode auto.
- **Seek via timestamp**: klik `<a class="ts-anchor">` akan seek video dan memulai playback dari posisi itu.
