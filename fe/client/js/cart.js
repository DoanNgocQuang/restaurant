import { renderNavbar, renderFooter } from '../components/index.js';

const API = 'http://localhost:8080/api';

/* ================= TOKEN ================= */
const getToken = () => localStorage.getItem('token');

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    window.location.href = '/pages/login.html';
    return;
  }

  renderNavbar();
  renderFooter();
  renderCart();

  const btn = document.getElementById('checkout-btn');
  if (btn) btn.onclick = checkout;

  // check booking -> disable nút nếu chưa có
  checkBooking().then(b => {
    if (!b && btn) {
      btn.textContent = "Cần đặt bàn trước";
      btn.disabled = true;
      btn.classList.add("opacity-50", "cursor-not-allowed");
    }
  });
});

/* ================= CART STORAGE ================= */

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/* ================= RENDER ================= */

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const countEl = document.getElementById('cart-count');
  const summaryEl = document.getElementById('cart-summary');

  let cartItems = getCart();
  if (!container || !countEl || !summaryEl) return;

  countEl.textContent = `Bạn đang có ${cartItems.length} món`;

  /* ===== EMPTY CART ===== */
  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="text-center py-20 text-slate-400">
        <p class="text-xl mb-4">Giỏ hàng của bạn đang trống</p>
        <a href="/pages/menu.html"
          class="inline-block bg-primary text-black px-6 py-3 rounded-xl font-bold">
          Đi chọn món
        </a>
      </div>
    `;
    summaryEl.innerHTML = "";
    return;
  }

  /* ===== ITEMS ===== */
  container.innerHTML = cartItems.map(item => `
    <div class="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 shadow-xl flex items-center gap-6 hover:bg-white/10 transition">

      <!-- INFO -->
      <div class="flex-1">
        <h3 class="text-lg font-bold text-white">${item.name}</h3>
        <p class="text-slate-400">$${item.price}</p>
      </div>

      <!-- QUANTITY -->
      <div class="flex items-center gap-3 bg-black/30 px-3 py-1 rounded-xl border border-white/10">
        <button class="btn-minus text-lg px-2 text-slate-300 hover:text-white"
          data-id="${item.itemId}" data-type="${item.type}">−</button>

        <span class="text-white font-semibold min-w-[20px] text-center">
          ${item.quantity}
        </span>

        <button class="btn-plus text-lg px-2 text-slate-300 hover:text-white"
          data-id="${item.itemId}" data-type="${item.type}">+</button>
      </div>

      <!-- TOTAL -->
      <div class="min-w-[120px] text-right">
        <p class="text-white font-bold text-lg">
          $${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>

      <!-- REMOVE -->
      <button class="btn-remove text-red-400 hover:text-red-300 text-lg"
        data-id="${item.itemId}" data-type="${item.type}">
        ✕
      </button>

    </div>
  `).join('');

  /* ===== SUMMARY ===== */
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  summaryEl.innerHTML = `
    <div class="flex justify-between text-slate-300">
      <span>Tạm tính</span>
      <span>$${subtotal.toFixed(2)}</span>
    </div>

    <div class="flex justify-between text-slate-300">
      <span>Thuế (10%)</span>
      <span>$${tax.toFixed(2)}</span>
    </div>

    <div class="flex justify-between text-white text-xl font-bold border-t border-white/10 pt-4">
      <span>Tổng</span>
      <span>$${total.toFixed(2)}</span>
    </div>
  `;

  attachEvents();
}

/* ================= EVENTS ================= */

function attachEvents() {
  let cartItems = getCart();

  document.querySelectorAll('.btn-minus').forEach(btn => {
    btn.onclick = () => {
      const item = cartItems.find(i =>
        i.itemId == btn.dataset.id && i.type == btn.dataset.type
      );
      if (item && item.quantity > 1) item.quantity--;
      saveCart(cartItems);
      renderCart();
    };
  });

  document.querySelectorAll('.btn-plus').forEach(btn => {
    btn.onclick = () => {
      const item = cartItems.find(i =>
        i.itemId == btn.dataset.id && i.type == btn.dataset.type
      );
      if (item) item.quantity++;
      saveCart(cartItems);
      renderCart();
    };
  });

  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.onclick = () => {
      cartItems = cartItems.filter(i =>
        !(i.itemId == btn.dataset.id && i.type == btn.dataset.type)
      );
      saveCart(cartItems);
      renderCart();
    };
  });
}

/* ================= CHECK BOOKING ================= */

async function checkBooking() {
  try {
    const res = await fetch(`${API}/bookings/my-current`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

/* ================= CHECKOUT ================= */

async function checkout() {
  const cart = getCart();

  if (cart.length === 0) {
    alert("Giỏ hàng trống");
    return;
  }

  const booking = await checkBooking();

  if (!booking) {
    alert("Bạn cần đặt bàn trước khi order!");
    window.location.href = "/pages/reservations.html";
    return;
  }

  const payload = {
    orderDetails: cart.map(i => ({
      quantity: i.quantity,
      foodId: i.type === "FOOD" ? i.itemId : null,
      comboId: i.type === "COMBO" ? i.itemId : null
    }))
  };

  try {
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(payload)
    });

    const json = await res.json();

    if (!res.ok) throw new Error(json.message);

    alert("Đặt hàng thành công!");

    localStorage.removeItem('cart');
    renderCart();

  } catch (err) {
    console.error(err);
    alert("Đặt hàng thất bại: " + err.message);
  }
}