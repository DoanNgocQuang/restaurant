import { renderNavbar, renderFooter } from '../components/index.js';

const API = 'http://localhost:8080/api';

const getToken = () => localStorage.getItem('token');
const get = (id) => document.getElementById(id);

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
  renderHome();
});

async function fetchAPI(url) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
    }
  });

  const json = await response.json();
  if (!response.ok || json?.status === 'error') {
    throw new Error(json?.message || 'API error');
  }

  return json.data;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

function backBtn() {
  return `
    <button id="back" class="mb-6 text-slate-300 transition hover:text-white hover:underline">
      ← Quay lại
    </button>
  `;
}

function listItem(title, desc, right, attrName, attrValue) {
  return `
    <div
      class="flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-md transition-all duration-200 hover:scale-[1.01] hover:bg-white/10"
      ${attrName}="${attrValue}"
    >
      <div>
        <h4 class="text-lg font-bold text-white">${title}</h4>
        <p class="mt-1 text-sm text-slate-400">${desc || ''}</p>
      </div>
      <span class="text-lg font-semibold text-primary">${right}</span>
    </div>
  `;
}

function renderHome() {
  const el = get('menu-container');

  el.innerHTML = `
    <div class="grid gap-12 md:grid-cols-2">
      <div id="btn-category" class="group cursor-pointer rounded-2xl border border-primary/20 bg-white/5 p-10 shadow-xl backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-primary/10">
        <h2 class="text-3xl font-bold text-white transition group-hover:text-primary">Danh mục món</h2>
        <p class="mt-2 text-slate-400">Khám phá các món ăn đang phục vụ</p>
      </div>
      <div id="btn-combo" class="group cursor-pointer rounded-2xl border border-primary/20 bg-white/5 p-10 shadow-xl backdrop-blur-md transition-all hover:scale-[1.02] hover:bg-primary/10">
        <h2 class="text-3xl font-bold text-white transition group-hover:text-primary">Combo</h2>
        <p class="mt-2 text-slate-400">Combo tiết kiệm đang mở bán</p>
      </div>
    </div>
  `;

  get('btn-category').onclick = renderCategoryList;
  get('btn-combo').onclick = renderComboList;
}

async function renderCategoryList() {
  const el = get('menu-container');

  try {
    const categories = await fetchAPI(`${API}/categories`);

    el.innerHTML = `
      ${backBtn()}
      <div class="space-y-4">
        ${categories.map((category) => listItem(category.name, category.description || '', `${category.foodCount || 0} món`, 'data-name', category.name)).join('')}
      </div>
    `;

    el.querySelectorAll('[data-name]').forEach((item) => {
      item.onclick = () => renderFoodList(item.dataset.name);
    });

    get('back').onclick = renderHome;
  } catch (error) {
    el.innerHTML = `<p class="text-red-500">${error.message || 'Lỗi tải danh mục'}</p>`;
  }
}

async function renderFoodList(categoryName) {
  const el = get('menu-container');

  try {
    const foods = await fetchAPI(`${API}/foods?categoryName=${encodeURIComponent(categoryName)}`);
    const activeFoods = foods.filter((food) => food.status === 'AVAILABLE');

    el.innerHTML = `
      ${backBtn()}
      <h2 class="mb-6 text-3xl font-bold text-white">${categoryName}</h2>
      <div class="space-y-4">
        ${activeFoods.map((food) => listItem(food.name, food.description, formatCurrency(food.price), 'data-id', food.id)).join('')}
      </div>
    `;

    if (activeFoods.length === 0) {
      el.innerHTML += `<p class="mt-6 text-slate-400">Danh mục này hiện chưa có món đang phục vụ.</p>`;
    }

    el.querySelectorAll('[data-id]').forEach((item) => {
      item.onclick = () => renderFoodDetail(item.dataset.id);
    });

    get('back').onclick = renderCategoryList;
  } catch (error) {
    el.innerHTML = `<p class="text-red-500">${error.message || 'Lỗi tải món ăn'}</p>`;
  }
}

