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
  await loadComponent('sidebar-container', './components/sidebar.html');
  await loadComponent('navbar-container', './components/navbar.html');
  await loadComponent('modal-container', './components/modal.html');

  initSidebar();

  const hash = window.location.hash || '#dashboard';
  handleRoute(hash);

  window.addEventListener('hashchange', () => {
    handleRoute(window.location.hash);
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
  }
}

async function handleRoute(hash) {
  const route = routes[hash];
  if (!route) return;

  const appContent = document.getElementById('app-content');
  
  try {
    const response = await fetch(route.url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();
    appContent.innerHTML = html;
    appContent.classList.remove('hidden');
    appContent.classList.add('flex', 'flex-col'); // Ensure it takes full height

    // Update active nav item
    updateActiveNav(hash);

    // Toggle search bar visibility
    const searchContainer = document.getElementById('global-search-container');
    if (searchContainer) {
      const managementRoutes = ['#dishes', '#customers', '#tables', '#reservations', '#vouchers'];
      if (managementRoutes.includes(hash)) {
        searchContainer.style.opacity = '1';
        searchContainer.style.pointerEvents = 'auto';
      } else {
        searchContainer.style.opacity = '0';
        searchContainer.style.pointerEvents = 'none';
      }
    }

    // Initialize page specific JS
    if (route.init) {
      route.init();
    }
  } catch (error) {
    console.error(`Error loading page ${route.url}:`, error);
    appContent.innerHTML = `<div class="p-8 text-red-500">Error loading page.</div>`;
  }
}

function updateActiveNav(hash) {
  const activeClass = "nav-item flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-rose-600 to-primary text-white rounded-xl shadow-md shadow-rose-900/20 transition-all";
  const inactiveClass = "nav-item flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl transition-all group";
  const subActiveClasses = "flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-white bg-slate-800 rounded-lg transition-all";
  const subInactiveClasses = "flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all";

  document.querySelectorAll('.nav-item, #stats-sub-menu a').forEach(el => {
    const id = el.id;
    const targetHash = '#' + id.replace('nav-', '');
    
    if (targetHash.startsWith('#stats-')) {
      el.className = targetHash === hash ? subActiveClasses : subInactiveClasses;
    } else {
      el.className = targetHash === hash ? activeClass : inactiveClass;
      const span = el.querySelector('span');
      if (span) {
        if (targetHash === hash) {
          span.classList.remove('group-hover:text-rose-400', 'transition-colors');
        } else {
          span.classList.add('group-hover:text-rose-400', 'transition-colors');
        }
      }
    }
  });
}
