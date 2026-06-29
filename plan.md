1. Identitas Aplikasi

Nama Aplikasi: Symptoms Diary

Makna: Sebuah buku harian medis digital yang bertindak sebagai asisten triase. Sepenuhnya menjaga privasi pengguna, berjalan instan di perangkat apa pun tanpa server, dan bertindak sebagai jembatan informasi yang akurat antara pasien dan dokter.

Tema Utama: Privacy-First, Offline-Capable, Clinical Precision, dan Therapeutic UI.

2. Desain & Antarmuka (UI/UX)

Konsep Visual: Fresh, modern, dan adaptif (Mobile-First dengan Grid Layout untuk Desktop). Menggunakan sudut sangat melengkung (ultra-rounded cards), efek glassmorphism tipis, dan kapsul navigasi melayang (floating nav-bar) di perangkat mobile.

Palet Warna:

Background Utama: #f2f7f6 (Abu-abu toska sangat terang, bersih dan luas).

Brand / Aksen: #009387 (Teal/Mint khas medis yang menenangkan) dan putih solid untuk kartu konten.

Tipografi: Poppins atau Inter untuk kesan aplikasi yang bersahabat namun profesional.

3. Tech Stack (100% Client-Side React)

Tumpukan teknologi dipilih untuk meminimalkan bundle size, memaksimalkan performa, dan mengamankan privasi (tanpa database server).

Core Framework: React 18+.

Build Tool: Vite (Sangat cepat untuk development dan menghasilkan bundle SPA yang ringan, menggantikan Alpine.js dari rencana sebelumnya).

Styling: Tailwind CSS.

State Management: Zustand atau React Context (untuk mengelola data kuesioner dan state navigasi secara global namun ringan).

Local Storage: localForage (berbasis IndexedDB untuk menyimpan data kuesioner, vitals, dan riwayat foto secara permanen di browser).

Chart/Grafik: Recharts (Pustaka visualisasi data khusus React yang ringan dan sangat responsif untuk grafik tanda vital).

AI & Logika: Logika Decision Tree Client-Side (mencocokkan Sacred Seven dengan dataset 50 penyakit) yang dieksekusi via JavaScript murni di dalam browser.

4. Arsitektur Fitur & Roadmap (Tiga Path Utama)

Tab 1: Beranda (Dashboard & Input Data)

Fungsi: Pusat kendali cepat, input tanda vital, dan pencatatan gejala awal.

[ ] Modul Tanda Vital (Vital Signs):

Input Dasar (Opsional namun direkomendasikan): Suhu Tubuh (°C), Denyut Nadi (bpm), Laju Pernapasan (x/menit).

Input Lanjutan (Jika ada alat): Tekanan Darah (mmHg), Saturasi Oksigen/SpO2 (%), Status Gizi (Tinggi & Berat Badan).

[ ] Katalog Gejala Cepat (Symptom Picker):

Antarmuka pencarian dan grid pemilihan gejala beserta waktu kejadian (onset).

Dataset 100+ Gejala (Kategorikal):

Nyeri: Kepala, Mata, Telinga, Gigi, Tenggorokan, Dada, Perut (Kanan Atas, Kanan Bawah, Kiri Atas, Kiri Bawah, Ulu Hati), Punggung, Pinggang, Sendi, Otot, dll.

Sistemik: Demam, Menggigil, Lemas, Berkeringat Malam, Berat Badan Turun Drastis.

Respirasi & Jantung: Batuk (Kering/Berdahak/Darah), Sesak Napas, Jantung Berdebar (Palpitasi), Nyeri Dada Menjalar.

Pencernaan: Mual, Muntah, Diare, Sembelit, BAB Berdarah, BAB Hitam, Sulit Menelan.

Neurologi & Sensorik: Pusing Berputar (Vertigo), Telinga Berdengung, Kejang, Mati Rasa/Kesemutan, Kelumpuhan Otot, Gangguan Penglihatan.

Dermatologi & Lainnya: Kemerahan/Ruam, Benjolan, Perdarahan tidak wajar, Disfungsi organ tertentu.

Tab 2: Diagnosa AI (Anamnesis Interaktif)

Fungsi: Bertindak sebagai "Dokter Mini" yang menggali data dari Tab 1 untuk memprediksi arah diagnosis.

[ ] Clinical Summary Panel: Menampilkan ringkasan seluruh gejala dan tanda vital yang telah diinput di Beranda.

[ ] Chat/Form Anamnesis Interaktif: Modul tanya jawab mandiri untuk menggali detail berdasarkan Sacred Seven:

Lokasi: Di mana tepatnya penyebarannya?

Onset: Kapan persisnya mulai? Berapa lama durasinya?

Kuantitas: Skala keparahan (1-10) atau seberapa sering frekuensinya?

Kualitas: Bagaimana rasanya? (Tertusuk, terbakar, tumpul, berdenyut).

Faktor Memperberat: Apa yang membuatnya lebih sakit?

Faktor Memperingan: Apa yang membuatnya mendingan (misal: istirahat, obat tertentu)?

Gejala Penyerta: Apakah ada keluhan lain yang menyertai?

Serta menggali Fundamental Four (Riwayat Penyakit Sekarang, Dahulu, Keluarga, Sosial/Kebiasaan).

[ ] Tombol "Quick Guess": Fitur jalan pintas untuk mendapatkan prediksi diagnosis instan hanya dari data Tab 1 (tanpa perlu melewati proses detail).

[ ] Panel Hasil Diagnosis & Red Flag: Menampilkan Top 3 kemungkinan penyakit. Jika ada tanda bahaya (misal: Nadi >120, Suhu >40°C, Penurunan Kesadaran), UI akan memunculkan Peringatan Darurat (IGD).

Tab 3: Ensiklopedia Penyakit (Disease Library)

Fungsi: Edukasi literasi kesehatan pasien yang menyajikan data penyakit secara transparan.

[ ] UI Card & Search Bar: Menampilkan daftar penyakit dalam bentuk kartu modern yang bisa difilter dan dicari.

[ ] Detail Card: Saat diklik, menampilkan penjelasan medis awam, penyebab, dan daftar gejala yang bersinggungan.

[ ] Dataset 50 Penyakit Umum (Target PjBL):

Infeksi: Demam Berdarah Dengue (DBD), Demam Tifoid (Tipes), Malaria, ISPA, Tuberkulosis (TBC), Pneumonia, Covid-19, Cacar Air.

Gastrointestinal: Dispepsia/Maag, GERD, Gastroenteritis (Muntaber), Appendisitis (Usus Buntu), Hepatitis, Batu Empedu.

Kardiovaskular & Paru: Hipertensi, Penyakit Jantung Koroner, Gagal Jantung, Asma, PPOK.

Saraf & Nyeri: Migrain, Vertigo, Tension Type Headache, Neuropati, HNP (Saraf Terjepit).

Metabolik & Urologi: Diabetes Mellitus, Asam Urat, Kolesterol Tinggi, Infeksi Saluran Kemih (ISK), Batu Ginjal.

(Akan dilengkapi hingga 50 kondisi primer saat pembuatan dataset).

Fitur Global & Keamanan (Wajib untuk Client-Side)

[ ] The "Zero Footprint" Button: Tombol khusus untuk menghapus seluruh data IndexedDB, membuang cache, dan mereset total aplikasi dengan satu klik.

[ ] Responsive Engine: Menggunakan Tailwind dan kalkulasi CSS mutlak agar UI mobile tidak terpotong address bar.

[ ] PWA Support dengan Vite-PWA: Konfigurasi Service Worker agar web dapat diinstal di Homescreen dan digunakan 100% offline.