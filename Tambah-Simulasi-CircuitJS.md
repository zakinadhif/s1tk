# Tambah Simulasi CircuitJS — Panduan

Komponen `CircuitSim` menyematkan simulasi [Falstad CircuitJS](https://www.falstad.com/circuit/) sebagai instrumen lab interaktif langsung di dalam artikel.

---

## Import komponen

Di bagian atas file `.mdx`, tambahkan:

```mdx
import CircuitSim from '../../components/CircuitSim.svelte';
```

---

## Cara 1 — Pakai sirkuit bawaan Falstad (`?startCircuit=`)

Falstad menyediakan puluhan sirkuit contoh yang bisa dipanggil dengan nama file:

```mdx
<CircuitSim
  client:visible
  url="https://www.falstad.com/circuit/circuitjs.html?startCircuit=nmosfet.txt"
  title="Simulasi n-MOSFET — Tegangan Batas dan Mode Operasi"
  caption="Geser slider V_GS dan V_DS. Amati kapan arus mulai mengalir."
/>
```

Beberapa nama sirkuit yang berguna:

| Nama file | Konten |
|---|---|
| `nmosfet.txt` | n-MOSFET dasar |
| `pmosfet.txt` | p-MOSFET dasar |
| `mosfetamp.txt` | Penguat common-source |
| `mosfollower.txt` | Source follower |
| `npn.txt` | Transistor NPN BJT |
| `cmos.txt` | Gerbang inverter CMOS |

---

## Cara 2 — Pakai sirkuit kustom (`?cct=`)

Untuk sirkuit yang Anda buat sendiri di editor Falstad:

1. Buka [falstad.com/circuit](https://www.falstad.com/circuit/)
2. Rancang atau modifikasi sirkuit Anda
3. Klik **File → Export URL → Copy**
4. URL yang disalin berisi parameter `?cct=...` yang meng-encode sirkuit Anda

**Contoh dari Aktivitas 4 (Common-Source Amplifier):**

```mdx
<CircuitSim
  client:visible
  url="https://www.falstad.com/circuit/circuitjs.html?cct=$+1+0.000005+..."
  title="Penguat Common-Source — Dual-Channel Oscilloscope"
  caption="Ubah amplitudo sinyal masukan. Amati clipping saat amplitudo terlalu besar."
/>
```

> **Catatan:** URL `?cct=` bisa sangat panjang (ratusan karakter). Ini normal — seluruh sirkuit dikodekan di URL.

---

## Prop `pending={true}` — Simulasi belum siap

Gunakan `pending={true}` ketika URL simulasi belum tersedia (masih dalam persiapan tim dosen):

```mdx
<CircuitSim
  client:visible
  url="https://www.falstad.com/circuit/circuitjs.html?cct=PENDING"
  title="Simulasi Penguat Common-Gate"
  caption="Simulasi ini akan menampilkan perbandingan fasa CS vs CG."
  pending={true}
/>
```

Hasilnya: kartu placeholder bertuliskan *"Simulasi sedang disiapkan oleh tim dosen."* ditampilkan. Tidak ada iframe yang dimuat.

---

## Menulis caption yang baik

Caption yang baik **mengarahkan pengamatan**, bukan hanya mendeskripsikan sirkuit.

❌ Buruk:
```
caption="Ini adalah simulasi MOSFET n-channel."
```

✅ Baik (dari Aktivitas 1):
```
caption="Geser slider V_GS dan V_DS. Amati kapan arus mulai mengalir dan kapan kurva mendatar."
```

✅ Baik (dari Aktivitas 4):
```
caption="Ubah amplitudo sinyal masukan. Amati pembalikan fasa dan pemotongan sinyal saat amplitudo terlalu besar."
```

---

## Semua props `CircuitSim`

| Prop | Tipe | Default | Keterangan |
|---|---|---|---|
| `url` | `string` | — | URL Falstad (wajib) |
| `title` | `string` | — | Label di atas frame (wajib) |
| `caption` | `string` | `''` | Teks penjelasan di bawah frame |
| `height` | `number` | `480` | Tinggi iframe dalam piksel |
| `pending` | `boolean` | `false` | Tampilkan placeholder "sedang disiapkan" |

---

## Penting: selalu pakai `client:visible`

```mdx
<CircuitSim client:visible url="..." title="..." />
```

`client:visible` memberitahu Astro untuk **menunda hydration** komponen ini sampai ia muncul di viewport. Karena satu halaman bisa memiliki 4–6 simulasi, ini mencegah browser memuat 6 iframe sekaligus saat halaman dibuka.

Jangan gunakan `client:load` untuk `CircuitSim` — iframe Falstad cukup berat dan tidak perlu dimuat sebelum terlihat.
