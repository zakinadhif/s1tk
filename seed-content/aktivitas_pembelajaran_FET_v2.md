# Aktivitas Pembelajaran Interaktif — Transistor Efek Medan (FET)

**Mata Kuliah:** Elektronika Dasar (TKI2H4)
**Capaian Pembelajaran:** CLO 3 — Transistor Efek Medan
**Prodi S1 Teknik Komputer — Fakultas Teknik Elektro — Universitas Telkom**

---

# 🌐 Mengapa Modul Ini Penting bagi Anda?

Ambil ponsel Anda sekarang. Di dalam *chip* prosesornya, terdapat sekitar **15–20 miliar transistor MOSFET** yang masing-masing beroperasi persis seperti yang akan Anda eksplorasi di modul ini. Setiap kali Anda mengirim pesan WhatsApp, transistor-transistor itu menyala dan mati miliaran kali per detik.

Pertanyaannya: **Anda mau jadi orang yang memakai *chip* itu, atau orang yang merancangnya?**

Sebagai mahasiswa Teknik Komputer, FET bukan sekadar topik kuliah yang perlu dilewati untuk lulus. FET adalah komponen dasar dari:

- 🖥️ **Setiap CPU, GPU, dan mikrokontroler** yang akan Anda program — dari ESP32 di proyek IoT Anda hingga prosesor Apple M-series di MacBook.
- 📡 **Setiap modem nirkabel** — Wi-Fi 6, 5G, Bluetooth — bagian RF-nya dipenuhi penguat FET.
- 🔋 **Sistem manajemen daya** di setiap perangkat baterai — laptop, smartphone, drone, kendaraan listrik.
- 🎧 **Antarmuka audio dan sensor** — *amplifier* mikrofon, *driver* speaker, pembaca sensor IMU pada *wearable*.
- 🏭 **Industri semikonduktor Indonesia yang sedang tumbuh** — Batam dan KEK lain mulai menarik investasi *fab* dan *backend assembly*. Insinyur yang memahami FET pada level ini punya peluang karir yang langka di Indonesia.

Pemahaman tentang cara kerja FET — bukan sekadar rumusnya, tapi **intuisi tentang bagaimana ia berperilaku ketika tegangan berubah** — adalah perbedaan antara insinyur yang bisa men-*debug* perangkat keras dan yang hanya bisa menyalahkan *driver* atau *firmware*.

Modul ini dirancang agar Anda mendapatkan intuisi itu, **bukan dengan menghafal rumus**, tetapi dengan **memutar-mutar parameter dalam simulasi *real-time*** dan mengamati apa yang sebenarnya terjadi.

---

## Cara Menggunakan Modul Ini

Setiap aktivitas terdiri dari empat bagian:

1. **🎯 Skenario Nyata** — kapan dan di mana konsep ini muncul di dunia kerja.
2. **🔬 Aktivitas Eksplorasi** — langkah eksperimen dengan simulasi.
3. **💭 Pertanyaan Refleksi** — untuk mengikat pemahaman.
4. **📐 Kaitan dengan Teori** — rumus muncul *setelah* Anda mengamati fenomena.

Susun urutan ini: **pengamatan dulu, rumus belakangan**. Itulah cara insinyur sungguhan belajar.

---

# 📘 Pekan 8 — Dasar-dasar Field Effect Transistor

## Aktivitas 1: Pembentukan Saluran dan Mode Operasi MOSFET-n

