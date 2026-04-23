import { renderNavbar, renderFooter } from '../components/index.js';

const API = 'http://localhost:8080/api';

const getToken = () => localStorage.getItem('token');
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch (error) {
    return {};
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    window.location.href = '/pages/login.html';
    return;
  }

  renderNavbar();
  renderFooter();
  renderCart();

  const checkoutButton = document.getElementById('checkout-btn');
  if (checkoutButton) {
    checkoutButton.onclick = checkout;
  }

  const booking = await findCurrentBooking();
  updateCheckoutAvailability(booking);
});

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(options.headers || {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const json = await response.json().catch(() => null);
  if (!response.ok || json?.status === 'error') {
    throw new Error(json?.message || `Yêu cầu thất bại (${response.status})`);
  }

  return json?.data;
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const countEl = document.getElementById('cart-count');
  const summaryEl = document.getElementById('cart-summary');
  const cartItems = getCart();

  if (!container || !countEl || !summaryEl) return;

  countEl.textContent = `Bạn đang có ${cartItems.length} món trong giỏ hàng`;

  if (cartItems.length === 0) {
    container.innerHTML = `
      <div class="py-20 text-center text-slate-400">
        <p class="mb-4 text-xl">Giỏ hàng của bạn đang trống</p>
        <a href="/pages/menu.html" class="inline-block rounded-xl bg-primary px-6 py-3 font-bold text-black">
          Đi chọn món
        </a>
      </div>
    `;
    summaryEl.innerHTML = '';
    return;
  }

  container.innerHTML = cartItems.map((item) => `
    <div class="flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur transition hover:bg-white/10">
      <img src="${item.imageUrl || '/images/placeholder.jpg'}" class="h-16 w-16 rounded-xl object-cover shadow-md" alt="${item.name}"/>
      <div class="flex-1">
        <h3 class="text-lg font-bold text-white">${item.name}</h3>
        <p class="text-slate-400">${formatCurrency(item.price)}</p>
      </div>
      <div class="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-1">
        <button class="btn-minus px-2 text-lg text-slate-300 hover:text-white" data-id="${item.itemId}" data-type="${item.type}">−</button>
        <span class="min-w-[20px] text-center font-semibold text-white">${item.quantity}</span>
        <button class="btn-plus px-2 text-lg text-slate-300 hover:text-white" data-id="${item.itemId}" data-type="${item.type}">+</button>
      </div>
      <div class="min-w-[140px] text-right">
        <p class="text-lg font-bold text-white">${formatCurrency(item.price * item.quantity)}</p>
      </div>
      <button class="btn-remove text-lg text-red-400 hover:text-red-300" data-id="${item.itemId}" data-type="${item.type}">✕</button>
    </div>
  `).join('');

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  summaryEl.innerHTML = `
    <div class="flex justify-between text-slate-300">
      <span>Tạm tính</span>
      <span>${formatCurrency(subtotal)}</span>
    </div>
    <div class="flex justify-between text-slate-300">
      <span>Thuế (10%)</span>
      <span>${formatCurrency(tax)}</span>
    </div>
    <div class="flex justify-between border-t border-white/10 pt-4 text-xl font-bold text-white">
      <span>Tổng</span>
      <span>${formatCurrency(total)}</span>
    </div>
  `;

  attachEvents();
}

function attachEvents() {
  let cartItems = getCart();

  document.querySelectorAll('.btn-minus').forEach((button) => {
    button.onclick = () => {
      const item = cartItems.find((cartItem) => cartItem.itemId == button.dataset.id && cartItem.type == button.dataset.type);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
      saveCart(cartItems);
      renderCart();
    };
  });

  document.querySelectorAll('.btn-plus').forEach((button) => {
    button.onclick = () => {
      const item = cartItems.find((cartItem) => cartItem.itemId == button.dataset.id && cartItem.type == button.dataset.type);
      if (item) {
        item.quantity += 1;
      }
      saveCart(cartItems);
      renderCart();
    };
  });

  document.querySelectorAll('.btn-remove').forEach((button) => {
    button.onclick = () => {
      cartItems = cartItems.filter((item) => !(item.itemId == button.dataset.id && item.type == button.dataset.type));
      saveCart(cartItems);
      renderCart();
    };
  });
}

async function findCurrentBooking() {
  try {
    const booking = await apiRequest('/bookings/my-current');
    if (booking) {
      return booking;
    }
  } catch (error) {
  }

  try {
    const user = getUser();
    if (!user.id) return null;
    const bookings = await apiRequest(`/bookings?userId=${encodeURIComponent(user.id)}`);
    const bookingList = Array.isArray(bookings) ? bookings : [];
    return bookingList
      .filter((booking) => booking.status === 'PENDING')
      .sort((first, second) => new Date(second.bookingTime) - new Date(first.bookingTime))[0] || null;
  } catch (error) {
    return null;
  }
}

function updateCheckoutAvailability(booking) {
  const button = document.getElementById('checkout-btn');
  if (!button) return;

  if (!booking) {
    button.textContent = 'Cần đặt bàn trước';
    button.disabled = true;
    button.classList.add('opacity-50', 'cursor-not-allowed');
    return;
  }

  button.disabled = false;
  button.classList.remove('opacity-50', 'cursor-not-allowed');
}

async function checkout() {
  const cart = getCart();

  if (cart.length === 0) {
    alert('Giỏ hàng trống');
    return;
  }

  const booking = await findCurrentBooking();
  if (!booking) {
    alert('Bạn cần đặt bàn trước khi gọi món.');
    window.location.href = '/pages/reservations.html';
    return;
  }

  const payload = {
    orderDetails: cart.map((item) => ({
      quantity: item.quantity,
      foodId: item.type === 'FOOD' ? item.itemId : null,
      comboId: item.type === 'COMBO' ? item.itemId : null
    }))
  };

  try {
    const createdOrder = await apiRequest('/orders', {
      method: 'POST',
      body: payload
    });

    // Redirect to checkout page with order details
    // Do NOT clear cart yet, wait until payment is successful
    window.location.href = `/pages/checkout.html?orderId=${createdOrder.id}`;
  } catch (error) {
    alert(`Gọi món thất bại: ${error.message}`);
  }
}
