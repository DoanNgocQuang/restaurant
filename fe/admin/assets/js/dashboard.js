let dashboardChartInstance = null;

async function initDashboard() {
  try {
    const dateRange = getDashboardRange();
    const query = `/statistics/revenue/monthly?start=${encodeURIComponent(dateRange.start)}&end=${encodeURIComponent(dateRange.end)}`;

    const [foods, users, tables, bookings, logs, revenues] = await Promise.all([
      window.AdminApp.request('/foods'),
      window.AdminApp.request('/users'),
      window.AdminApp.request('/tables'),
      window.AdminApp.request('/bookings'),
      window.AdminApp.request('/system-logs?page=0&size=5&sort=loggedAt,desc'),
      window.AdminApp.request(query)
    ]);

    renderDashboardSummary({
      foods: Array.isArray(foods) ? foods : [],
      users: Array.isArray(users) ? users : [],
      tables: Array.isArray(tables) ? tables : [],
      bookings: Array.isArray(bookings) ? bookings : [],
      logs: logs?.content || [],
      revenues: Array.isArray(revenues) ? revenues : []
    });
  } catch (error) {
    console.error(error);
    const tbody = document.getElementById('dashboard-history-tbody');
    if (tbody) {
      tbody.innerHTML = window.AdminApp.renderTableMessage(4, error.message || 'Không thể tải dashboard.', 'error');
    }
  }
}

function getDashboardRange() {
  const end = new Date();
  const start = new Date(end.getFullYear(), end.getMonth() - 5, 1);
  const endDate = new Date(end.getFullYear(), end.getMonth() + 1, 0, 23, 59, 59);

  return {
    start: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-01T00:00:00`,
    end: `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}T23:59:59`
  };
}

function renderDashboardSummary({ foods, users, tables, bookings, logs, revenues }) {
  const totalRevenue = revenues.reduce((sum, item) => sum + Number(item.totalRevenue || 0), 0);
  const activeUsers = users.filter((user) => user.isActive).length;
  const activeBookings = bookings.filter((booking) => ['PENDING', 'CONFIRMED'].includes(booking.status)).length;
  const availableTables = tables.filter((table) => table.status === 'AVAILABLE').length;

  document.getElementById('dashboard-revenue').textContent = window.AdminApp.formatCurrency(totalRevenue);
  document.getElementById('dashboard-users').textContent = window.AdminApp.formatNumber(activeUsers);
  document.getElementById('dashboard-bookings').textContent = window.AdminApp.formatNumber(activeBookings);
  document.getElementById('dashboard-tables').textContent = window.AdminApp.formatNumber(availableTables);

  renderDashboardMenuSummary(foods);
  renderDashboardHistory(logs);
  renderDashboardRevenueChart(revenues);
}

function renderDashboardMenuSummary(foods) {
  const container = document.getElementById('dashboard-menu-summary');
  if (!container) return;

  if (foods.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-500">Chưa có món ăn để thống kê.</p>';
    return;
  }

  const grouped = foods.reduce((accumulator, food) => {
    const categoryName = food.category?.name || 'Chưa phân loại';
    if (!accumulator[categoryName]) {
      accumulator[categoryName] = {
        total: 0,
        available: 0,
        averagePrice: 0,
        sumPrice: 0
      };
    }

    accumulator[categoryName].total += 1;
    accumulator[categoryName].sumPrice += Number(food.price || 0);
    if (food.status === 'AVAILABLE') {
      accumulator[categoryName].available += 1;
    }

    return accumulator;
  }, {});

  container.innerHTML = Object.entries(grouped).map(([name, item]) => {
    const averagePrice = item.total > 0 ? item.sumPrice / item.total : 0;
    return `
      <div class="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4 dark:border-slate-700 dark:bg-slate-900/50">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h5 class="font-bold text-slate-900 dark:text-white">${window.AdminApp.escapeHtml(name)}</h5>
            <p class="mt-1 text-sm text-slate-500">${item.available}/${item.total} món đang phục vụ</p>
          </div>
          <span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">${window.AdminApp.formatCurrency(averagePrice)}</span>
        </div>
      </div>
    `;
  }).join('');
}

function renderDashboardHistory(logs) {
  const tbody = document.getElementById('dashboard-history-tbody');
  if (!tbody) return;

  if (!logs || logs.length === 0) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(4, 'Chưa có log hệ thống.');
    return;
  }

  tbody.innerHTML = logs.map((log) => `
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.formatDateTime(log.loggedAt)}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">${window.AdminApp.escapeHtml(log.userEmail || 'System')}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.escapeHtml(log.action || 'OTHER')}</td>
      <td class="px-6 py-4 text-sm text-slate-500">${window.AdminApp.escapeHtml(log.detail || '--')}</td>
    </tr>
  `).join('');
}

function renderDashboardRevenueChart(revenues) {
  const canvas = document.getElementById('dashboard-revenue-chart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (dashboardChartInstance) {
    dashboardChartInstance.destroy();
  }

  const labels = revenues.map((item) => item.month);
  const values = revenues.map((item) => Number(item.totalRevenue || 0));

  dashboardChartInstance = new Chart(canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Doanh thu',
          data: values,
          borderColor: '#800020',
          backgroundColor: 'rgba(128, 0, 32, 0.14)',
          fill: true,
          tension: 0.35
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          ticks: {
            callback(value) {
              return window.AdminApp.formatCurrency(value);
            }
          }
        }
      }
    }
  });
}
