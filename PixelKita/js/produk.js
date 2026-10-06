/* ==========================================================
   PIXELKITA STUDIO - JS PRODUK, DETAIL & BELI LANGSUNG
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  renderKatalog();
  renderHalamanDetail();
});

// 1. RENDER KATALOG PRODUK & JASA
function renderKatalog() {
  const containerProduk = document.getElementById("produk-grid");
  const containerJasa = document.getElementById("jasa-grid");

  // Render Produk Digital
  if (containerProduk) {
    const products = JSON.parse(localStorage.getItem("pixel_products")) || [];
    containerProduk.innerHTML = products.map(p => `
      <div class="card card-clickable" onclick="bukaDetail(${p.id}, 'produk')">
        <img 
          src="${p.gambar}" 
          alt="${p.nama}" 
          class="card-img" 
          onerror="this.src='https://placehold.co/600x400/2563eb/ffffff?text=${encodeURIComponent(p.nama)}'"
        >
        <div class="card-body">
          <span class="tag">${p.kategori}</span>
          <h3 class="card-title">${p.nama}</h3>
          <p class="card-desc">${p.deskripsi}</p>
          <div class="card-footer" onclick="event.stopPropagation()">
            <span class="price">${formatRupiah(p.harga)}</span>
            <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
              <button onclick="tambahItem(${p.id}, 'produk')" class="btn btn-outline btn-sm" title="Tambah ke Keranjang">🛒</button>
              <button onclick="beliLangsung(${p.id}, 'produk')" class="btn btn-primary btn-sm">Beli Langsung</button>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  }

  // Render Jasa Desain
  if (containerJasa) {
    const services = JSON.parse(localStorage.getItem("pixel_services")) || [];
    containerJasa.innerHTML = services.map(s => `
      <div class="card card-clickable" onclick="bukaDetail(${s.id}, 'jasa')">
        <img 
          src="${s.gambar}" 
          alt="${s.nama}" 
          class="card-img" 
          onerror="this.src='https://placehold.co/600x400/0f172a/ffffff?text=${encodeURIComponent(s.nama)}'"
        >
        <div class="card-body">
          <span class="tag" style="background:#fef3c7; color:#b45309;">${s.kategori}</span>
          <h3 class="card-title">${s.nama}</h3>
          <p class="card-desc">${s.deskripsi}</p>
          <div style="margin-bottom: 0.8rem; font-size: 0.85rem; color: var(--text-muted);">
            ⏱ Estimasi: <strong>${s.estimasi}</strong>
          </div>
          <div class="card-footer" onclick="event.stopPropagation()">
            <div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">Mulai dari</div>
              <span class="price">${formatRupiah(s.harga)}</span>
            </div>
            <div style="display: flex; gap: 0.35rem; flex-wrap: wrap;">
              <button onclick="tambahItem(${s.id}, 'jasa')" class="btn btn-outline btn-sm" title="Tambah ke Keranjang">🛒</button>
              <button onclick="beliLangsung(${s.id}, 'jasa')" class="btn btn-primary btn-sm">Pesan Langsung</button>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  }
}

// 2. NAVIGASI DETAIL SAAT KARTU DIKLIK
function bukaDetail(id, type) {
  window.location.href = `detail.html?id=${id}&type=${type}`;
}

// 3. FUNGSI BELI LANGSUNG KE CHECKOUT
function beliLangsung(id, type) {
  let list = type === "produk"
    ? (JSON.parse(localStorage.getItem("pixel_products")) || [])
    : (JSON.parse(localStorage.getItem("pixel_services")) || []);

  const target = list.find(item => item.id === id);
  if (!target) return;

  let cart = JSON.parse(localStorage.getItem("pixel_cart")) || [];
  const existIndex = cart.findIndex(i => i.id === target.id);

  if (existIndex > -1) {
    cart[existIndex].qty += 1;
  } else {
    cart.push({ ...target, qty: 1 });
  }

  localStorage.setItem("pixel_cart", JSON.stringify(cart));
  updateCartBadge();
  window.location.href = "checkout.html";
}

// 4. TAMBAH KE KERANJANG BIASA
function tambahItem(id, type) {
  let list = type === "produk"
    ? (JSON.parse(localStorage.getItem("pixel_products")) || [])
    : (JSON.parse(localStorage.getItem("pixel_services")) || []);

  const target = list.find(item => item.id === id);
  if (target) {
    addToCart(target);
  }
}

// 5. RENDER DETAIL PRODUK + TOMBOL KEMBALI
function renderHalamanDetail() {
  const detailContainer = document.getElementById("detail-content");
  if (!detailContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get("id"));
  const type = urlParams.get("type");

  let list = type === "jasa"
    ? (JSON.parse(localStorage.getItem("pixel_services")) || [])
    : (JSON.parse(localStorage.getItem("pixel_products")) || []);

  const item = list.find(x => x.id === id);

  if (!item) {
    detailContainer.innerHTML = `
      <div style="text-align: center; padding: 3rem 0;">
        <h2>Item tidak ditemukan</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Produk atau jasa yang kamu cari mungkin telah dihapus.</p>
        <a href="produk.html" class="btn btn-primary">← Kembali ke Katalog</a>
      </div>
    `;
    return;
  }

  detailContainer.innerHTML = `
    <div style="margin-bottom: 1.5rem;">
      <a href="produk.html" class="btn btn-outline btn-sm" style="display: inline-flex; align-items: center; gap: 0.4rem;">
        ← Kembali ke Katalog Produk
      </a>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; align-items: start;">
      <div>
        <img 
          src="${item.gambar}" 
          alt="${item.nama}" 
          style="width: 100%; border-radius: var(--radius); border: 1px solid var(--border); box-shadow: var(--shadow);"
          onerror="this.src='https://placehold.co/600x450/2563eb/ffffff?text=${encodeURIComponent(item.nama)}'"
        >
      </div>
      <div>
        <span class="tag">${item.kategori}</span>
        <h1 style="font-size: 2.2rem; color: var(--secondary); margin: 0.5rem 0 1rem 0;">${item.nama}</h1>
        <div class="price" style="font-size: 1.8rem; color: var(--primary); margin-bottom: 1.5rem;">
          ${formatRupiah(item.harga)}
        </div>
        
        <div style="background: white; border: 1px solid var(--border); border-radius: var(--radius); padding: 1.2rem; margin-bottom: 1.5rem;">
          <h4 style="margin-bottom: 0.5rem; color: var(--secondary);">Deskripsi Layanan & Spesifikasi:</h4>
          <p style="color: var(--text-muted);">${item.deskripsi}</p>
          ${item.estimasi ? `<p style="margin-top: 0.8rem; font-weight: 600; color: var(--secondary);">⏱ Estimasi Pengerjaan: <span style="color: var(--primary);">${item.estimasi}</span></p>` : ""}
        </div>

        <div style="display: flex; gap: 0.8rem; flex-wrap: wrap;">
          <button onclick="tambahItem(${item.id}, '${type}')" class="btn btn-outline" style="flex: 1; padding: 0.8rem;">
            🛒 Masukkan Keranjang
          </button>
          <button onclick="beliLangsung(${item.id}, '${type}')" class="btn btn-primary" style="flex: 1; padding: 0.8rem; font-size: 1rem;">
            ⚡ Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  `;
}