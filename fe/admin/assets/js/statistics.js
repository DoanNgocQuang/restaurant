let revenueChart = null;

function getMonthRangeValues() {
  const startInput = document.getElementById('stats-month-start');
  const endInput = document.getElementById('stats-month-end');
  if (!startInput || !endInput) return null;

  if (!endInput.value) {
    const now = new Date();
    endInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  if (!startInput.value) {
    const endDate = new Date(`${endInput.value}-01T00:00:00`);
    endDate.setMonth(endDate.getMonth() - 5);
    startInput.value = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}`;
  }

  return {
    start: startInput.value,
    end: endInput.value
  };
}

async function initStatsMonth() {
  await renderStatsMonth();
}

async function renderStatsMonth() {
  const tbody = document.getElementById('stats-month-tbody');
  const range = getMonthRangeValues();
  if (!tbody || !range) return;

  if (new Date(`${range.start}-01T00:00:00`) > new Date(`${range.end}-01T00:00:00`)) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(4, 'Tháng bắt đầu phải nhỏ hơn hoặc bằng tháng kết thúc.', 'error');
    return;
  }

  const startDate = `${range.start}-01T00:00:00`;
  const endDateObject = new Date(`${range.end}-01T00:00:00`);
  endDateObject.setMonth(endDateObject.getMonth() + 1);
  endDateObject.setDate(0);
  const endDate = `${endDateObject.getFullYear()}-${String(endDateObject.getMonth() + 1).padStart(2, '0')}-${String(endDateObject.getDate()).padStart(2, '0')}T23:59:59`;

  try {
    const data = await window.AdminApp.request(`/statistics/revenue/monthly?start=${encodeURIComponent(startDate)}&end=${encodeURIComponent(endDate)}`);
    const rows = Array.isArray(data) ? data : [];

    if (rows.length === 0) {
      tbody.innerHTML = window.AdminApp.renderTableMessage(4, 'Không có dữ liệu doanh thu trong khoảng thời gian này.');
      renderRevenueChart([]);
      return;
    }

    tbody.innerHTML = rows.map((item) => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <td class="px-6 py-4 font-bold text-slate-900 dark:text-white">${window.AdminApp.escapeHtml(item.month || '--')}</td>
        <td class="px-6 py-4 text-slate-500">${window.AdminApp.formatNumber(item.totalInvoices)}</td>
        <td class="px-6 py-4 text-slate-500">${window.AdminApp.formatNumber(item.totalGuests)}</td>
        <td class="px-6 py-4 text-right font-bold text-green-600 dark:text-green-400">${window.AdminApp.formatCurrency(item.totalRevenue)}</td>
      </tr>
    `).join('');

    renderRevenueChart(rows);
  } catch (error) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(4, error.message || 'Không thể tải dữ liệu doanh thu.', 'error');
  }
}

function renderRevenueChart(data) {
  const canvas = document.getElementById('revenueChart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (revenueChart) {
    revenueChart.destroy();
  }

  if (!data || data.length === 0) {
    return;
  }

  revenueChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: data.map((item) => item.month),
      datasets: [
        {
          label: 'Doanh thu',
          data: data.map((item) => Number(item.totalRevenue || 0)),
          backgroundColor: '#800020'
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

async function initStatsDishes() {
  await renderStatsDishes();
}

async function renderStatsDishes() {
  const tbody = document.getElementById('stats-dishes-tbody');
  if (!tbody) return;

  try {
    const foods = await window.AdminApp.request('/foods');
    const items = Array.isArray(foods) ? foods : [];

    document.getElementById('stats-dishes-total').textContent = window.AdminApp.formatNumber(items.length);
    document.getElementById('stats-dishes-available').textContent = window.AdminApp.formatNumber(items.filter((item) => item.status === 'AVAILABLE').length);
    document.getElementById('stats-dishes-unavailable').textContent = window.AdminApp.formatNumber(items.filter((item) => item.status !== 'AVAILABLE').length);

    if (items.length === 0) {
      tbody.innerHTML = window.AdminApp.renderTableMessage(5, 'Chưa có món ăn để thống kê.');
      return;
    }

    const grouped = items.reduce((accumulator, item) => {
      const categoryName = item.category?.name || 'Chưa phân loại';
      if (!accumulator[categoryName]) {
        accumulator[categoryName] = {
          total: 0,
          available: 0,
          outOfStock: 0,
          sumPrice: 0
        };
      }

      accumulator[categoryName].total += 1;
      accumulator[categoryName].sumPrice += Number(item.price || 0);
      if (item.status === 'AVAILABLE') {
        accumulator[categoryName].available += 1;
      }
      if (item.status === 'OUT_OF_STOCK') {
        accumulator[categoryName].outOfStock += 1;
      }

      return accumulator;
    }, {});

    tbody.innerHTML = Object.entries(grouped).map(([categoryName, item]) => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">${window.AdminApp.escapeHtml(categoryName)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.formatNumber(item.total)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.formatNumber(item.available)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.formatNumber(item.outOfStock)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600 dark:text-green-400">${window.AdminApp.formatCurrency(item.sumPrice / item.total)}</td>
      </tr>
    `).join('');
  } catch (error) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(5, error.message || 'Không thể tải tổng quan thực đơn.', 'error');
  }
}

async function initStatsHours() {
  await renderStatsHours();
}

async function renderStatsHours() {
  const tbody = document.getElementById('stats-hours-tbody');
  if (!tbody) return;

  try {
    const bookings = await window.AdminApp.request('/bookings');
    const items = Array.isArray(bookings) ? bookings : [];
    if (items.length === 0) {
      tbody.innerHTML = window.AdminApp.renderTableMessage(4, 'Chưa có booking để thống kê.');
      return;
    }

    const grouped = items.reduce((accumulator, booking) => {
      const bookingDate = new Date(booking.bookingTime);
      const hourLabel = Number.isNaN(bookingDate.getTime())
        ? 'Không xác định'
        : `${String(bookingDate.getHours()).padStart(2, '0')}:00 - ${String((bookingDate.getHours() + 1) % 24).padStart(2, '0')}:00`;

      if (!accumulator[hourLabel]) {
        accumulator[hourLabel] = {
          bookings: 0,
          guests: 0
        };
      }

      accumulator[hourLabel].bookings += 1;
      accumulator[hourLabel].guests += Number(booking.guestCount || 0);
      return accumulator;
    }, {});

    tbody.innerHTML = Object.entries(grouped)
      .sort(([first], [second]) => first.localeCompare(second))
      .map(([hour, item]) => `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">${window.AdminApp.escapeHtml(hour)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.formatNumber(item.bookings)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.formatNumber(item.guests)}</td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600 dark:text-green-400">${(item.guests / item.bookings).toFixed(1)}</td>
        </tr>
      `).join('');
  } catch (error) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(4, error.message || 'Không thể tải thống kê khung giờ.', 'error');
  }
}

window.initStatsMonth = initStatsMonth;
window.initStatsDishes = initStatsDishes;
window.initStatsHours = initStatsHours;