🔗 **Simulasi:** [Buka simulasi n-MOSFET](https://www.falstad.com/circuit/circuitjs.html?startCircuit=nmosfet.txt)

### 🎯 Skenario Nyata

Bayangkan Anda sedang men-*debug* sebuah rangkaian *gate driver* untuk MOSFET daya pada papan kontrol motor BLDC drone Anda. Drone tidak terbang, motor tidak berputar. Anda mengukur dengan multimeter: tegangan gerbang MOSFET hanya 2 V, sedangkan datasheet MOSFET tersebut menyatakan V_GS(th) = 3,5 V.

**Masalah ketemu.** MOSFET tidak pernah benar-benar *on* karena V_GS belum melampaui tegangan batasnya. Aktivitas ini akan memberi Anda intuisi langsung tentang apa yang sebenarnya terjadi pada level transistor saat V_GS naik dan melewati V_t — pengetahuan yang akan menyelamatkan Anda berjam-jam *debugging* di proyek nyata.

### 🔬 Aktivitas Eksplorasi

1. **Amati kondisi awal.** Berapa nilai V_GS dan V_DS saat ini? Apakah ada arus yang mengalir? Hitung dot arus yang berkedip pada kawat.

2. **Cari tegangan batas V_t.** Geser *slider* V_GS perlahan dari 0 V ke atas. Pada nilai berapa arus mulai mengalir? Catat nilai ini — inilah V_t dari MOSFET dalam simulasi.

3. **Eksplorasi mode triode.** Atur V_GS = 3 V. Geser V_DS dari 0 V ke atas secara perlahan. Pada V_DS kecil (misal 0,5 V), perhatikan bahwa I_D bertambah hampir linier seiring V_DS. MOSFET di mode triode berperilaku seperti **resistor yang dikontrol tegangan** — properti yang dimanfaatkan dalam *analog switch* dan *variable gain amplifier*.

4. **Eksplorasi mode saturasi.** Lanjutkan menaikkan V_DS hingga 5 V. Amati bahwa pada satu titik, I_D **berhenti bertambah** meskipun V_DS terus dinaikkan. Inilah batas antara mode triode dan saturasi — dan inilah mode yang dipakai untuk penguatan sinyal.

5. **Ulangi dengan V_GS berbeda.** Ubah V_GS menjadi 2 V, lalu 4 V, dan amati bagaimana titik batas triode/saturasi bergeser.

### 💭 Pertanyaan Refleksi

- Pada V_GS = 3 V dan V_t = 1,5 V, berapa nilai V_DS yang menjadi batas antara mode triode dan saturasi? Bandingkan dengan hasil pengamatan Anda di langkah 4.
- Mengapa MOSFET yang dipakai sebagai *switch* digital (misal di gerbang logika CMOS) sengaja dirancang agar beroperasi di mode triode saat *on*?
- Mengapa MOSFET yang dipakai sebagai penguat analog (audio, RF) justru harus dijaga di mode saturasi?

### 📐 Kaitan dengan Teori

Batas antara mode triode dan saturasi terjadi pada V_DS = V_GS − V_t, yaitu pada **tegangan overdrive V_OV**. Di mode triode, arus mengikuti:

$$I_D = k_n (V_{GS} - V_t) V_{DS} - \tfrac{1}{2} k_n V_{DS}^2$$

Di mode saturasi, arus menjadi konstan terhadap V_DS:

$$I_D = \tfrac{1}{2} k_n (V_{GS} - V_t)^2$$

Pengamatan Anda di langkah 4 adalah visualisasi langsung dari fenomena saturasi arus ini — mekanisme fisik yang memungkinkan penguatan sinyal di seluruh dunia elektronik analog.

---

## Aktivitas 2: Simetri MOSFET-p dan Mengapa Smartphone Anda Tidak Meleleh

🔗 **Simulasi:** [Buka simulasi p-MOSFET](https://www.falstad.com/circuit/circuitjs.html?startCircuit=pmosfet.txt)

### 🎯 Skenario Nyata

Ponsel pintar Anda berisi sekitar 15 miliar transistor, namun saat *idle*, ia mengonsumsi hanya beberapa miliwatt — tidak meleleh, tidak meledak. Bagaimana bisa?

Jawabannya: **teknologi CMOS** — *Complementary* MOS — yang memasangkan MOSFET-n dengan MOSFET-p sehingga **hanya salah satu yang aktif pada satu waktu**. Saat output gerbang logika dalam keadaan stabil (tidak sedang berganti), arus statis yang mengalir mendekati nol.

PMOS adalah pasangan komplementer dari NMOS yang Anda pelajari di Aktivitas 1. Tanpa PMOS, prosesor laptop Anda akan butuh pendingin seukuran AC ruangan. Aktivitas ini akan membangun intuisi Anda tentang dualitas NMOS–PMOS yang menjadi fondasi seluruh industri komputasi modern.

### 🔬 Aktivitas Eksplorasi

1. Amati bahwa pada simulasi, sumber (source) PMOS sekarang terhubung ke tegangan positif, dan *drain* di sisi lebih rendah.

2. Geser V_GS ke arah **lebih negatif** (turun dari 0 V). Pada nilai berapa arus mulai mengalir?

3. Bandingkan arah aliran arus dengan kasus NMOS pada Aktivitas 1. Apakah arah arus pada saluran (dari S ke D atau sebaliknya) berlawanan?

### 💭 Pertanyaan Refleksi

- Mengapa PMOS membutuhkan V_GS yang **lebih negatif** untuk *turn-on*? (Petunjuk: pikirkan jenis pembawa muatan yang membentuk saluran.)
- Dalam gerbang inverter CMOS (sebuah NOT gate), input dihubungkan ke *gate* NMOS **dan** PMOS sekaligus. Ketika input HIGH, manakah yang *on*? Ketika input LOW, manakah yang *on*? Mengapa konfigurasi ini membuat konsumsi daya statis mendekati nol?
- Para perancang *chip* sering mengeluh bahwa PMOS "lebih lambat" daripada NMOS dengan ukuran sama. Konsekuensinya, dalam tata letak nyata, PMOS dibuat 2–3x lebih besar. Mengapa demikian? (Petunjuk: mobilitas elektron vs *holes*.)

---

# 📗 Pekan 9 — FET pada Rangkaian DC (Pra-tegangan)

## Aktivitas 3: Titik Kerja (Q-point) — Mengapa Amplifier DIY Sering Terdengar Buruk

🔗 **Simulasi:** [Buka simulasi Pra-tegangan FET](#) *(tautan akan dibuat oleh tim dosen)*

### 🎯 Skenario Nyata

Anda merancang *headphone amplifier* DIY berbasis MOSFET untuk proyek akhir semester. Skematiknya sempurna di simulasi LTspice. Anda merakit di PCB, mencolokkan headphone... dan suaranya **buruk**: pelan di satu sisi, terdistorsi di sisi lain, atau diam total. Apa yang salah?

**90% dari masalah seperti ini adalah pra-tegangan (biasing) yang tidak tepat.** MOSFET Anda mungkin terjebak di mode triode, atau bahkan *cutoff*, sehingga tidak bisa menguatkan sinyal AC dengan benar. Lebih parah lagi: titik kerja yang awalnya benar bisa "*drift*" karena suhu, variasi parameter MOSFET dari batch ke batch, atau bahkan kelembapan udara.

Aktivitas ini akan membangun intuisi Anda tentang **stabilitas titik kerja** — pengetahuan yang membedakan penguat amatir yang berbunyi serak dari penguat profesional yang berbunyi jernih dan tahan lama.

### 🔬 Aktivitas Eksplorasi

1. **Catat titik kerja awal.** Buka simulasi dan catat nilai V_GS, V_DS, dan I_D yang ditampilkan voltmeter. Apakah MOSFET berada di mode saturasi? (Cek: apakah V_DS > V_GS − V_t?)

2. **Pengaruh R_D.** Klik kanan pada R_D, ubah nilainya menjadi dua kali lipat (misal dari 4,7 kΩ menjadi 10 kΩ). Apa yang terjadi pada V_DS? Apakah MOSFET masih di mode saturasi?

3. **Mendorong ke mode triode.** Terus naikkan R_D hingga V_DS turun di bawah (V_GS − V_t). Inilah skenario di mana penguat audio Anda akan **terdengar terdistorsi parah** — MOSFET tidak lagi linier.

4. **Pengaruh R_S (umpan balik diri).** Kembalikan R_D ke nilai semula. Ubah R_S menjadi dua kali lipat. Amati bahwa V_GS akan turun secara otomatis. Inilah trik insinyur untuk membuat titik kerja **stabil terhadap perubahan suhu** — komponen utama keandalan elektronik di lingkungan tropis Indonesia.

5. **Pengaruh pembagi tegangan gerbang.** Ubah R_G1 atau R_G2 dan amati pergeseran tegangan gerbang V_G.

### 💭 Pertanyaan Refleksi

- Mengapa R_S disebut sebagai resistor **umpan balik diri**? Apa yang terjadi pada V_GS jika I_D tiba-tiba naik karena suhu meningkat dari 25 °C ke 50 °C (skenario nyata di dalam casing perangkat embedded)?
- Bayangkan Anda mendesain *gain stage* sebuah penguat audio yang akan diproduksi 1000 unit. Variasi V_t antar-MOSFET dari batch yang sama bisa ±0,3 V. Mengapa rangkaian dengan R_S besar lebih "*production-friendly*" daripada rangkaian tanpa R_S?
- Pada langkah 3, ketika MOSFET masuk mode triode, mengapa rangkaian penguat **tidak akan bekerja dengan baik** untuk sinyal AC?

### 📐 Kaitan dengan Teori

Pada rangkaian pra-tegangan pembagi tegangan, persamaan utama yang harus dipenuhi adalah:

$$V_{GS} = V_G - I_D R_S, \quad I_D = \tfrac{1}{2} k_n (V_{GS} - V_t)^2$$

Kedua persamaan ini diselesaikan secara simultan untuk menemukan titik kerja. Simulasi ini memungkinkan Anda **melihat solusinya bergeser** ketika resistor berubah, tanpa harus menghitung ulang setiap kali — pengalaman yang persis mirip dengan apa yang Anda lakukan di *bench* lab nanti dengan trimpot di tangan.

---

# 📙 Pekan 10 — FET untuk Penguat Sinyal Kecil

## Aktivitas 4: Penguat Common-Source — Inti dari Setiap Mikrofon dan Pemancar Radio

🔗 **Simulasi:** [Buka simulasi Penguat Common-Source](https://www.falstad.com/circuit/circuitjs.html?startCircuit=mosfetamp.txt)

### 🎯 Skenario Nyata

Saat Anda berbicara di mikrofon *condenser* — baik di *headset* gaming, *podcast setup*, atau bahkan mikrofon ponsel Anda — sinyal listrik yang keluar dari kapsul mikrofon hanya **beberapa milivolt**. Itu terlalu kecil untuk diproses oleh ADC atau dikirim ke speaker. Yang menyelamatkannya adalah **penguat *common-source*** yang menempel langsung di kapsul mikrofon, mengangkat sinyal puluhan kali lipat dalam mikrodetik pertama sebelum gangguan masuk.

Konfigurasi yang sama ini juga ditemukan di:
- **Tahap pertama setiap penerima radio** (radio FM, Wi-Fi, Bluetooth, 5G)
- **Driver LED dengan modulasi PWM** untuk komunikasi optik (Li-Fi)
- **Penguat sensor *strain gauge*** pada *load cell* timbangan digital

Memahami penguat CS — terutama **mengapa keluarannya terbalik fasa** dan **kapan terjadi distorsi *clipping*** — adalah dasar untuk segala bentuk penguat sinyal modern.

### 🔬 Aktivitas Eksplorasi

1. **Amati dual-channel oscilloscope.** Simulasi menampilkan dua jejak: sinyal masukan v_gs dan sinyal keluaran v_ds. Perhatikan dua hal sekaligus:
   - Sinyal keluaran **jauh lebih besar amplitudonya** (inilah penguatan).
   - Sinyal keluaran **terbalik fasa** terhadap masukan (puncak masukan ↔ lembah keluaran).

2. **Ukur penguatan.** Estimasi amplitudo puncak-ke-puncak masukan dan keluaran dari layar oscilloscope. Hitung penguatan |A_v| = V_out_pp / V_in_pp. Apakah hasilnya beberapa puluh kali lipat?

3. **Naikkan amplitudo masukan secara bertahap.** Klik kanan pada sumber AC, ubah amplitudo dari 50 mV menjadi 200 mV, lalu 500 mV. Amati apa yang terjadi pada bentuk gelombang keluaran.

4. **Amati pemotongan sinyal (*clipping*).** Pada amplitudo masukan besar, sinyal keluaran tidak lagi berbentuk sinus murni — puncaknya **terpotong**. **Ini adalah suara "distorsi" yang Anda dengar saat speaker disetel terlalu keras.** Suara tersebut secara harfiah adalah bentuk gelombang yang Anda lihat sekarang di layar.

5. **Eksperimen dengan R_D.** Ubah nilai R_D. Apakah penguatan bertambah saat R_D dinaikkan? Mengapa?

### 💭 Pertanyaan Refleksi

- Saat Anda menekan tombol volume ponsel Anda terlalu tinggi dan musik mulai terdengar "pecah", apa yang sebenarnya terjadi di level transistor? (Petunjuk: lihat layar oscilloscope Anda di langkah 4.)
- Mengapa sinyal keluaran terbalik fasa 180° dari masukan? Hubungkan dengan persamaan v_ds = V_DD − i_d × R_D.
- Pada perancang penguat audio profesional, ada istilah "*headroom*" — jarak antara sinyal kerja normal dan batas *clipping*. Mengapa *headroom* yang lebih besar memerlukan tegangan suplai V_DD yang lebih tinggi, dan mengapa hal ini menjadi tantangan di perangkat *battery-powered*?

### 📐 Kaitan dengan Teori

Penguatan sinyal kecil rangkaian CS:

$$A_v = -g_m R_D, \quad g_m = k_n V_{OV} = \frac{2 I_D}{V_{OV}}$$

Tanda minus inilah yang Anda saksikan langsung sebagai pembalikan fasa pada oscilloscope. Fenomena *clipping* adalah konsekuensi alami dari syarat sinyal kecil **dilanggar** — MOSFET tidak lagi beroperasi pada segmen linier dari kurva v_DS vs v_GS.

---

# 📕 Pekan 11 — Konfigurasi Penguat FET

## Aktivitas 5: Source Follower — Mengapa Headphone Murah Bisa Bunyi Lewat Output Apa Saja

🔗 **Simulasi:** [Buka simulasi Source Follower](https://www.falstad.com/circuit/circuitjs.html?startCircuit=mosfollower.txt)

### 🎯 Skenario Nyata

Anda mencolokkan headphone Sennheiser HD650 (impedansi 300 Ω) ke ponsel Anda — bunyinya lemah. Lalu Anda mencolokkan headphone *earbud* murahan (impedansi 16 Ω) ke ponsel yang sama — bunyinya keras. Mengapa?

Jawabannya berkaitan dengan **impedansi keluaran** rangkaian penguat di dalam ponsel. Sinyal audio yang dihasilkan DAC ponsel sangat kecil dan dari sumber berimpedansi tinggi — jika langsung dihubungkan ke headphone, tegangan akan "jatuh" karena pembagian tegangan resistif. Solusinya: **source follower** sebagai penyangga di antara DAC dan jack headphone.

Source follower adalah konfigurasi yang **tidak menguatkan tegangan** (A_v ≈ 1), tetapi **menguatkan kemampuan menyuplai arus**. Dia adalah "buffer" — penyangga — antara dua sisi rangkaian yang impedansinya tidak cocok. Anda akan menemukan konfigurasi ini di:

- Tahap **output op-amp** (LM358, NE5532, dan ribuan IC lainnya)
- Tahap **output DAC** ke jack audio (HP, smartphone, USB DAC)
- **Sensor interface** seperti pH meter, *ECG amplifier* di alat medis
- **Voltage regulator** linier (LDO) — transistor pass di dalamnya bekerja persis sebagai source follower

### 🔬 Aktivitas Eksplorasi

1. Amati bahwa sinyal masukan diberikan ke kaki *gate*, dan sinyal keluaran diambil dari kaki *source* (bukan *drain*).

2. Bandingkan amplitudo sinyal masukan dan keluaran pada oscilloscope. Apakah keduanya hampir sama besar? Apakah fasanya **sama** (tidak terbalik)?

3. **Eksperimen impedansi keluaran rendah.** Tambahkan resistor beban R_L kecil (misal 1 kΩ) di keluaran (sejajar dengan R_S yang ada). Amati: sinyal keluaran **hampir tidak berubah** amplitudonya — ini bukti impedansi keluaran rendah. Bayangkan headphone berimpedansi 16 Ω yang dipasang di sini — source follower masih sanggup men-*drive*-nya.

4. **Bandingkan dengan CS amp.** Kembali ke Aktivitas 4 (CS amp) dan bayangkan apa yang akan terjadi jika beban 1 kΩ yang sama dipasang di keluarannya. CS amp akan kehilangan sebagian besar amplitudo karena impedansi keluarannya (R_D) terlalu tinggi.

### 💭 Pertanyaan Refleksi

- Mengapa source follower disebut "follower"? Apa yang "diikuti" oleh keluaran?
- Jika penguatan hanya ≈ 1, dalam hal apa source follower "menguatkan" sinyal? (Petunjuk: pikirkan **arus** dan **daya**, bukan tegangan.)
- Mengapa hampir setiap op-amp komersial memiliki tahap *output* berupa source follower (atau emitter follower untuk BJT)? Apa yang akan terjadi pada op-amp tanpa tahap *output buffer*?

### 📐 Kaitan dengan Teori

Penguatan source follower:

$$A_v = \frac{g_m R_S}{1 + g_m R_S} \approx 1 \quad \text{untuk } g_m R_S \gg 1$$

Impedansi keluarannya:

$$R_{out} \approx \frac{1}{g_m}$$

yang biasanya hanya puluhan hingga ratusan ohm — jauh lebih kecil dari R_D pada penguat CS. Inilah mengapa source follower bisa men-*drive* beban berimpedansi rendah tanpa kehilangan amplitudo signifikan.

---

## Aktivitas 6: Penguat Common-Gate — Mengapa 5G Anda Bisa Bekerja di Gigahertz

🔗 **Simulasi:** [Buka simulasi Penguat Common-Gate](#) *(tautan akan dibuat oleh tim dosen)*

### 🎯 Skenario Nyata

Modem 5G di ponsel Anda bekerja pada frekuensi 3,5 GHz — sinyalnya tiba dari antena dengan amplitudo dalam orde mikrovolt. Tahap pertama penguat yang menanganinya disebut **LNA (Low-Noise Amplifier)**, dan di hampir semua *receiver* RF modern, LNA dibangun dengan konfigurasi **common-gate** atau **cascode** (CS + CG ditumpuk).

Mengapa CG? Karena CG memiliki tiga properti unik yang membuatnya unggul di frekuensi tinggi:
1. **Impedansi masukan rendah** (≈ 1/g_m, biasanya 50 Ω) — **cocok langsung dengan impedansi antena**.
2. **Tidak ada efek Miller** (perkalian kapasitansi parasitik) — sehingga responsnya tetap baik hingga puluhan GHz.
3. **Keluaran sefasa** dengan masukan — memudahkan analisis dan desain *matching network*.

Setiap kali Anda streaming video di YouTube lewat 5G, **transistor common-gate sedang bekerja di ponsel Anda**. Aktivitas ini akan melengkapi pemahaman tiga konfigurasi penguat FET — fondasi seluruh elektronik komunikasi modern.

### 🔬 Aktivitas Eksplorasi

1. **Bandingkan fasa dengan CS.** Buka simulasi CS (Aktivitas 4) di satu tab, dan CG di tab lain. Amati bahwa pada CG, sinyal keluaran **tidak berbalik fasa** dari masukan. Inilah perbedaan paling mencolok antara CS dan CG.

2. **Ukur penguatan.** Estimasi |A_v| dari oscilloscope. Bandingkan dengan penguatan CS pada R_D yang sama — seharusnya hampir sama besarnya.

3. **Uji impedansi masukan rendah.** Tambahkan resistor sumber sinyal R_sig besar (misal 100 kΩ) di antara sumber sinyal dan kaki *source* MOSFET. Amati bahwa sinyal yang sampai ke MOSFET **turun drastis** — bukti impedansi masukan rendah.

4. **Bandingkan dengan CS.** Pada CS, R_sig 100 kΩ hampir tidak menurunkan sinyal karena impedansi masukan CS sangat tinggi. CG kebalikannya — impedansi rendah membuatnya cocok untuk antena 50 Ω, bukan untuk sumber sinyal generik.

### 💭 Pertanyaan Refleksi

- Tuliskan dalam tabel ringkas: untuk masing-masing dari CS, CD, dan CG, sebutkan (a) lokasi masukan/keluaran, (b) fasa keluaran, (c) penguatan tegangan, (d) impedansi masukan, (e) impedansi keluaran, (f) aplikasi tipikal.
- Mengapa LNA 5G hampir selalu menggunakan topologi *cascode* (CS + CG bertumpuk), bukan CS saja? Apa kontribusi unik CG di sini?
- Bayangkan Anda merancang *front-end* receiver Wi-Fi 6 (5,8 GHz) untuk papan IoT. Mengapa Anda **tidak akan** memilih konfigurasi CS untuk tahap pertama setelah antena?

### 📐 Kaitan dengan Teori

Penguatan dan impedansi CG:

$$A_v = +g_m R_D \quad \text{(perhatikan tanda positif — keluaran sefasa!)}$$
$$R_{in} = \frac{1}{g_m}$$

Tanda positif pada A_v inilah yang menyebabkan keluaran sefasa dengan masukan — kontras dengan CS yang bertanda negatif. Inilah trik elegan elektronika analog: konfigurasi yang sama (MOSFET tunggal) menghasilkan **tiga karakteristik berbeda** hanya dengan mengubah kaki mana yang menjadi masukan dan keluaran.

---

# 🎯 Sintesis: Bagaimana Tiga Konfigurasi Ini Hidup Berdampingan

Setelah menyelesaikan keenam aktivitas, Anda diharapkan dapat melengkapi tabel berikut tanpa melihat buku:

| Karakteristik | Common-Source (CS) | Common-Drain (CD) | Common-Gate (CG) |
|---|---|---|---|
| Masukan di kaki | ? | ? | ? |
| Keluaran di kaki | ? | ? | ? |
| Fasa keluaran | ? | ? | ? |
| Penguatan tegangan \|A_v\| | ? | ? | ? |
| Impedansi masukan R_in | ? | ? | ? |
| Impedansi keluaran R_out | ? | ? | ? |
| Aplikasi tipikal | ? | ? | ? |

**Mengapa harus ada tiga konfigurasi?** Karena tidak ada satu pun yang sempurna untuk semua tugas. Insinyur analog yang baik bukan yang menghafal satu konfigurasi "terbaik", melainkan yang tahu **kapan memakai yang mana** dan **bagaimana menggabungkannya** (seperti cascode CS+CG, atau CS+CD untuk *output buffer*).

Inilah inti elektronik analog: **memilih *trade-off* yang tepat** untuk masalah Anda.

---

# 🚀 Ke Mana Setelah Ini?

Pengetahuan yang Anda bangun di modul ini akan menjadi fondasi untuk:

- **Mata kuliah lanjutan** — Elektronika Digital (CMOS gate design), Rangkaian Terpadu (IC design), Sistem Komunikasi (RF front-end).
- **Proyek hands-on** — Anda akan merancang penguat audio, sensor interface, atau LNA sederhana di mata kuliah praktikum.
- **Karir di industri** — Indonesia sedang membangun ekosistem semikonduktor (KEK Batam, kolaborasi dengan TSMC dan Samsung). Insinyur yang memahami FET pada level transistor — bukan sekadar level board — punya peluang yang langka.
- **Open source hardware** — Komunitas global seperti Tiny Tapeout dan SkyWater PDK kini memungkinkan mahasiswa mendesain *chip* sendiri dengan teknologi 130 nm secara gratis. Modul ini adalah persiapan langsung untuk itu.

---

# 📋 Pedoman Pelaporan

Setelah menyelesaikan setiap aktivitas, susun laporan singkat yang memuat:

1. **Pengamatan kuantitatif** — Angka-angka yang Anda baca dari simulasi.
2. **Pengamatan kualitatif** — Apa yang berubah ketika Anda mengubah suatu komponen.
3. **Hubungan dengan teori** — Bagaimana pengamatan Anda mengonfirmasi (atau menantang) persamaan teoritis.
4. **Jawaban pertanyaan refleksi** — Tulis dengan kata-kata Anda sendiri.
5. **Koneksi ke aplikasi nyata** — Jika konsep ini muncul di perangkat yang Anda gunakan sehari-hari, sebutkan di mana dan mengapa.

---

*Pemahaman terbaik tentang elektronika datang dari mengubah parameter dan mengamati apa yang terjadi — bukan dari menghafal rumus. Setiap miliar transistor di ponsel Anda adalah bukti bahwa konsep yang Anda pelajari di sini bekerja dalam skala yang sulit dibayangkan. Anda sedang belajar bahasa fundamental dari abad ke-21.*

**Tim Dosen Elektronika Dasar**
**Prodi S1 Teknik Komputer — Fakultas Teknik Elektro — Universitas Telkom**
