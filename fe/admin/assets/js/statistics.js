function initStatsMonth() {
  renderStatsMonth();
}

function renderStatsMonth() {
  const tbody = document.getElementById('stats-month-tbody');
  if (tbody) {
    const data = [
      { month: '10/2023', orders: 1245, guests: 3500, revenue: '$42,500.00' },
      { month: '09/2023', orders: 1100, guests: 3100, revenue: '$38,200.00' },
      { month: '08/2023', orders: 1350, guests: 3800, revenue: '$45,800.00' }
    ];

    let html = '';
    data.forEach(item => {
      html += `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">${item.month}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${item.orders}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${item.guests}</td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600 dark:text-green-400">${item.revenue}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
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
