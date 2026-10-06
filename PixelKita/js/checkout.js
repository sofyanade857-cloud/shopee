/* ==========================================================
   PIXELKITA STUDIO - JS CHECKOUT & KERANJANG
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  renderKeranjang();
  setupCheckoutForm();
});

function renderKeranjang() {
  const container = document.getElementById("cart-items-container");
  const subtotalEl = document.getElementById("cart-subtotal");
  const totalEl = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("btn-submit-order");

  if (!container) return;

  const cart = JSON.parse(localStorage.getItem("pixel_cart")) || [];

  if (cart.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
          Keranjang belanja kamu masih kosong. Yuk pilih produk atau jasa dulu!
        </td>
      </tr>
    `;
    if (subtotalEl) subtotalEl.textContent = formatRupiah(0);
    if (totalEl) totalEl.textContent = formatRupiah(0);
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  if (checkoutBtn) checkoutBtn.disabled = false;

  let grandTotal = 0;

  container.innerHTML = cart.map((item, index) => {
    const itemSubtotal = item.harga * item.qty;
    grandTotal += itemSubtotal;
    return `
      <tr>
        <td>
          <div style="font-weight: 700; color: var(--secondary);">${item.nama}</div>
          <small style="color: var(--text-muted);">${item.kategori}</small>
        </td>
        <td>${formatRupiah(item.harga)}</td>
        <td>
          <div style="display: inline-flex; align-items: center; border: 1px solid var(--border); border-radius: 6px; overflow: hidden;">
            <button onclick="ubahQty(${index}, -1)" class="btn btn-secondary btn-sm" style="border-radius: 0; padding: 0.2rem 0.6rem;">-</button>
            <span style="padding: 0.2rem 0.8rem; font-weight: bold;">${item.qty}</span>
            <button onclick="ubahQty(${index}, 1)" class="btn btn-secondary btn-sm" style="border-radius: 0; padding: 0.2rem 0.6rem;">+</button>
          </div>
        </td>
        <td style="font-weight: 700;">${formatRupiah(itemSubtotal)}</td>
        <td>
          <button onclick="hapusItemKeranjang(${index})" class="btn btn-danger btn-sm">Hapus</button>
        </td>
      </tr>
    `;
  }).join("");

  if (subtotalEl) subtotalEl.textContent = formatRupiah(grandTotal);
  if (totalEl) totalEl.textContent = formatRupiah(grandTotal);
}

function ubahQty(index, delta) {
  let cart = JSON.parse(localStorage.getItem("pixel_cart")) || [];
  if (!cart[index]) return;

  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("pixel_cart", JSON.stringify(cart));
  updateCartBadge();
  renderKeranjang();
}

function hapusItemKeranjang(index) {
  let cart = JSON.parse(localStorage.getItem("pixel_cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("pixel_cart", JSON.stringify(cart));
  updateCartBadge();
  renderKeranjang();
}

function setupCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem("pixel_cart")) || [];
    if (cart.length === 0) {
      alert("Keranjang kamu masih kosong!");
      return;
    }

    const nama = document.getElementById("cust-nama").value.trim();
    const email = document.getElementById("cust-email").value.trim();
    const hp = document.getElementById("cust-hp").value.trim();
    const alamat = document.getElementById("cust-alamat").value.trim();
    const catatan = document.getElementById("cust-catatan").value.trim();
    const metode = document.querySelector('input[name="metode_bayar"]:checked').value;

    const total = cart.reduce((sum, item) => sum + item.harga * item.qty, 0);

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const invoiceId = `PIX-${year}${month}${day}-${randomSuffix}`;

    const transaksiBaru = {
      id: invoiceId,
      pelanggan: nama,
      email: email,
      hp: hp,
      alamat: alamat,
      catatan: catatan,
      metode: metode,
      status: "Menunggu Verifikasi",
      tanggal: `${year}-${month}-${day} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      items: cart,
      total: total
    };

    let transactions = JSON.parse(localStorage.getItem("pixel_transactions")) || [];
    transactions.unshift(transaksiBaru);
    localStorage.setItem("pixel_transactions", JSON.stringify(transactions));

    localStorage.setItem("pixel_cart", JSON.stringify([]));
    updateCartBadge();

    window.location.href = `transaksi.html?id=${invoiceId}`;
  });
}