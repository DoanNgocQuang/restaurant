function initTables() {
  const tablesGrid = document.getElementById('tables-grid');
  if (tablesGrid) {
    const tables = [
      { id: 1, name: 'Bàn 01', capacity: 4, status: 'Trống' },
      { id: 2, name: 'Bàn 02', capacity: 2, status: 'Đang phục vụ' },
      { id: 3, name: 'Bàn 03', capacity: 6, status: 'Đã đặt' },
      { id: 4, name: 'Bàn 04', capacity: 4, status: 'Trống' },
      { id: 5, name: 'Bàn VIP 1', capacity: 8, status: 'Đang phục vụ' }
    ];

    let html = '';
    tables.forEach(table => {
      let statusClass = '';
      let icon = '';
      switch (table.status) {
        case 'Trống':
          statusClass = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
          icon = 'check_circle';
          break;
        case 'Đang phục vụ':
          statusClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
          icon = 'restaurant';
          break;
        case 'Đã đặt':
          statusClass = 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
          icon = 'event_seat';
          break;
      }

      html += `
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md">
          <div class="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between ${statusClass.split(' ')[0]} dark:bg-opacity-10">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-xl ${statusClass.split(' ')[1]}">${icon}</span>
              <h3 class="font-bold text-slate-900 dark:text-white">${table.name}</h3>
            </div>
            <span class="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${statusClass} border">${table.status}</span>
          </div>
          <div class="p-4 flex-1 flex flex-col justify-center items-center gap-2">
            <span class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">table_restaurant</span>
            <p class="text-sm text-slate-500 font-medium">${table.capacity} người</p>
          </div>
          <div class="p-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
            <button class="text-xs font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300" onclick="openEditTableModal(${table.id})">Sửa bàn</button>
            <button class="text-xs font-bold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" onclick="deleteTable(${table.id})">Xóa</button>
          </div>
        </div>
      `;
    });
    tablesGrid.innerHTML = html;
  }
}

const originalOpenModalTables = window.openModal;
window.openModal = function(modalId) {
  if (modalId === 'modal-add-table') {
    const content = `
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên bàn</label>
        <input type="text" id="add-table-name" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sức chứa</label>
        <input type="number" id="add-table-capacity" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Trạng thái</label>
        <select id="add-table-status" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="Trống">Trống</option>
          <option value="Đang phục vụ">Đang phục vụ</option>
          <option value="Đã đặt">Đã đặt</option>
        </select>
      </div>
    `;
    const footer = `
      <button class="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors" onclick="closeGlobalModal()">Hủy</button>
      <button class="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-rose-600 rounded-xl transition-colors" onclick="saveAddTable()">Thêm bàn</button>
    `;
    openGlobalModal('Thêm bàn', content, footer);
  } else if (originalOpenModalTables) {
    originalOpenModalTables(modalId);
  }
};

function openEditTableModal(id) {
  const content = `
    <input type="hidden" id="edit-table-id" value="${id}">
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên bàn</label>
      <input type="text" id="edit-table-name" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sức chứa</label>
      <input type="text" id="edit-table-capacity" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Trạng thái</label>
      <select id="edit-table-status" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
        <option value="Trống">Trống</option>
        <option value="Đang phục vụ">Đang phục vụ</option>
        <option value="Đã đặt">Đã đặt</option>
      </select>
    </div>
  `;
  const footer = `
    <button class="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors" onclick="closeGlobalModal()">Hủy</button>
    <button class="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-rose-600 rounded-xl transition-colors" onclick="saveEditTable()">Lưu thay đổi</button>
  `;
  openGlobalModal('Sửa bàn', content, footer);
}

function saveAddTable() {
  closeGlobalModal();
}

function saveEditTable() {
  closeGlobalModal();
}

function deleteTable(id) {
  if(confirm('Bạn có chắc chắn muốn xóa bàn này?')) {
    // delete
  }
}
