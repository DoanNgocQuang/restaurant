function initReservations() {
  const reservationsTbody = document.getElementById('reservations-tbody');
  if (reservationsTbody) {
    const reservations = [
      { id: 1, customer: 'Nguyễn Văn A', phone: '0901234567', table: 'Bàn 03', time: '19:00, 20/10/2023', guests: 4, status: 'Chờ xác nhận' },
      { id: 2, customer: 'Trần Thị B', phone: '0987654321', table: 'Bàn VIP 1', time: '20:00, 20/10/2023', guests: 8, status: 'Đã xác nhận' },
      { id: 3, customer: 'Lê Văn C', phone: '0912345678', table: 'Bàn 02', time: '18:30, 20/10/2023', guests: 2, status: 'Đã hủy' }
    ];

    let html = '';
    reservations.forEach(res => {
      let statusClass = '';
      switch (res.status) {
        case 'Chờ xác nhận': statusClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'; break;
        case 'Đã xác nhận': statusClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'; break;
        case 'Đã hủy': statusClass = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'; break;
      }

      html += `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="font-bold text-sm text-slate-900 dark:text-white">${res.customer}</div>
            <div class="text-xs text-slate-500">${res.phone}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">${res.table}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${res.time}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${res.guests} người</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2.5 py-1 rounded-full text-xs font-bold ${statusClass}">${res.status}</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3" onclick="updateReservationStatus(${res.id})">Cập nhật</button>
            <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onclick="cancelReservation(${res.id})">Hủy</button>
          </td>
        </tr>
      `;
    });
    reservationsTbody.innerHTML = html;
  }
}

const originalOpenModalRes = window.openModal;
window.openModal = function(modalId) {
  if (modalId === 'modal-add-reservation') {
    const content = `
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Khách hàng</label>
        <input type="text" id="add-res-customer" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Tên khách hàng">
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Số điện thoại</label>
        <input type="text" id="add-res-phone" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bàn</label>
        <select id="add-res-table" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="1">Bàn 01</option>
          <option value="2">Bàn 02</option>
          <option value="3">Bàn 03</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Thời gian</label>
        <input type="datetime-local" id="add-res-time" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Số khách</label>
        <input type="number" id="add-res-guests" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
      </div>
    `;
    const footer = `
      <button class="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors" onclick="closeGlobalModal()">Hủy</button>
      <button class="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-rose-600 rounded-xl transition-colors" onclick="saveAddReservation()">Đặt bàn</button>
    `;
    openGlobalModal('Thêm đặt bàn', content, footer);
  } else if (originalOpenModalRes) {
    originalOpenModalRes(modalId);
  }
};

function populateReservationTables() {
  // Logic to populate tables in the select element
}

function saveAddReservation() {
  closeGlobalModal();
}

function updateReservationStatus(id) {
  // Logic to update status
}

function cancelReservation(id) {
  if(confirm('Bạn có chắc chắn muốn hủy đặt bàn này?')) {
    // delete
  }
}
