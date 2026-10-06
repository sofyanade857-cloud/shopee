/* ==========================================================
   PIXELKITA STUDIO - JS BUKTI TRANSAKSI (INVOICE)
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  renderHalamanTransaksi();
});

function renderHalamanTransaksi() {
  const container = document.getElementById("transaksi-detail-container");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const idTrx = urlParams.get("id");

  const transactions = JSON.parse(localStorage.getItem("pixel_transactions")) || [];
  const trx = transactions.find(t => t.id === idTrx);

  if (!trx) {
    container.innerHTML = `
      <div style="text-align: center; padding: 3rem 0;">
        <h2>Transaksi Tidak Ditemukan</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Nomor transaksi tidak valid atau belum tersimpan.</p>
        <a href="index.html" class="btn btn-primary">Kembali ke Beranda</a>
      </div>
    `;
    return;
  }

  let statusClass = "status-menunggu";
  if (trx.status === "Menunggu Verifikasi") statusClass = "status-verifikasi";
  if (trx.status === "Pembayaran Berhasil") statusClass = "status-berhasil";
  if (trx.status === "Pesanan Diproses") statusClass = "status-proses";
  if (trx.status === "Selesai") statusClass = "status-selesai";

  const instruksiBayar = trx.metode === "QRIS"
    ? `
      <div style="background: #f8fafc; border: 1px dashed var(--border); border-radius: var(--radius); padding: 1.5rem; text-align: center; margin-top: 1.5rem;">
        <h4 style="margin-bottom: 0.5rem; color: var(--secondary);">Scan QRIS PixelKita</h4>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PIXELKITA-${trx.id}" alt="QRIS" style="border-radius: 8px; margin: 0.8rem 0;">
        <p style="font-size: 0.85rem; color: var(--text-muted);">Mendukung GoPay, OVO, Dana, ShopeePay, & BCA/Mandiri Mobile.</p>
      </div>
    `
    : `
      <div style="background: #f8fafc; border: 1px dashed var(--border); border-radius: var(--radius); padding: 1.5rem; margin-top: 1.5rem;">
        <h4 style="margin-bottom: 0.8rem; color: var(--secondary);">Rekening Pembayaran Bank</h4>
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border);">
          <span>Bank BCA</span>
          <strong>8831-2900-11 (A.N PixelKita Studio)</strong>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
          <span>Bank Mandiri</span>
          <strong>137-00-18929-21 (A.N PixelKita Studio)</strong>
        </div>
      </div>
    `;

  container.innerHTML = `
    <div style="background: white; border: 1px solid var(--border); border-radius: var(--radius); padding: 2rem; box-shadow: var(--shadow);">
      <div style="display: flex; justify-content: space-between; align-items: start; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; margin-bottom: 1.5rem;">
        <div>
          <h2 style="color: var(--secondary);">Invoice Pembayaran</h2>
          <span style="font-family: monospace; font-size: 1.1rem; color: var(--primary); font-weight: bold;">${trx.id}</span>
          <div style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.3rem;">Waktu Transaksi: ${trx.tanggal}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.3rem;">Status Pembayaran:</div>
          <span class="status-pill ${statusClass}">${trx.status}</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 1.5rem;">
        <div>
          <h4 style="color: var(--secondary); margin-bottom: 0.4rem;">Informasi Pemesan:</h4>
          <p><strong>Nama:</strong> ${trx.pelanggan}</p>
          <p><strong>Email:</strong> ${trx.email}</p>
          <p><strong>No. HP:</strong> ${trx.hp}</p>
        </div>
        <div>
          <h4 style="color: var(--secondary); margin-bottom: 0.4rem;">Metode & Detail:</h4>
          <p><strong>Metode Bayar:</strong> ${trx.metode}</p>
          <p><strong>Alamat:</strong> ${trx.alamat || "-"}</p>
          <p><strong>Catatan:</strong> ${trx.catatan || "-"}</p>
        </div>
      </div>

      <h4 style="color: var(--secondary); margin-bottom: 0.6rem;">Item Yang Dipesan:</h4>
      <div class="table-wrapper" style="margin-bottom: 1.5rem;">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Harga</th>
              <th>Qty</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${trx.items.map(item => `
              <tr>
                <td><strong>${item.nama}</strong></td>
                <td>${formatRupiah(item.harga)}</td>
                <td>${item.qty}</td>
                <td><strong>${formatRupiah(item.harga * item.qty)}</strong></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div style="display: flex; justify-content: flex-end; margin-bottom: 1.5rem;">
        <div style="text-align: right;">
          <span style="color: var(--text-muted); font-size: 0.95rem;">Total Tagihan:</span>
          <div style="font-size: 1.8rem; font-weight: 800; color: var(--primary);">${formatRupiah(trx.total)}</div>
        </div>
      </div>

      ${instruksiBayar}

      <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
        <button onclick="window.print()" class="btn btn-outline">Cetak Bukti Transaksi</button>
        <a href="produk.html" class="btn btn-primary">Lanjut Belanja</a>
      </div>
    </div>
  `;
}