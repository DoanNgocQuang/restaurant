const routes = {
  '#dashboard': { url: './pages/dashboard/dashboard.html', init: initDashboard },
  '#dishes': { url: './pages/foods/foods.html', init: initFoods },
  '#customers': { url: './pages/customers/customers.html', init: initCustomers },
  '#tables': { url: './pages/tables/tables.html', init: initTables },
  '#reservations': { url: './pages/reservations/reservations.html', init: initReservations },
  '#vouchers': { url: './pages/vouchers/vouchers.html', init: initVouchers },
  '#stats-month': { url: './pages/statistics/revenue.html', init: window.initStatsMonth },
  '#stats-dishes': { url: './pages/statistics/best-selling.html', init: window.initStatsDishes },
  '#stats-hours': { url: './pages/statistics/customers-by-hour.html', init: window.initStatsHours },
  '#history': { url: './pages/system-log/system-log.html', init: window.initSystemLog }
};

document.addEventListener('DOMContentLoaded', async () => {
  if (!window.AdminApp?.requireAdmin()) {
    return;
  }

  await loadComponent('sidebar-container', './components/sidebar.html');
  await loadComponent('navbar-container', './components/navbar.html');
  await loadComponent('modal-container', './components/modal.html');

  window.AdminApp.hydrateShell();
  initSidebar();

  const hash = routes[window.location.hash] ? window.location.hash : '#dashboard';
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  } else {
    handleRoute(hash);
  }

  window.addEventListener('hashchange', () => {
    handleRoute(window.location.hash || '#dashboard');
  });
});

async function loadComponent(containerId, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();
    document.getElementById(containerId).innerHTML = html;
  } catch (error) {
    console.error(`Error loading component ${url}:`, error);
    const container = document.getElementById(containerId);
    if (container) {
      container.innerHTML = `<div class="p-6 text-sm text-rose-500">Không thể tải thành phần giao diện.</div>`;
    }
  }
}

async function handleRoute(hash) {
  const route = routes[hash];
  if (!route) return;

  const appContent = document.getElementById('app-content');
  window.AdminApp.clearGlobalSearch();

  try {
    const response = await fetch(route.url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();
    appContent.innerHTML = html;
    appContent.classList.remove('hidden');
    appContent.classList.add('flex', 'flex-col');

    updateActiveNav(hash);
    toggleSearchVisibility(hash);

    if (typeof route.init === 'function') {
      await route.init();
    }
  } catch (error) {
    console.error(`Error loading page ${route.url}:`, error);
    appContent.classList.remove('hidden');
    appContent.classList.add('flex', 'flex-col');
    appContent.innerHTML = `
      <div class="p-8">
        <div class="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          Không thể tải trang quản trị. Vui lòng thử lại.
        </div>
      </div>
    `;
  }
}

function toggleSearchVisibility(hash) {
  const searchContainer = document.getElementById('global-search-container');
  if (!searchContainer) return;

  const managementRoutes = ['#dishes', '#customers', '#tables', '#reservations', '#vouchers', '#history'];
  if (managementRoutes.includes(hash)) {
    searchContainer.style.opacity = '1';
    searchContainer.style.pointerEvents = 'auto';
  } else {
    searchContainer.style.opacity = '0';
    searchContainer.style.pointerEvents = 'none';
  }
}

function updateActiveNav(hash) {
  const activeClass = 'nav-item flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-rose-600 to-primary text-white rounded-xl shadow-md shadow-rose-900/20 transition-all';
  const inactiveClass = 'nav-item flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all group';
  const subActiveClasses = 'flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-white bg-slate-800 rounded-lg transition-all';
  const subInactiveClasses = 'flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all';

  document.querySelectorAll('.nav-item, #stats-sub-menu a').forEach((element) => {
    const targetHash = `#${element.id.replace('nav-', '')}`;

    if (targetHash.startsWith('#stats-')) {
      element.className = targetHash === hash ? subActiveClasses : subInactiveClasses;
      return;
    }

    element.className = targetHash === hash ? activeClass : inactiveClass;
    const icon = element.querySelector('span');
    if (icon) {
      if (targetHash === hash) {
        icon.classList.remove('group-hover:text-rose-400', 'transition-colors');
      } else {
        icon.classList.add('group-hover:text-rose-400', 'transition-colors');
      }
    }
  });

  const statsSubMenu = document.getElementById('stats-sub-menu');
  const statsMenuIcon = document.getElementById('stats-menu-icon');
  if (statsSubMenu && statsMenuIcon) {
    const isStatsRoute = hash.startsWith('#stats-');
    statsSubMenu.classList.toggle('hidden', !isStatsRoute);
    statsMenuIcon.style.transform = isStatsRoute ? 'rotate(180deg)' : 'rotate(0deg)';
  }
}
