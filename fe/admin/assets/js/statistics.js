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

let dishesChartInstance = null;

async function initStatsDishes() {
  const monthInput = document.getElementById('stats-dishes-month');
  if (monthInput && !monthInput.value) {
    const now = new Date();
    monthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  if (monthInput && !monthInput.dataset.bound) {
    monthInput.dataset.bound = 'true';
    monthInput.addEventListener('change', () => {
      renderStatsDishes();
    });
  }

  await renderStatsDishes();
}

async function renderStatsDishes() {
  const tbody = document.getElementById('stats-dishes-tbody');
  const monthInput = document.getElementById('stats-dishes-month');
  if (!tbody || !monthInput) return;

  const value = monthInput.value;
  if(!value) return;
  
  const [year, month] = value.split('-');

  try {
    const foods = await window.AdminApp.request(`/orders/top-foods?month=${month}&year=${year}`);
    const items = Array.isArray(foods) ? foods : [];

    if (items.length === 0) {
      tbody.innerHTML = window.AdminApp.renderTableMessage(4, 'Chưa có món ăn nào được bán trong tháng này.');
      renderDishesChart([]);
      return;
    }

    tbody.innerHTML = items.map((item, index) => {
        let rankHtml = `<span class="bg-slate-100 text-slate-500 font-bold px-2.5 py-1 rounded-md text-xs">#${index + 1}</span>`;
        if (index === 0) rankHtml = `<span class="bg-yellow-100 text-yellow-600 font-bold px-2.5 py-1 rounded-md text-xs">#1</span>`;
        if (index === 1) rankHtml = `<span class="bg-slate-200 text-slate-700 font-bold px-2.5 py-1 rounded-md text-xs">#2</span>`;
        if (index === 2) rankHtml = `<span class="bg-orange-100 text-orange-600 font-bold px-2.5 py-1 rounded-md text-xs">#3</span>`;

        return `
          <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td class="px-5 py-4 whitespace-nowrap">${rankHtml}</td>
            <td class="px-5 py-4 text-sm font-bold text-slate-900 dark:text-white capitalize">${window.AdminApp.escapeHtml(item.foodName)}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-emerald-600 font-black text-right">${window.AdminApp.formatNumber(item.totalSold)}</td>
            <td class="px-5 py-4 whitespace-nowrap text-sm text-primary font-bold text-right">${window.AdminApp.formatCurrency(item.totalRevenue)}</td>
          </tr>
        `;
    }).join('');

    renderDishesChart(items);
  } catch (error) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(4, error.message || 'Không thể tải thống kê món ăn bán chạy.', 'error');
  }
}

function renderDishesChart(data) {
  const canvas = document.getElementById('dishesChart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (dishesChartInstance) {
    dishesChartInstance.destroy();
  }

  if (!data || data.length === 0) {
    return;
  }

  const chartData = data.slice(0, 10);

  dishesChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: chartData.map((item) => window.AdminApp.escapeHtml(item.foodName).substring(0, 20)),
      datasets: [
        {
          label: 'Số suất đã bán',
          data: chartData.map((item) => Number(item.totalSold)),
          backgroundColor: 'rgba(128, 0, 32, 0.85)',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

let hoursChartInstance = null;

async function initStatsHours() {
  const monthInput = document.getElementById('stats-hours-month');
  if (monthInput && !monthInput.value) {
    const now = new Date();
    monthInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }

  if (monthInput && !monthInput.dataset.bound) {
    monthInput.dataset.bound = 'true';
    monthInput.addEventListener('change', () => {
      renderStatsHours();
    });
  }

  await renderStatsHours();
}

async function renderStatsHours() {
  const tbody = document.getElementById('stats-hours-tbody');
  if (!tbody) return;

  const monthInput = document.getElementById('stats-hours-month');
  const filterMonth = monthInput ? monthInput.value : null;

  if (!filterMonth) return;

  const [year, month] = filterMonth.split('-').map(Number);

  try {
    const data = await window.AdminApp.request(`/statistics/bookings/by-hour?month=${month}&year=${year}`);
    const items = Array.isArray(data) ? data : [];

    if (items.length === 0) {
      tbody.innerHTML = window.AdminApp.renderTableMessage(4, 'Chưa có booking để thống kê trong khoảng thời gian này.');
      renderHoursChart([]);
      return;
    }

    // Find peak hour
    let peakHour = '';
    let peakGuests = 0;
    items.forEach((item) => {
      if (item.totalGuests > peakGuests) {
        peakGuests = item.totalGuests;
        peakHour = item.hourLabel;
      }
    });

    tbody.innerHTML = items
      .map((item) => {
        const isPeak = item.hourLabel === peakHour;
        const rowHighlight = isPeak ? 'bg-amber-50 dark:bg-amber-900/10' : '';
        const peakBadge = isPeak ? ' <span class="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"><span class="material-symbols-outlined text-xs">local_fire_department</span>Cao điểm</span>' : '';

        return `
          <tr class="${rowHighlight} hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">${window.AdminApp.escapeHtml(item.hourLabel)}${peakBadge}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.formatNumber(item.totalBookings)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.formatNumber(item.totalGuests)}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600 dark:text-green-400">${item.avgGuestsPerBooking}</td>
          </tr>
        `;
      }).join('');

    // Convert to sortedEntries format for chart compatibility
    const sortedEntries = items.map((item) => [item.hourLabel, { hour: item.hour, bookings: item.totalBookings, guests: item.totalGuests }]);
    renderHoursChart(sortedEntries);
  } catch (error) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(4, error.message || 'Không thể tải thống kê khung giờ.', 'error');
    renderHoursChart([]);
  }
}


function renderHoursChart(sortedEntries) {
  const canvas = document.getElementById('hoursChart');
  if (!canvas || typeof Chart === 'undefined') return;

  if (hoursChartInstance) {
    hoursChartInstance.destroy();
    hoursChartInstance = null;
  }

  if (!sortedEntries || sortedEntries.length === 0) return;

  const labels = sortedEntries.map(([hour]) => hour.split(' - ')[0]);
  const guestsData = sortedEntries.map(([, item]) => item.guests);
  const bookingsData = sortedEntries.map(([, item]) => item.bookings);

  hoursChartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Số khách',
          data: guestsData,
          backgroundColor: 'rgba(128, 0, 32, 0.85)',
          borderRadius: 6,
          order: 1
        },
        {
          label: 'Số booking',
          data: bookingsData,
          type: 'line',
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#3b82f6',
          pointRadius: 5,
          pointHoverRadius: 7,
          borderWidth: 2,
          order: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20
          }
        },
        tooltip: {
          callbacks: {
            title(items) {
              const idx = items[0].dataIndex;
              return sortedEntries[idx][0];
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          },
          title: {
            display: true,
            text: 'Số lượng'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Khung giờ'
          }
        }
      }
    }
  });
}

window.initStatsMonth = initStatsMonth;
window.initStatsDishes = initStatsDishes;
window.initStatsHours = initStatsHours;
window.renderStatsMonth = renderStatsMonth;
window.renderStatsHours = renderStatsHours;
