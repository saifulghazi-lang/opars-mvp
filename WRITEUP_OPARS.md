# OPARS: Online Proposal Approval and Review System
## Dokumentasi Sistem Semakan dan Kelulusan Proposal Dalam Talian

---

## 1. Kaedah Sedia Ada / Permasalahan

### Kaedah Tradisional
Proses semakan dan kelulusan proposal secara konvensional melibatkan:
- **Dokumen fizikal** yang perlu dicetak dan diedarkan secara manual kepada setiap ahli jawatankuasa
- **Mesyuarat bersemuka** yang memerlukan kehadiran semua pihak pada masa dan tempat yang sama
- **Tandatangan basah** pada dokumen kertas untuk pengesahan
- **Penyimpanan fail** dalam kabinet fizikal

### Permasalahan Utama
| Masalah | Kesan |
|---------|-------|
| Kebergantungan pada dokumen fizikal | Risiko kehilangan, kerosakan, dan kesukaran akses |
| Proses manual yang perlahan | Kelewatan dalam kelulusan proposal |
| Mesyuarat fizikal | Sukar menyelaras jadual semua ahli |
| Tiada jejak audit digital | Kesukaran mengesan status dan sejarah keputusan |
| Penyimpanan tidak sistematik | Masa terbuang mencari dokumen lama |

---

## 2. Kaedah Baru: Sistem OPARS

### Pengenalan Sistem
OPARS (Online Proposal Approval and Review System) adalah sistem pengurusan proposal berasaskan web yang membolehkan:

### Ciri-ciri Utama
1. **Muat Naik Proposal Digital**
   - Muat naik dokumen PDF terus ke sistem
   - Penyimpanan awan yang selamat (Supabase Storage)
   - Akses dokumen dari mana-mana sahaja

2. **Sistem Undian dan Semakan**
   - Ahli jawatankuasa boleh mengundi (Approve/Reject) secara dalam talian
   - Ruangan komen untuk maklum balas terperinci
   - Sistem kuorum automatik untuk keputusan

3. **Dashboard Bersepadu**
   - Paparan status proposal secara real-time
   - Penapis dan carian untuk navigasi mudah
   - Notifikasi "Inbox Zero" untuk proposal memerlukan tindakan

4. **Jejak Audit Digital**
   - Rekod lengkap setiap tindakan
   - Timestamp dan maklumat pengguna
   - Bukti digital untuk pematuhan

5. **Tandatangan Digital**
   - Tandatangan elektronik untuk pengesahan
   - Pengesahan identiti pengguna

---

## 3. Kesan kepada Proses/Sistem Penyampaian

### Penambahbaikan Proses

| Aspek | Sebelum | Selepas (OPARS) |
|-------|---------|-----------------|
| Penghantaran proposal | 2-3 hari (pos/serahan tangan) | Serta-merta (muat naik digital) |
| Semakan dokumen | Perlu hadir mesyuarat | Boleh dilakukan bila-bila masa |
| Pengundian | Mesyuarat fizikal sahaja | Dalam talian 24/7 |
| Maklum balas | Telefon/e-mel berasingan | Bersepadu dalam sistem |
| Pemantauan status | Manual/tiada | Dashboard real-time |

### Aliran Kerja Baharu
```
Pentadbir → Muat naik proposal → Sistem hantar notifikasi
                                        ↓
Ahli Jawatankuasa ← Semak & undi dalam talian
                                        ↓
Sistem → Kira kuorum → Keputusan automatik
                                        ↓
            Jejak audit tersimpan ← Tandatangan digital
```

---

## 4. Kesan Penjimatan

### 4.1 Penjimatan Masa

| Aktiviti | Kaedah Lama | OPARS | Penjimatan |
|----------|-------------|-------|------------|
| Penyediaan mesyuarat | 2-3 jam | 15 minit | ~85% |
| Pengundian per proposal | 30-60 minit | 5 minit | ~90% |
| Carian dokumen lama | 15-30 minit | < 1 minit | ~95% |
| Penyediaan laporan | 1-2 jam | Automatik | ~100% |

### 4.2 Penjimatan Kos

| Item | Anggaran Kos Lama/Bulan | Kos OPARS | Penjimatan |
|------|------------------------|-----------|------------|
| Percetakan dokumen | RM 200-500 | RM 0 | 100% |
| Fail & penyimpanan | RM 50-100 | RM 0 | 100% |
| Ruang pejabat untuk fail | RM 100-200 | RM 0 | 100% |
| Kos pengangkutan mesyuarat | RM 100-300 | RM 0 | 100% |
| **Hosting sistem** | - | ~RM 50-100 | - |

**Anggaran penjimatan bulanan: RM 300 - RM 1,000**

### 4.3 Penjimatan Sumber Manusia
- **Pengurangan beban kerja pentadbiran** sebanyak ~60%
- Staf boleh fokus kepada tugas bernilai tinggi
- Tiada keperluan hadir mesyuarat fizikal untuk undi rutin

### 4.4 Penjimatan Peralatan
- Pengurangan penggunaan pencetak dan toner
- Kurang keperluan kabinet fail
- Tiada keperluan ruang mesyuarat khusus

---

## 5. Kesan Jangka Panjang

### 5.1 Transformasi Digital
- **Budaya kerja digital** yang lebih efisien
- Penyediaan untuk inisiatif paperless office
- Asas untuk integrasi dengan sistem lain (ERP, HR, dll)

### 5.2 Kelestarian Alam Sekitar
- Pengurangan penggunaan kertas secara signifikan
- Jejak karbon lebih rendah (kurang mesyuarat fizikal)
- Menyokong matlamat kelestarian organisasi

### 5.3 Ketelusan dan Akauntabiliti
- Rekod keputusan yang kekal dan boleh diaudit
- Mengurangkan risiko penipuan atau manipulasi
- Meningkatkan keyakinan pihak berkepentingan

### 5.4 Kesinambungan Perniagaan
- Sistem boleh diakses semasa krisis (pandemik, bencana)
- Data disandarkan secara automatik di awan
- Operasi tidak terganggu walaupun staf bekerja dari rumah

### 5.5 Skalabiliti
- Boleh menampung peningkatan bilangan proposal
- Mudah ditambah ciri baharu mengikut keperluan
- Boleh diperluaskan ke jabatan/unit lain

---

## 6. Rumusan

### Ringkasan Manfaat

Sistem OPARS memberikan transformasi menyeluruh kepada proses semakan dan kelulusan proposal dengan:

1. **Kecekapan** - Proses yang dahulunya mengambil masa berhari-hari kini dapat diselesaikan dalam beberapa minit

2. **Penjimatan** - Pengurangan kos operasi sehingga RM 1,000 sebulan melalui penghapusan keperluan percetakan dan mesyuarat fizikal

3. **Ketelusan** - Jejak audit digital yang lengkap memastikan setiap keputusan dapat dikesan dan dipertanggungjawabkan

4. **Aksesibiliti** - Ahli jawatankuasa boleh mengundi dari mana-mana sahaja pada bila-bila masa

5. **Kelestarian** - Menyokong inisiatif paperless dan mengurangkan impak alam sekitar

### Kesimpulan

OPARS bukan sekadar pendigitalan proses sedia ada, tetapi merupakan **transformasi cara kerja** yang membawa organisasi ke arah tadbir urus yang lebih cekap, telus, dan lestari. Pelaburan dalam sistem ini akan memberi pulangan dalam bentuk penjimatan kos, masa, dan sumber manusia dalam jangka pendek dan panjang.

---

*Dokumen ini disediakan untuk tujuan dokumentasi sistem OPARS.*
*Tarikh: Disember 2024*