async function renderFoodDetail(id) {
  const el = get('menu-container');

  try {
    const food = await fetchAPI(`${API}/foods/${id}`);

    el.innerHTML = `
      ${backBtn()}
      <div class="grid items-center gap-12 md:grid-cols-2">
        <img src="${food.imageUrl || '/images/placeholder.jpg'}" class="h-[400px] w-full rounded-2xl object-cover shadow-2xl"/>
        <div class="space-y-4">
          <h2 class="text-4xl font-black text-white">${food.name}</h2>
          <p class="text-slate-300">${food.description || ''}</p>
          <p class="text-2xl font-bold text-primary">${formatCurrency(food.price)}</p>
          <div class="mt-6 flex items-center gap-4">
            <input id="qty" type="number" value="1" min="1" class="w-20 rounded-lg border border-white/20 bg-black/50 px-3 py-2 text-white"/>
            <button id="add" class="rounded-xl bg-primary px-6 py-3 font-bold text-black transition-all hover:scale-105">
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    `;

    get('add').onclick = () => {
      addToCart({
        type: 'FOOD',
        itemId: food.id,
        name: food.name,
        price: Number(food.price),
        quantity: Number(get('qty').value || 1)
      });
    };

    get('back').onclick = () => renderFoodList(food.category?.name || '');
  } catch (error) {
    el.innerHTML = `<p class="text-red-500">${error.message || 'Lỗi tải chi tiết món ăn'}</p>`;
  }
}

async function renderComboList() {
  const el = get('menu-container');

  try {
    const combos = await fetchAPI(`${API}/combos`);
    const activeCombos = combos.filter((combo) => combo.status === 'AVAILABLE');

    el.innerHTML = `
      ${backBtn()}
      <div class="space-y-4">
        ${activeCombos.map((combo) => listItem(combo.name, combo.description, formatCurrency(combo.price), 'data-id', combo.id)).join('')}
      </div>
    `;

    if (activeCombos.length === 0) {
      el.innerHTML += `<p class="mt-6 text-slate-400">Hiện chưa có combo đang phục vụ.</p>`;
    }

    el.querySelectorAll('[data-id]').forEach((item) => {
      item.onclick = () => renderComboDetail(item.dataset.id);
    });

    get('back').onclick = renderHome;
  } catch (error) {
    el.innerHTML = `<p class="text-red-500">${error.message || 'Lỗi tải combo'}</p>`;
  }
}

async function renderComboDetail(id) {
  const el = get('menu-container');

  try {
    const combo = await fetchAPI(`${API}/combos/${id}`);

    el.innerHTML = `
      ${backBtn()}
      <div class="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
        <h2 class="text-3xl font-bold text-white">${combo.name}</h2>
        <p class="text-slate-300">${combo.description || ''}</p>
        <p class="text-2xl font-bold text-primary">${formatCurrency(combo.price)}</p>
        <div class="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
          ${(combo.foods || []).length > 0
            ? combo.foods.map((food) => `<div>${food.foodName}</div>`).join('')
            : 'Combo này chưa có mô tả món đi kèm.'}
        </div>
        <button id="add" class="rounded-xl bg-primary px-6 py-3 font-bold text-black transition-all hover:scale-105">
          Thêm combo
        </button>
      </div>
    `;

    get('add').onclick = () => {
      addToCart({
        type: 'COMBO',
        itemId: combo.id,
        name: combo.name,
        price: Number(combo.price),
        quantity: 1
      });
    };

    get('back').onclick = renderComboList;
  } catch (error) {
    el.innerHTML = `<p class="text-red-500">${error.message || 'Lỗi tải chi tiết combo'}</p>`;
  }
}

async function addToCart(item) {
  if (!getToken()) {
    alert("Vui lòng đăng nhập trước khi gọi món.");
    window.location.href = "/pages/login.html";
    return;
  }

  try {
    const booking = await fetchAPI(`${API}/bookings/my-current`);
    if (!booking) {
      alert("Bạn cần phải đặt bàn trước khi có thể gọi món!");
      window.location.href = "/pages/reservations.html";
      return;
    }
  } catch (error) {
    alert("Vui lòng đăng nhập lại để gọi món.");
    window.location.href = "/pages/login.html";
    return;
  }

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existingIndex = cart.findIndex((cartItem) => cartItem.type === item.type && cartItem.itemId === item.itemId);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Đã thêm vào giỏ hàng.');
}
