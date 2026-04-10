const API = 'http://localhost:8080/api';

function initStatsMonth() {
  renderStatsMonth();
}

async function renderStatsMonth() {
  const tbody = document.getElementById('stats-month-tbody');
  if (!tbody) return;

  const startEl = document.getElementById('stats-month-start');
  const endEl = document.getElementById('stats-month-end');

  if (!startEl || !endEl) return;

  const start = startEl.value;
  const end = endEl.value;

  if (!start || !end) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center p-4 text-gray-500">
          Vui lòng chọn khoảng thời gian
        </td>
      </tr>`;
    return;
  }

  if (new Date(start) > new Date(end)) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center p-4 text-red-500">
          Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc
        </td>
      </tr>`;
    return;
  }

  const startDate = `${start}-01T00:00:00`;

  const endObj = new Date(end + "-01T00:00:00");
  endObj.setMonth(endObj.getMonth() + 1);
  endObj.setDate(0); // last day of month

  const endDate = `${endObj.getFullYear()}-${String(endObj.getMonth() + 1).padStart(2, '0')}-${String(endObj.getDate()).padStart(2, '0')}T23:59:59`;

  const url = `${API}/statistics/revenue/monthly?start=${startDate}&end=${endDate}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }

    const json = await res.json();

    const data = Array.isArray(json)
      ? json
      : Array.isArray(json?.data)
        ? json.data
        : [];

    if (data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center p-4 text-gray-500">
            Không có dữ liệu
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = data.map(item => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">
          ${item.month ?? '-'}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
          ${item.totalInvoices ?? 0}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
          ${item.totalGuests ?? 0}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600 dark:text-green-400">
          ${item.totalRevenue ?? 0}
        </td>
      </tr>
    `).join('');

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

window.initStatsMonth = initStatsMonth;
window.initStatsDishes = initStatsDishes;
window.initStatsHours = initStatsHours;