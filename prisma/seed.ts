import { PrismaClient } from "../generated/prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Seed Themes with all color fields
  const theme1 = await prisma.themes.upsert({
    where: { id: 1 },
    update: {},
    create: {
      price: 0,
      primary: "#4CAF50",
      subprimary: "#66BB6A",
      secondary: "#81C784",
      subsecondary: "#A5D6A7",
      background: "#FFFFFF",
      subbackground: "#F5F5F5",
      text: "#212121",
      subtext: "#757575",
      pie1: "#4CAF50",
      pie2: "#81C784",
    },
  })
  

  const theme2 = await prisma.themes.upsert({
    where: { id: 2 },
    update: {},
    create: {
      price: 100,
      primary: "#2196F3",
      subprimary: "#42A5F5",
      secondary: "#64B5F6",
      subsecondary: "#90CAF9",
      background: "#FFFFFF",
      subbackground: "#E3F2FD",
      text: "#0D47A1",
      subtext: "#1976D2",
      pie1: "#2196F3",
      pie2: "#64B5F6",
    },
  })
  

  const theme3 = await prisma.themes.upsert({
    where: { id: 3 },
    update: {},
    create: {
      price: 150,
      primary: "#FF9800",
      subprimary: "#FFA726",
      secondary: "#FFB74D",
      subsecondary: "#FFCC80",
      background: "#FFFFFF",
      subbackground: "#FFF3E0",
      text: "#E65100",
      subtext: "#F57C00",
      pie1: "#FF9800",
      pie2: "#FFB74D",
    },
  })
  

  // Hash the password for the seeded user
  const hashedPassword = await bcrypt.hash("password123", 10)

  // Seed Users
  const user = await prisma.users.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
      activeThemeId: theme1.id,
      budgetingPercentage: 20,
      coin: 50,
      streak: 0,
      highestStreak: 0,
    },
  })

  // Seed User_Themes (unlock default theme for user)
  await prisma.user_Themes.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user.id,
      themeId: theme1.id,
      unlocked: true,
    },
  })

  // Seed Pockets
  await prisma.pockets.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Kebutuhan",
      total: 5000,
      walletType: "Main",
      isActive: true,
      userId: user.id,
    },
  })

  await prisma.pockets.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Active Investments",
      total: 5000,
      walletType: "Investment",
      isActive: true,
      userId: user.id,
    },
  })

  await prisma.pockets.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Inactive Investments",
      total: 5000,
      walletType: "Investment",
      isActive: true,
      userId: user.id,
    },
  })

  // Seed Levels
  const level1 = await prisma.levels.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Investment Basics 1",
      isCompleted: false,
      userId: user.id,
    },
  })

  const level2 = await prisma.levels.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Investment Basics 2",
      isCompleted: false,
      userId: user.id,
    },
  })

  const level3 = await prisma.levels.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Investment Strategies",
      isCompleted: false,
      userId: user.id,
    },
  })

  const level4 = await prisma.levels.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: "Risk and Return Management",
      isCompleted: false,
      userId: user.id,
    },
  })

  const level5 = await prisma.levels.upsert({
    where: { id: 5 },
    update: {},
    create: {
      name: "Advanced Investment Concepts",
      isCompleted: false,
      userId: user.id,
    },
  })

  // Seed Questions
  // No 1-10 for Level 1
  await prisma.questions.upsert({
    where: { id: 1 },
    update: {},
    create: {
      question: "Perbedaan utama antara menabung dan berinvestasi adalah:",
      option1: "Menabung selalu memberikan keuntungan lebih besar daripada investasi",
      option2: "Investasi bertujuan mengembangkan nilai uang, sedangkan menabung lebih fokus pada penyimpanan",
      option3: "Menabung memiliki risiko lebih tinggi dibanding investasi",
      option4: "Investasi tidak memerlukan tujuan keuangan",
      answer: "Investasi bertujuan mengembangkan nilai uang, sedangkan menabung lebih fokus pada penyimpanan",
      levelId: level1.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 2 },
    update: {},
    create: {
      question: "Manakah dari berikut ini yang merupakan contoh investasi yang sah di Indonesia?",
      option1: "Membeli barang ilegal dan menjualnya kembali",
      option2: "Berinvestasi dalam saham yang terdaftar di Bursa Efek Indonesia (BEI)",
      option3: "Menggunakan uang untuk menjalankan skema Ponzi",
      option4: "Menyimpan uang di dompet tanpa ada perubahan nilai",
      answer: "Berinvestasi dalam saham yang terdaftar di Bursa Efek Indonesia (BEI)",
      levelId: level1.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 3 },
    update: {},
    create: {
      question: "Apa yang dimaksud dengan \"return\" dalam investasi?",
      option1: "Uang yang dibayarkan kepada manajer investasi",
      option2: "Jumlah imbal hasil atau keuntungan yang diperoleh dari investasi",
      option3: "Proses menjual kembali aset untuk mendapatkan keuntungan",
      option4: "Jumlah uang yang disetorkan ke rekening investasi",
      answer: "Jumlah imbal hasil atau keuntungan yang diperoleh dari investasi",
      levelId: level1.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 4 },
    update: {},
    create: {
      question: "Instrumen investasi apa yang dikenal memberikan imbal hasil tetap dalam jangka panjang?",
      option1: "Saham",
      option2: "Emas",
      option3: "Deposito",
      option4: "Reksa Dana Saham",
      answer: "Deposito",
      levelId: level1.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 5 },
    update: {},
    create: {
      question: "Mana dari berikut ini yang termasuk investasi dengan risiko lebih rendah?",
      option1: "Obligasi pemerintah",
      option2: "Saham perusahaan teknologi",
      option3: "Reksa Dana saham",
      option4: "Cryptocurrency",
      answer: "Obligasi pemerintah",
      levelId: level1.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 6 },
    update: {},
    create: {
      question: "Salah satu keuntungan utama berinvestasi dalam saham adalah:",
      option1: "Kepemilikan langsung atas aset fisik",
      option2: "Imbal hasil tetap yang tidak terpengaruh kondisi pasar",
      option3: "Potensi pertumbuhan nilai perusahaan di masa depan",
      option4: "Tidak perlu memperhatikan fluktuasi pasar",
      answer: "Potensi pertumbuhan nilai perusahaan di masa depan",
      levelId: level1.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 7 },
    update: {},
    create: {
      question: "Manakah dari berikut ini yang termasuk investasi yang bersifat likuid?",
      option1: "Properti",
      option2: "Emas",
      option3: "Reksa Dana Pasar Uang",
      option4: "Obligasi perusahaan",
      answer: "Reksa Dana Pasar Uang",
      levelId: level1.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 8 },
    update: {},
    create: {
      question: "Apa yang dimaksud dengan \"risiko investasi\"?",
      option1: "Kemungkinan untuk mendapatkan keuntungan dari investasi",
      option2: "Potensi kerugian yang terjadi karena fluktuasi nilai aset",
      option3: "Kepastian nilai aset yang akan didapatkan di masa depan",
      option4: "Kenaikan harga barang-barang yang diperdagangkan",
      answer: "Potensi kerugian yang terjadi karena fluktuasi nilai aset",
      levelId: level1.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 9 },
    update: {},
    create: {
      question: "Mengapa seseorang perlu mulai berinvestasi sejak dini?",
      option1: "Karena investasi selalu bebas risiko",
      option2: "Agar bisa cepat kaya dalam waktu singkat",
      option3: "Karena waktu dapat membantu pertumbuhan nilai investasi",
      option4: "Karena diwajibkan oleh pemerintah",
      answer: "Karena waktu dapat membantu pertumbuhan nilai investasi",
      levelId: level1.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 10 },
    update: {},
    create: {
      question: "Apa tujuan utama melakukan diversifikasi dalam investasi?",
      option1: "Menempatkan seluruh dana pada satu instrumen dengan return tertinggi",
      option2: "Mengurangi risiko dengan menyebarkan dana ke berbagai instrumen investasi",
      option3: "Memperoleh keuntungan dalam waktu sangat singkat",
      option4: "Menghindari semua jenis risiko investasi",
      answer: "Mengurangi risiko dengan menyebarkan dana ke berbagai instrumen investasi",
      levelId: level1.id,
    },
  })
  // No 11-20 for Level 2
  await prisma.questions.upsert({
    where: { id: 11 },
    update: {},
    create: {
      question: "Apa itu reksa dana?",
      option1: "Jenis investasi yang hanya melibatkan saham perusahaan",
      option2: "Produk investasi yang mengumpulkan dana dari banyak investor untuk berinvestasi pada berbagai instrumen",
      option3: "Investasi yang hanya terhubung dengan sektor properti",
      option4: "Produk investasi yang dikelola oleh pemerintah untuk kepentingan umum",
      answer: "Produk investasi yang mengumpulkan dana dari banyak investor untuk berinvestasi pada berbagai instrumen",
      levelId: level2.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 12 },
    update: {},
    create: {
      question: "Mana dari berikut ini yang merupakan karakteristik saham?",
      option1: "Memberikan bunga tetap setiap tahun",
      option2: "Memberikan hak suara dalam perusahaan",
      option3: "Tidak memiliki risiko fluktuasi harga",
      option4: "Nilai saham selalu tetap dan tidak berubah",
      answer: "Memberikan hak suara dalam perusahaan",
      levelId: level2.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 13 },
    update: {},
    create: {
      question: "Siapa pihak yang bertanggung jawab mengelola dana pada produk reksa dana?",
      option1: "Investor secara langsung",
      option2: "Manajer investasi",
      option3: "Bank Indonesia",
      option4: "Bursa Efek Indonesia",
      answer: "Manajer investasi",
      levelId: level2.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 14 },
    update: {},
    create: {
      question: "Apa yang dimaksud dengan dividen dalam investasi saham?",
      option1: "Bunga yang dibayarkan oleh perusahaan setiap bulan",
      option2: "Pembagian keuntungan yang diterima oleh pemegang saham",
      option3: "Keuntungan yang diterima dari penjualan saham di pasar",
      option4: "Pembayaran bunga dari obligasi yang dibeli oleh investor",
      answer: "Pembagian keuntungan yang diterima oleh pemegang saham",
      levelId: level2.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 15 },
    update: {},
    create: {
      question: "Mana pernyataan yang benar tentang jenis reksa dana?",
      option1: "Reksa dana saham cenderung memiliki risiko lebih tinggi dibanding reksa dana pasar uang",
      option2: "Reksa dana pasar uang memiliki risiko lebih tinggi daripada reksa dana saham",
      option3: "Semua reksa dana selalu memberikan keuntungan tetap",
      option4: "Reksa dana obligasi hanya bisa dimiliki oleh pemerintah",
      answer: "Reksa dana saham cenderung memiliki risiko lebih tinggi dibanding reksa dana pasar uang",
      levelId: level2.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 16 },
    update: {},
    create: {
      question: "Mana yang merupakan contoh investasi jangka panjang yang lebih aman?",
      option1: "Saham perusahaan teknologi baru",
      option2: "Obligasi negara yang stabil",
      option3: "Investasi dalam mata uang digital",
      option4: "Trading saham setiap hari",
      answer: "Obligasi negara yang stabil",
      levelId: level2.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 17 },
    update: {},
    create: {
      question: "Apa yang membedakan reksa dana saham dengan reksa dana pasar uang?",
      option1: "Reksa dana saham lebih fokus pada saham-saham perusahaan besar dan stabil",
      option2: "Reksa dana pasar uang lebih cenderung berinvestasi pada instrumen yang sangat likuid dengan risiko rendah",
      option3: "Reksa dana saham lebih aman karena dikelola oleh pemerintah",
      option4: "Reksa dana pasar uang lebih berisiko karena bergantung pada saham",
      answer: "Reksa dana pasar uang lebih cenderung berinvestasi pada instrumen yang sangat likuid dengan risiko rendah",
      levelId: level2.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 18 },
    update: {},
    create: {
      question: "Apa itu obligasi?",
      option1: "Produk investasi yang memberikan imbal hasil tetap dan merupakan surat utang yang diterbitkan oleh entitas",
      option2: "Investasi yang memberikan kepemilikan saham di perusahaan",
      option3: "Surat berharga yang hanya diterbitkan oleh pemerintah",
      option4: "Investasi yang tidak berisiko dan selalu menghasilkan keuntungan",
      answer: "Produk investasi yang memberikan imbal hasil tetap dan merupakan surat utang yang diterbitkan oleh entitas",
      levelId: level2.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 19 },
    update: {},
    create: {
      question: "Apa yang dimaksud dengan capital gain?",
      option1: "Keuntungan yang diperoleh dari bunga investasi",
      option2: "Keuntungan yang diperoleh dari kenaikan harga jual aset investasi",
      option3: "Keuntungan yang diperoleh dari pembelian saham dengan harga lebih rendah",
      option4: "Keuntungan yang diperoleh dari pembelian reksa dana",
      answer: "Keuntungan yang diperoleh dari kenaikan harga jual aset investasi",
      levelId: level2.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 20 },
    update: {},
    create: {
      question: "Dalam investasi saham, harga saham di pasar terutama ditentukan oleh:",
      option1: "Keputusan pemerintah",
      option2: "Jumlah dividen yang dibagikan setiap bulan",
      option3: "Permintaan dan penawaran di pasar",
      option4: "Jumlah saham yang dimiliki investor pemula",
      answer: "Permintaan dan penawaran di pasar",
      levelId: level2.id,
    },
  })
  // No 21-30 for Level 3
  await prisma.questions.upsert({
    where: { id: 21 },
    update: {},
    create: {
      question: "Apa yang dimaksud dengan strategi \"buy and hold\" dalam investasi saham?",
      option1: "Membeli saham dan menjualnya setiap hari",
      option2: "Membeli saham dan menyimpannya untuk jangka panjang",
      option3: "Menjual saham sebelum harganya naik",
      option4: "Membeli saham secara acak tanpa analisis",
      answer: "Membeli saham dan menyimpannya untuk jangka panjang",
      levelId: level3.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 22 },
    update: {},
    create: {
      question: "Diversifikasi dalam investasi bertujuan untuk:",
      option1: "Memaksimalkan keuntungan dari satu aset saja",
      option2: "Mengurangi risiko dengan menyebar dana ke berbagai jenis investasi",
      option3: "Menghindari pajak",
      option4: "Memilih aset yang sama berulang kali",
      answer: "Mengurangi risiko dengan menyebar dana ke berbagai jenis investasi",
      levelId: level3.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 23 },
    update: {},
    create: {
      question: "Strategi investasi jangka pendek biasanya disebut:",
      option1: "Trading",
      option2: "Buy and hold",
      option3: "Dollar-cost averaging",
      option4: "Diversifikasi",
      answer: "Trading",
      levelId: level3.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 24 },
    update: {},
    create: {
      question: "Apa itu strategi dollar-cost averaging (DCA)?",
      option1: "Membeli lebih banyak saham saat harga turun dan lebih sedikit saat harga naik secara rutin",
      option2: "Menjual saham saat harga turun dan membeli saat harga naik",
      option3: "Investasi dalam jumlah besar sekaligus",
      option4: "Menaruh seluruh uang di satu jenis aset",
      answer: "Membeli lebih banyak saham saat harga turun dan lebih sedikit saat harga naik secara rutin",
      levelId: level3.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 25 },
    update: {},
    create: {
      question: "Mana yang termasuk strategi konservatif dalam investasi?",
      option1: "Membeli obligasi pemerintah atau reksa dana pasar uang",
      option2: "Membeli saham perusahaan baru tanpa riset",
      option3: "Investasi di cryptocurrency tanpa batas",
      option4: "Trading harian saham volatile",
      answer: "Membeli obligasi pemerintah atau reksa dana pasar uang",
      levelId: level3.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 26 },
    update: {},
    create: {
      question: "Apa yang dimaksud dengan strategi agresif dalam investasi?",
      option1: "Fokus pada instrumen dengan risiko rendah dan return stabil",
      option2: "Fokus pada instrumen dengan potensi return tinggi dan risiko tinggi",
      option3: "Menyimpan uang di bank saja",
      option4: "Menghindari pasar saham sama sekali",
      answer: "Fokus pada instrumen dengan potensi return tinggi dan risiko tinggi",
      levelId: level3.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 27 },
    update: {},
    create: {
      question: "Salah satu keuntungan strategi buy and hold adalah:",
      option1: "Tidak terpengaruh fluktuasi harga jangka pendek",
      option2: "Bisa cepat kaya dalam semalam",
      option3: "Selalu mengalahkan pasar",
      option4: "Bebas risiko",
      answer: "Tidak terpengaruh fluktuasi harga jangka pendek",
      levelId: level3.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 28 },
    update: {},
    create: {
      question: "Mana contoh strategi investasi yang cocok untuk pemula dengan modal terbatas?",
      option1: "Trading harian saham blue-chip",
      option2: "Investasi rutin di reksa dana indeks atau ETF",
      option3: "Investasi di startup tanpa pengalaman",
      option4: "Membeli obligasi perusahaan berisiko tinggi",
      answer: "Investasi rutin di reksa dana indeks atau ETF",
      levelId: level3.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 29 },
    update: {},
    create: {
      question: "Dalam strategi diversifikasi, selain jenis aset, apa yang bisa digunakan untuk mengurangi risiko?",
      option1: "Memiliki aset dengan jangka waktu berbeda",
      option2: "Mengikuti semua rekomendasi teman",
      option3: "Memilih satu saham favorit saja",
      option4: "Menyimpan seluruh uang di satu bank",
      answer: "Memiliki aset dengan jangka waktu berbeda",
      levelId: level3.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 30 },
    update: {},
    create: {
      question: "Apa tujuan utama memilih strategi investasi yang sesuai dengan profil risiko?",
      option1: "Agar investasi selalu untung setiap bulan",
      option2: "Agar nyaman dengan risiko dan dapat mencapai tujuan keuangan",
      option3: "Agar bisa mengikuti tren teman",
      option4: "Agar tidak perlu memahami produk investasi",
      answer: "Agar nyaman dengan risiko dan dapat mencapai tujuan keuangan",
      levelId: level3.id,
    },
  })
  // No 31-40 for Level 4
  await prisma.questions.upsert({
    where: { id: 31 },
    update: {},
    create: {
      question: "Apa yang dimaksud dengan risiko dalam investasi?",
      option1: "Potensi kerugian atau fluktuasi nilai aset",
      option2: "Jumlah keuntungan yang pasti diterima",
      option3: "Biaya yang harus dibayar ke bank",
      option4: "Waktu yang dibutuhkan untuk membeli aset",
      answer: "Potensi kerugian atau fluktuasi nilai aset",
      levelId: level4.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 32 },
    update: {},
    create: {
      question: "Apa yang dimaksud dengan return dalam investasi?",
      option1: "Jumlah kerugian yang mungkin terjadi",
      option2: "Keuntungan atau imbal hasil yang diperoleh dari investasi",
      option3: "Biaya administrasi investasi",
      option4: "Nilai nominal investasi awal",
      answer: "Keuntungan atau imbal hasil yang diperoleh dari investasi",
      levelId: level4.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 33 },
    update: {},
    create: {
      question: "Hubungan antara risiko dan return dalam investasi biasanya bersifat:",
      option1: "Semakin tinggi risiko, semakin rendah return",
      option2: "Semakin tinggi risiko, semakin tinggi potensi return",
      option3: "Risiko dan return tidak ada hubungannya",
      option4: "Risiko selalu lebih kecil dari return",
      answer: "Semakin tinggi risiko, semakin tinggi potensi return",
      levelId: level4.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 34 },
    update: {},
    create: {
      question: "Mana contoh investasi dengan risiko rendah?",
      option1: "Obligasi pemerintah",
      option2: "Saham perusahaan startup",
      option3: "Cryptocurrency",
      option4: "Trading harian saham volatile",
      answer: "Obligasi pemerintah",
      levelId: level4.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 35 },
    update: {},
    create: {
      question: "Mana contoh investasi dengan potensi return tinggi tapi risiko juga tinggi?",
      option1: "Deposito bank",
      option2: "Reksa dana pasar uang",
      option3: "Saham perusahaan baru atau cryptocurrency",
      option4: "Obligasi pemerintah",
      answer: "Saham perusahaan baru atau cryptocurrency",
      levelId: level4.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 36 },
    update: {},
    create: {
      question: "Apa yang dimaksud dengan risiko likuiditas?",
      option1: "Risiko nilai aset turun karena inflasi",
      option2: "Risiko sulit menjual aset dengan harga wajar saat dibutuhkan",
      option3: "Risiko gagal bayar dari perusahaan",
      option4: "Risiko kehilangan dokumen investasi",
      answer: "Risiko sulit menjual aset dengan harga wajar saat dibutuhkan",
      levelId: level4.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 37 },
    update: {},
    create: {
      question: "Mana strategi yang bisa digunakan untuk mengurangi risiko investasi?",
      option1: "Diversifikasi aset",
      option2: "Memasukkan seluruh dana ke satu saham",
      option3: "Mengikuti rumor pasar",
      option4: "Menjual semua aset saat harga naik sedikit",
      answer: "Diversifikasi aset",
      levelId: level4.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 38 },
    update: {},
    create: {
      question: "Risiko pasar (market risk) biasanya terjadi karena:",
      option1: "Perubahan harga saham atau obligasi secara umum di pasar",
      option2: "Keputusan pemerintah untuk menutup bank tertentu",
      option3: "Kesalahan investor saat membeli saham",
      option4: "Jumlah investor yang sedikit",
      answer: "Perubahan harga saham atau obligasi secara umum di pasar",
      levelId: level4.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 39 },
    update: {},
    create: {
      question: "Apa yang dimaksud dengan risiko kredit?",
      option1: "Risiko investor tidak membayar biaya transaksi",
      option2: "Risiko penerbit obligasi gagal membayar bunga atau pokok",
      option3: "Risiko fluktuasi harga saham",
      option4: "Risiko kehilangan dokumen investasi",
      answer: "Risiko penerbit obligasi gagal membayar bunga atau pokok",
      levelId: level4.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 40 },
    update: {},
    create: {
      question: "Seorang investor memilih kombinasi saham besar, obligasi pemerintah, dan reksa dana pasar uang. Strategi ini paling tepat untuk tujuan:",
      option1: "Memaksimalkan return dengan risiko tinggi",
      option2: "Menjaga stabilitas portofolio sambil tetap ada potensi pertumbuhan",
      option3: "Memastikan return tetap tinggi setiap bulan",
      option4: "Menghindari risiko sepenuhnya",
      answer: "Menjaga stabilitas portofolio sambil tetap ada potensi pertumbuhan",
      levelId: level4.id,
    },
  })
  // No 41-50 for Level 5
  await prisma.questions.upsert({
    where: { id: 41 },
    update: {},
    create: {
      question: "Apa itu ETF (Exchange Traded Fund)?",
      option1: "Instrumen investasi yang diperdagangkan di bursa dan biasanya mengikuti indeks tertentu",
      option2: "Saham dari satu perusahaan tertentu yang diperdagangkan di bursa",
      option3: "Dana yang dikelola pemerintah untuk kepentingan umum",
      option4: "Produk pasar uang dengan return yang relatif stabil",
      answer: "Instrumen investasi yang diperdagangkan di bursa dan biasanya mengikuti indeks tertentu",
      levelId: level5.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 42 },
    update: {},
    create: {
      question: "Apa yang dimaksud dengan leverage dalam investasi?",
      option1: "Penggunaan dana pinjaman untuk meningkatkan potensi return",
      option2: "Strategi membeli berbagai aset untuk menyebarkan risiko",
      option3: "Menahan dana di deposito untuk menghindari risiko pasar",
      option4: "Mengandalkan tren pasar atau rumor untuk membeli aset",
      answer: "Penggunaan dana pinjaman untuk meningkatkan potensi return",
      levelId: level5.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 43 },
    update: {},
    create: {
      question: "Salah satu risiko utama dari penggunaan leverage adalah:",
      option1: "Potensi kerugian bisa lebih besar dari modal sendiri",
      option2: "Risiko fluktuasi return menjadi tidak signifikan",
      option3: "Keuntungan yang dihasilkan selalu tetap",
      option4: "Kesempatan memperoleh return tinggi hilang sepenuhnya",
      answer: "Potensi kerugian bisa lebih besar dari modal sendiri",
      levelId: level5.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 44 },
    update: {},
    create: {
      question: "Analisis fundamental pada saham bertujuan untuk:",
      option1: "Menilai nilai intrinsik perusahaan dan prospek pertumbuhannya",
      option2: "Menentukan harga saham jangka pendek berdasarkan rumor pasar",
      option3: "Memprediksi return bulanan secara pasti",
      option4: "Mengikuti strategi teman atau media sosial",
      answer: "Menilai nilai intrinsik perusahaan dan prospek pertumbuhannya",
      levelId: level5.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 45 },
    update: {},
    create: {
      question: "Apa itu derivatif?",
      option1: "Instrumen keuangan yang nilainya berasal dari aset lain, seperti saham, obligasi, atau komoditas",
      option2: "Saham atau obligasi dengan return tetap",
      option3: "Reksa dana dengan perlindungan modal",
      option4: "Deposito bank berjangka",
      answer: "Instrumen keuangan yang nilainya berasal dari aset lain, seperti saham, obligasi, atau komoditas",
      levelId: level5.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 46 },
    update: {},
    create: {
      question: "Mana contoh derivatif yang umum diperdagangkan?",
      option1: "Opsi (option) dan kontrak berjangka (futures)",
      option2: "Instrumen saham dan obligasi jangka panjang",
      option3: "Reksa dana pasar uang dan saham",
      option4: "Deposito berjangka di bank",
      answer: "Opsi (option) dan kontrak berjangka (futures)",
      levelId: level5.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 47 },
    update: {},
    create: {
      question: "Apa keuntungan berinvestasi di pasar global?",
      option1: "Diversifikasi portofolio dan peluang pertumbuhan dari berbagai negara",
      option2: "Potensi return tinggi dari semua jenis aset tanpa memperhatikan risiko",
      option3: "Selalu mendapatkan keuntungan bulanan",
      option4: "Tidak memerlukan analisis risiko atau pemantauan pasar",
      answer: "Diversifikasi portofolio dan peluang pertumbuhan dari berbagai negara",
      levelId: level5.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 48 },
    update: {},
    create: {
      question: "Dalam analisis risiko, Value at Risk (VaR) digunakan untuk:",
      option1: "Memperkirakan potensi kerugian maksimum dalam jangka waktu tertentu dengan tingkat kepercayaan tertentu",
      option2: "Menentukan harga saham esok hari",
      option3: "Mengukur likuiditas aset tanpa mempertimbangkan risiko pasar",
      option4: "Menentukan jumlah dividen yang akan diterima investor",
      answer: "Memperkirakan potensi kerugian maksimum dalam jangka waktu tertentu dengan tingkat kepercayaan tertentu",
      levelId: level5.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 49 },
    update: {},
    create: {
      question: "Mana strategi yang cocok untuk investor agresif di pasar global?",
      option1: "Investasi di saham perusahaan teknologi internasional dan ETF berbasis indeks global",
      option2: "Menaruh seluruh dana di deposito lokal",
      option3: "Hanya membeli obligasi pemerintah",
      option4: "Mengikuti rumor teman dan tren media sosial",
      answer: "Investasi di saham perusahaan teknologi internasional dan ETF berbasis indeks global",
      levelId: level5.id,
    },
  })

  await prisma.questions.upsert({
    where: { id: 50 },
    update: {},
    create: {
      question: "Seorang investor ingin melindungi portofolionya dari penurunan pasar saham. Instrumen lanjutan yang bisa digunakan adalah:",
      option1: "Put option atau kontrak derivatif lainnya",
      option2: "Membeli obligasi pemerintah saja untuk stabilitas",
      option3: "Menambah saham dengan modal kecil secara acak",
      option4: "Menahan dana di rekening tabungan tanpa strategi",
      answer: "Put option atau kontrak derivatif lainnya",
      levelId: level5.id,
    },
  })

  // Seed Transactions
  await prisma.transactions.upsert({
    where: { id: 1 },
    update: {},
    create: {
      date: new Date(),
      name: "Buy Seeds",
      pricePerUnit: 1000,
      action: "Buy",
      nominal: 2000,
      unitAmount: 2,
      pocketId: 1,
      toPocketId: 2,
    },
  })

  await prisma.transactions.upsert({
    where: { id: 2 },
    update: {},
    create: {
      date: new Date(),
      name: "Sell Plants",
      pricePerUnit: 1500,
      action: "Sell",
      nominal: 3000,
      unitAmount: 2,
      pocketId: 2,
      toPocketId: 1,
    },
  })

  await prisma.transactions.upsert({
    where: { id: 3 },
    update: {},
    create: {
      date: new Date(),
      name: "Pocket Transfer",
      pricePerUnit: 0,
      action: "Out",
      nominal: 1000,
      unitAmount: 1,
      pocketId: 1,
      toPocketId: 3,
    },
  })

  console.log("✅ Seeded all tables successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })