function initDashboard() {
  // Initial data
  let currentRevenue = 42500;
  let currentCustomers = 84;
  let currentTables = 12;
  const maxTables = 20;
  let chartData = [40, 60, 30, 80, 50, 90, 70, 85, 65, 95, 75, 88];
  const chartLabels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
  let topDishesData = [
    { name: 'Bò bít tết Wagyu', sales: 124, price: '$120.00', trend: '+12.0%' },
    { name: 'Cá hồi áp chảo', sales: 98, price: '$85.00', trend: '+8.0%' },
    { name: 'Súp nấm Truffle', sales: 85, price: '$45.00', trend: '-2.0%' }
  ];

  function renderBarChart() {
    const barChart = document.getElementById('dashboard-bar-chart');
    if (!barChart) return;
    
    let html = '';
    chartData.forEach((val, index) => {
      const height = Math.min(Math.max(val, 0), 100) + '%';
      html += `
        <div class="flex flex-col items-center gap-2 flex-1 group">
          <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-t-lg relative flex items-end justify-center h-full">
            <div class="w-full bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-lg transition-all duration-500 group-hover:from-rose-500 group-hover:to-rose-300" style="height: ${height}"></div>
            <div class="absolute -top-8 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              $${(val * 100).toLocaleString()}
            </div>
          </div>
          <span class="text-xs font-medium text-slate-500">${chartLabels[index]}</span>
        </div>
      `;
    });
    barChart.innerHTML = html;
  }

  function renderTopDishes() {
    const topDishes = document.getElementById('top-selling-dishes');
    if (!topDishes) return;
    
    let html = '';
    topDishesData.forEach((dish, index) => {
      html += `
        <div class="flex items-center justify-between transition-all duration-300">
          <div class="flex items-center gap-4">
            <div class="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">
              #${index + 1}
            </div>
            <div>
              <p class="font-bold text-sm text-slate-900 dark:text-white">${dish.name}</p>
              <p class="text-xs text-slate-500">${dish.sales} lượt gọi</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold text-sm text-slate-900 dark:text-white">${dish.price}</p>
            <p class="text-xs ${dish.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'} font-medium">${dish.trend}</p>
          </div>
        </div>
      `;
    });
    topDishes.innerHTML = html;
  }

  // Initial renders
  renderBarChart();
  renderTopDishes();

  // Render dashboard history
  const historyTbody = document.getElementById('dashboard-history-tbody');
  if (historyTbody) {
    const history = [
      { time: '10:30 AM, 20/10/2023', user: 'Julian Casablancas', action: 'Cập nhật', target: 'Menu', details: 'Thay đổi giá Bò bít tết Wagyu' },
      { time: '09:15 AM, 20/10/2023', user: 'System', action: 'Tự động', target: 'Báo cáo', details: 'Xuất báo cáo doanh thu ngày' },
      { time: '08:00 AM, 20/10/2023', user: 'Admin', action: 'Đăng nhập', target: 'Hệ thống', details: 'Đăng nhập thành công' },
      { time: '21:45 PM, 19/10/2023', user: 'Staff A', action: 'Thêm mới', target: 'Đặt bàn', details: 'Thêm đặt bàn mới cho Bàn 03' },
      { time: '19:30 PM, 19/10/2023', user: 'Staff B', action: 'Xóa', target: 'Voucher', details: 'Xóa voucher hết hạn SUMMER20' }
    ];
    
    let html = '';
    history.forEach(item => {
      let actionClass = '';
      switch (item.action) {
        case 'Thêm mới': actionClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'; break;
        case 'Cập nhật': actionClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'; break;
        case 'Xóa': actionClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'; break;
        default: actionClass = 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      }

      html += `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${item.time}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">${item.user}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2.5 py-1 rounded-full text-xs font-bold ${actionClass}">${item.action}</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${item.target}</td>
          <td class="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title="${item.details}">${item.details}</td>
        </tr>
      `;
    });
    historyTbody.innerHTML = html;
  }

  // Real-time updates simulation
  if (window.dashboardInterval) {
    clearInterval(window.dashboardInterval);
  }

  window.dashboardInterval = setInterval(() => {
    // Check if we are still on the dashboard
    if (!document.getElementById('monthly-revenue')) {
      clearInterval(window.dashboardInterval);
      return;
    }

    // Update Monthly Revenue
    currentRevenue += Math.floor(Math.random() * 50) - 10; // Fluctuates upwards generally
    document.getElementById('monthly-revenue').innerText = `$${currentRevenue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    // Update Hourly Customers
    currentCustomers += Math.floor(Math.random() * 5) - 2;
    if (currentCustomers < 0) currentCustomers = 0;
    document.getElementById('hourly-customers').innerHTML = `${currentCustomers} <span class="text-sm font-normal text-slate-400">khách/giờ</span>`;

    // Update Active Tables
    if (Math.random() > 0.6) {
      currentTables += Math.floor(Math.random() * 3) - 1;
      if (currentTables < 0) currentTables = 0;
      if (currentTables > maxTables) currentTables = maxTables;
      document.getElementById('active-tables').innerText = `${currentTables} / ${maxTables}`;
    }

    // Update Top Dishes
    if (Math.random() > 0.5) {
      topDishesData[0].sales += Math.floor(Math.random() * 3);
      topDishesData[1].sales += Math.floor(Math.random() * 2);
      topDishesData[2].sales += Math.floor(Math.random() * 2);
      
      // Re-sort and render
      topDishesData.sort((a, b) => b.sales - a.sales);
      renderTopDishes();
    }

    // Update Bar Chart (simulate current month changing)
    if (Math.random() > 0.5) {
      chartData[11] += Math.floor(Math.random() * 5) - 2;
      if (chartData[11] < 0) chartData[11] = 0;
      if (chartData[11] > 100) chartData[11] = 100;
      renderBarChart();
    }

  }, 2500);
}
