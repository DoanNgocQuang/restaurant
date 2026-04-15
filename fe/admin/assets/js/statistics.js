const API = 'http://localhost:8080/api';

let revenueChart = null;

/* ================= INIT ================= */
function initStatsMonth() {
  renderStatsMonth();
}

/* ================= RENDER MONTH ================= */
async function renderStatsMonth() {
  const tbody = document.getElementById('stats-month-tbody');
  const chartCanvas = document.getElementById('revenueChart');

  if (!tbody || !chartCanvas) return;

  const startEl = document.getElementById('stats-month-start');
  const endEl = document.getElementById('stats-month-end');

  if (!startEl || !endEl) return;

  let start = startEl.value;
  let end = endEl.value;

  /* ===== AUTO DEFAULT ===== */
  if (!end) {
    const now = new Date();
    end = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    endEl.value = end;
  }

  if (!start) {
    const d = new Date(end + "-01T00:00:00");
    d.setMonth(d.getMonth() - 5);
    start = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    startEl.value = start;
  }

  /* ===== VALIDATE ===== */
  if (new Date(start) > new Date(end)) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center p-4 text-red-500">
          Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc
        </td>
      </tr>`;
    return;
  }

  /* ===== BUILD DATE ===== */
  const startDate = `${start}-01T00:00:00`;

  const endObj = new Date(end + "-01T00:00:00");
  endObj.setMonth(endObj.getMonth() + 1);
  endObj.setDate(0);

  const endDate = `${endObj.getFullYear()}-${String(endObj.getMonth() + 1).padStart(2, '0')}-${String(endObj.getDate()).padStart(2, '0')}T23:59:59`;

  const url = `${API}/statistics/revenue/monthly?start=${startDate}&end=${endDate}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.status);

    const json = await res.json();

    const data = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : [];

    /* ===== NO DATA ===== */
    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center p-4 text-gray-500">
            Không có dữ liệu
          </td>
        </tr>`;
      renderChart([]);
      return;
    }

    /* ===== TABLE ===== */
    tbody.innerHTML = data.map(item => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">
          ${item.month ?? '-'}
        </td>
        <td class="px-6 py-4 text-slate-500">
          ${item.totalInvoices ?? 0}
        </td>
        <td class="px-6 py-4 text-slate-500">
          ${item.totalGuests ?? 0}
        </td>
        <td class="px-6 py-4 text-right font-bold text-green-600 dark:text-green-400">
          ${item.totalRevenue ?? 0}
        </td>
      </tr>
    `).join('');

    /* ===== CHART ===== */
    renderChart(data);

  } catch (err) {
    console.error(err);

    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-red-500 p-4 text-center">
          Lỗi tải dữ liệu
        </td>
      </tr>`;
  }
}

/* ================= CHART ================= */
function renderChart(data) {
  const ctx = document.getElementById('revenueChart');

  if (!ctx) return;

  if (revenueChart) {
    revenueChart.destroy();
  }

  if (!data || data.length === 0) return;

  const labels = data.map(i => i.month);
  const revenues = data.map(i => i.totalRevenue);

  revenueChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Doanh thu',
        data: revenues
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        }
      }
    }
  });
}

function initStatsDishes() {
  renderStatsDishes();
}

function renderStatsDishes() {
  const tbody = document.getElementById('stats-dishes-tbody');
  if (tbody) {
    const data = [
      { code: 'D001', category: 'Món chính', name: 'Bò bít tết Wagyu', sales: 450, revenue: '$54,000.00' },
      { code: 'D002', category: 'Hải sản', name: 'Cá hồi áp chảo', sales: 380, revenue: '$32,300.00' },
      { code: 'D003', category: 'Khai vị', name: 'Súp nấm Truffle', sales: 520, revenue: '$23,400.00' }
    ];

    let html = '';
    data.forEach(item => {
      html += `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">${item.code}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${item.category}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">${item.name}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${item.sales}</td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600 dark:text-green-400">${item.revenue}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }
}

function initStatsHours() {
  renderStatsHours();
}

function renderStatsHours() {
  const tbody = document.getElementById('stats-hours-tbody');
  if (tbody) {
    const data = [
      { hour: '18:00 - 19:00', guests: 85, avgRevenue: '$25.00', totalRevenue: '$2,125.00' },
      { hour: '19:00 - 20:00', guests: 120, avgRevenue: '$30.00', totalRevenue: '$3,600.00' },
      { hour: '20:00 - 21:00', guests: 95, avgRevenue: '$28.00', totalRevenue: '$2,660.00' }
    ];

    let html = '';
    data.forEach(item => {
      html += `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">${item.hour}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${item.guests}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${item.avgRevenue}</td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600 dark:text-green-400">${item.totalRevenue}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const view = document.getElementById("view-stats-month");
  if (view) {
    initStatsMonth();
  }
});

window.initStatsMonth = initStatsMonth;
window.initStatsDishes = initStatsDishes;
window.initStatsHours = initStatsHours;