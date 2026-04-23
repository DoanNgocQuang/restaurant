import { renderNavbar, renderFooter } from '../components/index.js';

const API = 'http://localhost:8080/api';

function formatCurrencyHome(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // Hero Actions
  const heroActions = document.getElementById('hero-actions');
  if (heroActions) {
    if (isLoggedIn) {
      heroActions.innerHTML = `
        <a href="/pages/reservations.html" class="w-full sm:w-auto">
          <button class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-8 text-white">Đặt chỗ ngay</button>
        </a>
        <a href="/pages/menu.html" class="w-full sm:w-auto">
          <button class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 h-11 px-8">Xem thực đơn</button>
        </a>
      `;
    } else {
      heroActions.innerHTML = `
        <a href="/pages/login.html" class="w-full sm:w-auto">
          <button class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-8 text-white">Đăng nhập để đặt bàn</button>
        </a>
        <a href="/pages/menu.html" class="w-full sm:w-auto">
          <button class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 h-11 px-8">Xem thực đơn</button>
        </a>
      `;
    }
  }

  // CTA Actions
  const ctaActions = document.getElementById('cta-actions');
  if (ctaActions) {
    if (isLoggedIn) {
      ctaActions.innerHTML = `
        <a href="/pages/reservations.html" class="w-full sm:w-auto">
          <button class="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-white text-primary shadow-xl hover:bg-white/90 h-11 px-8">Đặt bàn của bạn</button>
        </a>
        <button class="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-white/30 bg-white/10 text-white hover:bg-white/20 h-11 px-8">Gọi +1 (555) 0123</button>
      `;
    } else {
      ctaActions.innerHTML = `
        <a href="/pages/login.html" class="w-full sm:w-auto">
          <button class="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-white text-primary shadow-xl hover:bg-white/90 h-11 px-8">Đăng nhập để đặt bàn</button>
        </a>
        <button class="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-white/30 bg-white/10 text-white hover:bg-white/20 h-11 px-8">Gọi +1 (555) 0123</button>
      `;
    }
  }

  // Dishes — fetch from API
  const dishesContainer = document.getElementById('dishes-container');
  if (dishesContainer) {
    loadFeaturedDishes(dishesContainer);
  }
});

async function loadFeaturedDishes(container) {
  // Show loading skeleton
  container.innerHTML = Array.from({ length: 6 }, () => `
    <div class="animate-pulse rounded-xl bg-white dark:bg-bg-dark border border-primary/10 overflow-hidden">
      <div class="h-64 bg-slate-200 dark:bg-slate-700"></div>
      <div class="p-6 space-y-3">
        <div class="h-5 w-3/4 rounded bg-slate-200 dark:bg-slate-700"></div>
        <div class="h-4 w-full rounded bg-slate-200 dark:bg-slate-700"></div>
        <div class="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700"></div>
      </div>
    </div>
  `).join('');

  try {
    const response = await fetch(`${API}/foods`);
    const json = await response.json();
    const foods = (json?.data || [])
      .filter(food => food.status === 'AVAILABLE')
      .slice(0, 6);

    if (foods.length === 0) {
      container.innerHTML = '<p class="col-span-full text-center text-slate-500">Hiện chưa có món ăn nào.</p>';
      return;
    }

    container.innerHTML = foods.map(food => `
      <div class="group relative overflow-hidden rounded-xl bg-white dark:bg-bg-dark border border-primary/10 transition-transform duration-300 hover:-translate-y-2">
        <div class="h-64 overflow-hidden">
          <img 
            src="${food.imageUrl || 'https://placehold.co/600x400?text=No+Image'}" 
            alt="${food.name}" 
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerpolicy="no-referrer"
            onerror="this.src='https://placehold.co/600x400?text=No+Image'"
          />
        </div>
        <div class="p-6">
          <div class="flex justify-between items-start mb-2">
            <h4 class="text-xl font-bold">${food.name}</h4>
            <span class="text-primary font-black whitespace-nowrap ml-2">${formatCurrencyHome(food.price)}</span>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">${food.description || ''}</p>
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider">${food.category?.name || ''}</span>
            <a href="/pages/menu.html" class="text-primary text-sm font-bold hover:underline">Xem thêm →</a>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Failed to load featured dishes:', error);
    container.innerHTML = '<p class="col-span-full text-center text-red-500">Không thể tải món ăn. Vui lòng thử lại sau.</p>';
  }
}
