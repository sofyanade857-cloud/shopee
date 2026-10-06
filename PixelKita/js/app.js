/* ==========================================================
   PIXELKITA STUDIO - JS UTAMA (MASTER DATA & LOGIKA DASAR)
   ========================================================== */

// 1. DATA MASTER PRODUK DIGITAL
// GANTI FOTO PRODUK DI FOLDER assets/images/
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    nama: "Template Instagram UMKM",
    kategori: "Template Digital",
    harga: 50000,
    gambar: "assets/images/template-instagram.jpg",
    deskripsi: "30+ template post & story Instagram siap pakai di Canva/Figma. Cocok buat jualan online dan ningkatin engagement medsos kamu."
  },
  {
    id: 2,
    nama: "Template Poster Promosi",
    kategori: "Template Digital",
    harga: 35000,
    gambar: "assets/images/template-poster.jpg",
    deskripsi: "Template poster promosi diskon, menu, event, dan launching produk. Gampang diedit dan resolusi tinggi siap cetak."
  },
  {
    id: 3,
    nama: "Template Kartu Nama Digital",
    kategori: "Template Digital",
    harga: 40000,
    gambar: "assets/images/kartu-nama.jpg",
    deskripsi: "Desain kartu nama modern lengkap dengan QR Code interaktif buat link medsos dan WhatsApp bisnis."
  },
  {
    id: 4,
    nama: "Paket Template Branding UMKM",
    kategori: "Bundling",
    harga: 150000,
    gambar: "assets/images/branding-kit.jpg",
    deskripsi: "Paket komplit: logo mockups, template feed, story, invoice, serta panduan warna & font biar bisnis keliatan profesional."
  },
  {
    id: 5,
    nama: "Template Katalog Produk",
    kategori: "Template Digital",
    harga: 75000,
    gambar: "assets/images/katalog-produk.jpg",
    deskripsi: "Layout e-katalog PDF & cetak buat majang daftar menu atau etalase produk UMKM kamu secara rapi."
  }
];

// 2. DATA MASTER JASA DESAIN
// GANTI FOTO JASA DI FOLDER assets/images/
const DEFAULT_SERVICES = [
  {
    id: 101,
    nama: "Jasa Desain Logo Bisnis",
    kategori: "Jasa Desain",
    harga: 100000,
    estimasi: "2-3 Hari Kerja",
    gambar: "assets/images/jasa-logo.jpg",
    deskripsi: "Desain logo original khas karakter bisnismu. Dapat 3 alternatif konsep, revisi minor sepuasnya, dan master file (PNG, PDF, Vector)."
  },
  {
    id: 102,
    nama: "Jasa Desain Poster & Banner",
    kategori: "Jasa Desain",
    harga: 75000,
    estimasi: "1-2 Hari Kerja",
    gambar: "assets/images/jasa-poster.jpg",
    deskripsi: "Desain materi promosi cetak atau digital custom sesuai request materi bisnismu."
  },
  {
    id: 103,
    nama: "Jasa Desain Konten Instagram",
    kategori: "Jasa Desain",
    harga: 150000,
    estimasi: "3-4 Hari Kerja",
    gambar: "assets/images/jasa-instagram.jpg",
    deskripsi: "Paket 9 desain microblog/carousel Instagram terpadu untuk feed yang estetik dan rapi."
  },
  {
    id: 104,
    nama: "Jasa Branding UMKM Lengkap",
    kategori: "Jasa Desain",
    harga: 300000,
    estimasi: "5-7 Hari Kerja",
    gambar: "assets/images/jasa-branding.jpg",
    deskripsi: "Solusi identitas visual komplit: Logo, color palette, panduan tipografi, desain kemasan, dan kartu nama."
  }
];

