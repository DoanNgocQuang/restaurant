function initSystemLog() {
  renderHistory();
}

function renderHistory() {
  const tbody = document.getElementById('history-tbody');
  if (tbody) {
    const data = [
      { time: '10:30 AM, 20/10/2023', user: 'Julian Casablancas', action: 'Cập nhật', target: 'Menu', details: 'Thay đổi giá Bò bít tết Wagyu' },
      { time: '09:15 AM, 20/10/2023', user: 'System', action: 'Tự động', target: 'Báo cáo', details: 'Xuất báo cáo doanh thu ngày' },
      { time: '08:00 AM, 20/10/2023', user: 'Admin', action: 'Đăng nhập', target: 'Hệ thống', details: 'Đăng nhập thành công' },
      { time: '21:45 PM, 19/10/2023', user: 'Staff A', action: 'Thêm mới', target: 'Đặt bàn', details: 'Thêm đặt bàn mới cho Bàn 03' },
      { time: '19:30 PM, 19/10/2023', user: 'Staff B', action: 'Xóa', target: 'Voucher', details: 'Xóa voucher hết hạn SUMMER20' }
    ];

    let html = '';
    data.forEach(item => {
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
    tbody.innerHTML = html;
  }
}
