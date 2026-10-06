/* ==========================================================
   PIXELKITA STUDIO - JS DASHBOARD ADMIN & KEUANGAN
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  cekAksesAdmin();
  muatStatistik();
  renderTabelVerifikasi();
  renderTabelPengeluaran();
  renderRekapLaporan();
  setupFormPengeluaran();
  setupFormProdukJasa();
});

function cekAksesAdmin() {
  const user = JSON.parse(localStorage.getItem("pixel_user"));
  if (!user || user.role !== "admin") {
    alert("Halaman khusus Admin. Silakan login terlebih dahulu!");
    window.location.href = "login.html";
  }
}

function logout() {
  localStorage.removeItem("pixel_user");
  window.location.href = "login.html";
}

function muatStatistik() {
  const products = JSON.parse(localStorage.getItem("pixel_products")) || [];
  const services = JSON.parse(localStorage.getItem("pixel_services")) || [];
  const transactions = JSON.parse(localStorage.getItem("pixel_transactions")) || [];
  const expenses = JSON.parse(localStorage.getItem("pixel_expenses")) || [];

  const totalPendapatan = transactions
    .filter(t => t.status === "Pembayaran Berhasil" || t.status === "Selesai")
    .reduce((sum, t) => sum + t.total, 0);

  const totalPengeluaran = expenses.reduce((sum, e) => sum + e.nominal, 0);
  const labaBersih = totalPendapatan - totalPengeluaran;

  const elProduk = document.getElementById("stat-total-produk");
  const elJasa = document.getElementById("stat-total-jasa");
  const elTrx = document.getElementById("stat-total-trx");
  const elPendapatan = document.getElementById("stat-pendapatan");
  const elPengeluaran = document.getElementById("stat-pengeluaran");
  const elLaba = document.getElementById("stat-laba");

  if (elProduk) elProduk.textContent = products.length;
  if (elJasa) elJasa.textContent = services.length;
  if (elTrx) elTrx.textContent = transactions.length;
  if (elPendapatan) elPendapatan.textContent = formatRupiah(totalPendapatan);
  if (elPengeluaran) elPengeluaran.textContent = formatRupiah(totalPengeluaran);
  if (elLaba) {
    elLaba.textContent = formatRupiah(labaBersih);
    elLaba.style.color = labaBersih >= 0 ? "var(--success)" : "var(--danger)";
  }

  renderGrafikKeuangan(totalPendapatan, totalPengeluaran);
}

function renderGrafikKeuangan(pendapatan, pengeluaran) {
  const container = document.getElementById("grafik-keuangan-container");
  if (!container) return;

  const maxVal = Math.max(pendapatan, pengeluaran, 1);
  const persenPendapatan = Math.round((pendapatan / maxVal) * 100);
  const persenPengeluaran = Math.round((pengeluaran / maxVal) * 100);

  container.innerHTML = `
    <div style="display: flex; gap: 2rem; align-items: flex-end; height: 160px; padding: 1rem 0; border-bottom: 2px solid var(--border);">
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end;">
        <span style="font-size: 0.8rem; font-weight: bold; margin-bottom: 0.3rem;">${formatRupiah(pendapatan)}</span>
        <div style="width: 100%; max-width: 90px; height: ${persenPendapatan}%; background: var(--success); border-radius: 6px 6px 0 0;"></div>
        <span style="font-size: 0.85rem; font-weight: 600; margin-top: 0.5rem;">Pendapatan</span>
      </div>
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end;">
        <span style="font-size: 0.8rem; font-weight: bold; margin-bottom: 0.3rem;">${formatRupiah(pengeluaran)}</span>
        <div style="width: 100%; max-width: 90px; height: ${persenPengeluaran}%; background: var(--danger); border-radius: 6px 6px 0 0;"></div>
        <span style="font-size: 0.85rem; font-weight: 600; margin-top: 0.5rem;">Pengeluaran</span>
      </div>
    </div>
  `;
}

function renderTabelVerifikasi() {
  const container = document.getElementById("tabel-verifikasi-body");
  if (!container) return;

  const transactions = JSON.parse(localStorage.getItem("pixel_transactions")) || [];

  container.innerHTML = transactions.map((t) => `
    <tr>
      <td><strong>${t.id}</strong></td>
      <td>${t.pelanggan}</td>
      <td>${t.metode}</td>
      <td><strong>${formatRupiah(t.total)}</strong></td>
      <td><span class="status-pill status-${t.status === "Pembayaran Berhasil" ? "berhasil" : (t.status === "Menunggu Verifikasi" ? "verifikasi" : "menunggu")}">${t.status}</span></td>
      <td>
        <select onchange="ubahStatusTransaksi('${t.id}', this.value)" class="form-control" style="padding: 0.3rem 0.5rem; font-size: 0.85rem; width: auto;">
          <option value="Menunggu Pembayaran" ${t.status === "Menunggu Pembayaran" ? "selected" : ""}>Menunggu Pembayaran</option>
          <option value="Menunggu Verifikasi" ${t.status === "Menunggu Verifikasi" ? "selected" : ""}>Menunggu Verifikasi</option>
          <option value="Pembayaran Berhasil" ${t.status === "Pembayaran Berhasil" ? "selected" : ""}>Pembayaran Berhasil</option>
          <option value="Pesanan Diproses" ${t.status === "Pesanan Diproses" ? "selected" : ""}>Pesanan Diproses</option>
          <option value="Selesai" ${t.status === "Selesai" ? "selected" : ""}>Selesai</option>
        </select>
      </td>
    </tr>
  `).join("");
}

function ubahStatusTransaksi(id, statusBaru) {
  let transactions = JSON.parse(localStorage.getItem("pixel_transactions")) || [];
  const idx = transactions.findIndex(t => t.id === id);
  if (idx > -1) {
    transactions[idx].status = statusBaru;
    localStorage.setItem("pixel_transactions", JSON.stringify(transactions));
    muatStatistik();
    renderTabelVerifikasi();
    renderRekapLaporan();
  }
}

function renderTabelPengeluaran() {
  const container = document.getElementById("tabel-pengeluaran-body");
  if (!container) return;

  const expenses = JSON.parse(localStorage.getItem("pixel_expenses")) || [];

  container.innerHTML = expenses.map((e, index) => `
    <tr>
      <td>${index + 1}</td>
      <td><strong>${e.nama}</strong></td>
      <td><span class="tag">${e.kategori}</span></td>
      <td style="color: var(--danger); font-weight: bold;">-${formatRupiah(e.nominal)}</td>
      <td>${e.tanggal}</td>
      <td>${e.keterangan || "-"}</td>
      <td>
        <button onclick="hapusPengeluaran(${e.id})" class="btn btn-danger btn-sm">Hapus</button>
      </td>
    </tr>
  `).join("");
}

function setupFormPengeluaran() {
  const form = document.getElementById("form-tambah-pengeluaran");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nama = document.getElementById("exp-nama").value.trim();
    const kategori = document.getElementById("exp-kategori").value;
    const nominal = parseInt(document.getElementById("exp-nominal").value);
    const tanggal = document.getElementById("exp-tanggal").value;
    const keterangan = document.getElementById("exp-keterangan").value.trim();

    let expenses = JSON.parse(localStorage.getItem("pixel_expenses")) || [];
    expenses.unshift({
      id: Date.now(),
      nama,
      kategori,
      nominal,
      tanggal,
      keterangan
    });

    localStorage.setItem("pixel_expenses", JSON.stringify(expenses));
    form.reset();
    muatStatistik();
    renderTabelPengeluaran();
    alert("Pengeluaran berhasil dicatat!");
  });
}

function hapusPengeluaran(id) {
  if (confirm("Hapus catatan pengeluaran ini?")) {
    let expenses = JSON.parse(localStorage.getItem("pixel_expenses")) || [];
    expenses = expenses.filter(e => e.id !== id);
    localStorage.setItem("pixel_expenses", JSON.stringify(expenses));
    muatStatistik();
    renderTabelPengeluaran();
  }
}

function renderRekapLaporan() {
  const container = document.getElementById("tabel-laporan-body");
  const filterEl = document.getElementById("filter-laporan-status");
  if (!container) return;

  const filter = filterEl ? filterEl.value : "Semua";
  let transactions = JSON.parse(localStorage.getItem("pixel_transactions")) || [];

  if (filter !== "Semua") {
    transactions = transactions.filter(t => t.status === filter);
  }

  container.innerHTML = transactions.map((t, idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td><strong>${t.id}</strong></td>
      <td>${t.pelanggan}</td>
      <td>${t.items.map(i => `${i.nama} (${i.qty})`).join(", ")}</td>
      <td style="font-weight: 700;">${formatRupiah(t.total)}</td>
      <td><span class="status-pill status-${t.status === "Pembayaran Berhasil" ? "berhasil" : "menunggu"}">${t.status}</span></td>
      <td>${t.tanggal}</td>
    </tr>
  `).join("");
}

function setupFormProdukJasa() {
  const form = document.getElementById("form-tambah-item");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const tipe = document.getElementById("item-tipe").value;
    const nama = document.getElementById("item-nama").value.trim();
    const kategori = document.getElementById("item-kategori").value.trim();
    const harga = parseInt(document.getElementById("item-harga").value);
    const gambar = document.getElementById("item-gambar").value.trim() || "assets/images/default.jpg";
    const deskripsi = document.getElementById("item-deskripsi").value.trim();

    if (tipe === "produk") {
      let products = JSON.parse(localStorage.getItem("pixel_products")) || [];
      products.push({ id: Date.now(), nama, kategori, harga, gambar, deskripsi });
      localStorage.setItem("pixel_products", JSON.stringify(products));
    } else {
      const estimasi = document.getElementById("item-estimasi").value.trim() || "2-3 Hari";
      let services = JSON.parse(localStorage.getItem("pixel_services")) || [];
      services.push({ id: Date.now(), nama, kategori, harga, estimasi, gambar, deskripsi });
      localStorage.setItem("pixel_services", JSON.stringify(services));
    }

    form.reset();
    muatStatistik();
    alert("Item berhasil ditambahkan ke katalog!");
  });
}