// 3. INISIALISASI LOCALSTORAGE (DATA DEMO)
function initStorage() {
  if (!localStorage.getItem("pixel_products")) {
    localStorage.setItem("pixel_products", JSON.stringify(DEFAULT_PRODUCTS));
  }
  if (!localStorage.getItem("pixel_services")) {
    localStorage.setItem("pixel_services", JSON.stringify(DEFAULT_SERVICES));
  }
  if (!localStorage.getItem("pixel_cart")) {
    localStorage.setItem("pixel_cart", JSON.stringify([]));
  }
  if (!localStorage.getItem("pixel_expenses")) {
    const demoExpenses = [
      { id: 1, nama: "Langganan Canva Pro", kategori: "Software", nominal: 95000, tanggal: "2026-09-01", keterangan: "Operasional desain" },
      { id: 2, nama: "Iklan IG Ads", kategori: "Iklan", nominal: 150000, tanggal: "2026-09-05", keterangan: "Promosi paket branding" },
      { id: 3, nama: "Paket Internet Kantor", kategori: "Internet", nominal: 250000, tanggal: "2026-09-10", keterangan: "Koneksi bulanan" }
    ];
    localStorage.setItem("pixel_expenses", JSON.stringify(demoExpenses));
  }
  if (!localStorage.getItem("pixel_transactions")) {
    const demoTransactions = [
      {
        id: "PIX-20260920-001",
        pelanggan: "Budi Santoso",
        email: "budi@gmail.com",
        hp: "08123456789",
        alamat: "Tangerang Selatan",
        metode: "QRIS",
        status: "Pembayaran Berhasil",
        tanggal: "2026-09-20 14:30",
        items: [{ id: 1, nama: "Template Instagram UMKM", harga: 50000, qty: 1 }],
        total: 50000
      },
      {
        id: "PIX-20260921-002",
        pelanggan: "Siti Rahma",
        email: "siti@gmail.com",
        hp: "08987654321",
        alamat: "Jakarta Barat",
        metode: "Transfer Bank",
        status: "Menunggu Verifikasi",
        tanggal: "2026-09-21 09:15",
        items: [{ id: 101, nama: "Jasa Desain Logo Bisnis", harga: 100000, qty: 1 }],
        total: 100000
      },
      {
        id: "PIX-20260922-003",
        pelanggan: "Ahmad Fauzi",
        email: "ahmad@gmail.com",
        hp: "08139988776",
        alamat: "Bandung",
        metode: "QRIS",
        status: "Pesanan Diproses",
        tanggal: "2026-09-22 11:00",
        items: [{ id: 4, nama: "Paket Template Branding UMKM", harga: 150000, qty: 1 }],
        total: 150000
      }
    ];
    localStorage.setItem("pixel_transactions", JSON.stringify(demoTransactions));
  }
}

// 4. UTILITY FORMAT RUPIAH
function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number);
}

// 5. UPDATE BADGE KERANJANG DI NAVBAR
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("pixel_cart")) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById("cart-badge");
  if (badge) {
    badge.textContent = totalItems;
  }
}

// 6. FUNGSI KERANJANG: TAMBAH ITEM
function addToCart(itemData) {
  let cart = JSON.parse(localStorage.getItem("pixel_cart")) || [];
  const existIndex = cart.findIndex((i) => i.id === itemData.id);

  if (existIndex > -1) {
    cart[existIndex].qty += 1;
  } else {
    cart.push({ ...itemData, qty: 1 });
  }

  localStorage.setItem("pixel_cart", JSON.stringify(cart));
  updateCartBadge();
  alert(`${itemData.nama} berhasil dimasukkan ke keranjang!`);
}

// 7. RESET DATA DEMO KE AWAL
function resetDemoData() {
  if (confirm("Reset ulang semua data ke setelan demo default?")) {
    localStorage.removeItem("pixel_products");
    localStorage.removeItem("pixel_services");
    localStorage.removeItem("pixel_cart");
    localStorage.removeItem("pixel_expenses");
    localStorage.removeItem("pixel_transactions");
    localStorage.removeItem("pixel_user");
    initStorage();
    alert("Data berhasil direset!");
    location.reload();
  }
}

// JALANKAN INISIALISASI
initStorage();
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
});