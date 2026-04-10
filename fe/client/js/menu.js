import { renderNavbar, renderFooter } from '../components/index.js';

const API = 'http://localhost:8080/api';

/* ================= TOKEN ================= */
const getToken = () => localStorage.getItem('token');

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
  renderHome();
});

/* ================= HELPERS ================= */
const get = (id) => document.getElementById(id);

const fetchAPI = async (url) => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() && {
        Authorization: `Bearer ${getToken()}`
      })
    }
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'API error');

  return json.data;
};

/* ================= UI COMPONENTS ================= */

const backBtn = () => `
  <button id="back"
    class="mb-6 text-slate-300 hover:text-white hover:underline transition">
    ← Back
  </button>
`;

const listItem = (title, desc, right, attrName, attrValue) => `
  <div 
    class="flex justify-between items-center bg-white/5 backdrop-blur-md 
           border border-white/10 rounded-xl p-5 cursor-pointer 
           hover:bg-white/10 hover:scale-[1.01] transition-all duration-200"
    ${attrName}="${attrValue}"
  >
    <div>
      <h4 class="font-bold text-white text-lg">${title}</h4>
      <p class="text-sm text-slate-400 mt-1">${desc || ''}</p>
    </div>

    <span class="text-primary font-semibold text-lg">${right}</span>
  </div>
`;

/* ================= HOME ================= */

function renderHome() {
  const el = get('menu-container');

  el.innerHTML = `
    <div class="grid md:grid-cols-2 gap-12">

      <div id="btn-category"
        class="group rounded-2xl border border-primary/20 p-10 cursor-pointer 
               bg-white/5 backdrop-blur-md 
               hover:bg-primary/10 hover:scale-[1.02] transition-all shadow-xl">
        <h2 class="text-3xl font-bold text-white group-hover:text-primary transition">
          Danh mục món
        </h2>
        <p class="text-slate-400 mt-2">Khám phá các món ăn</p>
      </div>

      <div id="btn-combo"
        class="group rounded-2xl border border-primary/20 p-10 cursor-pointer 
               bg-white/5 backdrop-blur-md 
               hover:bg-primary/10 hover:scale-[1.02] transition-all shadow-xl">
        <h2 class="text-3xl font-bold text-white group-hover:text-primary transition">
          Combo
        </h2>
        <p class="text-slate-400 mt-2">Combo tiết kiệm</p>
      </div>

    </div>
  `;

  get('btn-category').onclick = renderCategoryList;
  get('btn-combo').onclick = renderComboList;
}

/* ================= CATEGORY ================= */

async function renderCategoryList() {
  const el = get('menu-container');

  try {
    const categories = await fetchAPI(`${API}/categories`);

    el.innerHTML = `
      ${backBtn()}
      <div class="space-y-4">
        ${categories.map(c =>
          listItem(c.name, '', c.foodCount || 0, 'data-name', c.name)
        ).join('')}
      </div>
    `;

    el.querySelectorAll('[data-name]').forEach(item => {
      item.onclick = () => renderFoodList(item.dataset.name);
    });

    get('back').onclick = renderHome;

  } catch {
    el.innerHTML = `<p class="text-red-500">Lỗi load category</p>`;
  }
}

/* ================= FOOD LIST ================= */

async function renderFoodList(categoryName) {
  const el = get('menu-container');

  try {
    const foods = await fetchAPI(
      `${API}/foods?categoryName=${encodeURIComponent(categoryName)}`
    );

    el.innerHTML = `
      ${backBtn()}
      <h2 class="text-3xl font-bold mb-6 text-white">${categoryName}</h2>

      <div class="space-y-4">
        ${foods.map(f =>
          listItem(f.name, f.description, `$${f.price}`, 'data-id', f.id)
        ).join('')}
      </div>
    `;

    el.querySelectorAll('[data-id]').forEach(item => {
      item.onclick = () => renderFoodDetail(item.dataset.id);
    });

    get('back').onclick = renderCategoryList;

  } catch {
    el.innerHTML = `<p class="text-red-500">Lỗi load food</p>`;
  }
}

/* ================= FOOD DETAIL ================= */

async function renderFoodDetail(id) {
  const el = get('menu-container');

  try {
    const food = await fetchAPI(`${API}/foods/${id}`);

    el.innerHTML = `
      ${backBtn()}

      <div class="grid md:grid-cols-2 gap-12 items-center">

        <img src="${food.imageUrl || '/images/placeholder.jpg'}"
             class="rounded-2xl h-[400px] w-full object-cover shadow-2xl"/>

        <div class="space-y-4">
          <h2 class="text-4xl font-black text-white">${food.name}</h2>

          <p class="text-slate-300">
            ${food.description || ''}
          </p>

          <p class="text-2xl font-bold text-primary">$${food.price}</p>

          <div class="flex items-center gap-4 mt-6">
            <input id="qty" type="number" value="1" min="1"
              class="w-20 border border-white/20 bg-black/50 px-3 py-2 rounded-lg text-white"/>

            <button id="add"
              class="bg-primary text-black px-6 py-3 rounded-xl font-bold 
                     hover:scale-105 transition-all">
              🛒 Thêm vào giỏ
            </button>
          </div>
        </div>

      </div>
    `;

    get('add').onclick = () => {
      addToCart({
        type: "FOOD",
        itemId: food.id,
        name: food.name,
        price: food.price,
        quantity: Number(get('qty').value || 1)
      });
    };

    get('back').onclick = renderCategoryList;

  } catch {
    el.innerHTML = `<p class="text-red-500">Lỗi food detail</p>`;
  }
}

/* ================= COMBO ================= */

async function renderComboList() {
  const el = get('menu-container');

  try {
    const combos = await fetchAPI(`${API}/combos`);

    el.innerHTML = `
      ${backBtn()}
      <div class="space-y-4">
        ${combos.map(c =>
          listItem(c.name, c.description, `$${c.price}`, 'data-id', c.id)
        ).join('')}
      </div>
    `;

    el.querySelectorAll('[data-id]').forEach(item => {
      item.onclick = () => renderComboDetail(item.dataset.id);
    });

    get('back').onclick = renderHome;

  } catch {
    el.innerHTML = `<p class="text-red-500">Lỗi load combo</p>`;
  }
}

/* ================= COMBO DETAIL ================= */

async function renderComboDetail(id) {
  const el = get('menu-container');

  try {
    const combo = await fetchAPI(`${API}/combos/${id}`);

    el.innerHTML = `
      ${backBtn()}

      <div class="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl space-y-4">
        <h2 class="text-3xl font-bold text-white">${combo.name}</h2>

        <p class="text-slate-300">${combo.description || ''}</p>

        <p class="text-2xl font-bold text-primary">$${combo.price}</p>

        <button id="add"
          class="bg-primary text-black px-6 py-3 rounded-xl font-bold 
                 hover:scale-105 transition-all">
          🛒 Thêm combo
        </button>
      </div>
    `;

    get('add').onclick = () => {
      addToCart({
        type: "COMBO",
        itemId: combo.id,
        name: combo.name,
        price: combo.price,
        quantity: 1
      });
    };

    get('back').onclick = renderComboList;

  } catch {
    el.innerHTML = `<p class="text-red-500">Lỗi combo detail</p>`;
  }
}

/* ================= CART ================= */

function addToCart(item) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const idx = cart.findIndex(i =>
    i.type === item.type && i.itemId === item.itemId
  );

  if (idx > -1) cart[idx].quantity += item.quantity;
  else cart.push(item);

  localStorage.setItem('cart', JSON.stringify(cart));

  alert("Đã thêm vào giỏ hàng 🛒");
}