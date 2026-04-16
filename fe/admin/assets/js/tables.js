const tablesState = {
  tables: [],
  query: ''
};

async function initTables() {
  bindTablesEvents();
  window.AdminApp.configureGlobalSearch({
    placeholder: 'Tìm theo tên bàn hoặc mô tả...',
    handler: (value) => {
      tablesState.query = value.toLowerCase();
      renderTables();
    }
  });
  await loadTables();
}

function bindTablesEvents() {
  const addTableButton = document.getElementById('add-table-btn');
  if (addTableButton) {
    addTableButton.addEventListener('click', () => openTableModal());
  }
}

async function loadTables() {
  const grid = document.getElementById('tables-grid');
  if (grid) {
    grid.innerHTML = '<div class="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Đang tải danh sách bàn...</div>';
  }

  try {
    const tables = await window.AdminApp.request('/tables');
    tablesState.tables = Array.isArray(tables) ? tables : [];
    renderTableStats();
    renderTables();
  } catch (error) {
    console.error(error);
    if (grid) {
      grid.innerHTML = `<div class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">${window.AdminApp.escapeHtml(error.message || 'Không thể tải danh sách bàn.')}</div>`;
    }
  }
}

function renderTableStats() {
  const tables = tablesState.tables;
  document.getElementById('tables-total-count').textContent = window.AdminApp.formatNumber(tables.length);
  document.getElementById('tables-available-count').textContent = window.AdminApp.formatNumber(tables.filter((table) => table.status === 'AVAILABLE').length);
  document.getElementById('tables-busy-count').textContent = window.AdminApp.formatNumber(tables.filter((table) => table.status !== 'AVAILABLE').length);
}

function getFilteredTables() {
  return tablesState.tables.filter((table) => {
    const haystack = [table.name, table.description, table.status].join(' ').toLowerCase();
    return !tablesState.query || haystack.includes(tablesState.query);
  });
}

function renderTables() {
  const grid = document.getElementById('tables-grid');
  if (!grid) return;

  const tables = getFilteredTables();
  if (tables.length === 0) {
    grid.innerHTML = '<div class="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Không có bàn phù hợp.</div>';
    return;
  }

  grid.innerHTML = tables.map((table) => {
    const statusClassMap = {
      AVAILABLE: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
      RESERVED: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
      OCCUPIED: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
    };

    return `
      <div class="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
          <div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">${window.AdminApp.escapeHtml(table.name)}</h3>
            <p class="text-sm text-slate-500">${window.AdminApp.escapeHtml(table.description || '--')}</p>
          </div>
          <span class="rounded-full border px-3 py-1 text-xs font-bold ${statusClassMap[table.status] || statusClassMap.AVAILABLE}">
            ${window.AdminApp.escapeHtml(table.status)}
          </span>
        </div>
        <div class="flex-1 px-5 py-6">
          <div class="flex items-center gap-3 text-slate-500">
            <span class="material-symbols-outlined">table_restaurant</span>
            <span class="text-sm">Sức chứa ${window.AdminApp.formatNumber(table.capacity)} khách</span>
          </div>
        </div>
        <div class="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-4 text-sm dark:border-slate-700 dark:bg-slate-900/50">
          <button class="font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300" onclick="openTableModal(${table.id})">Sửa</button>
          <button class="font-bold text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300" onclick="deleteTable(${table.id})">Xóa</button>
        </div>
      </div>
    `;
  }).join('');
}

function openTableModal(tableId = null) {
  const table = tableId ? tablesState.tables.find((item) => item.id === tableId) : null;
  const title = table ? 'Cập nhật bàn' : 'Thêm bàn';

  const content = `
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Tên bàn</label>
      <input type="text" id="table-name" value="${window.AdminApp.escapeHtml(table?.name || '')}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Mô tả</label>
      <textarea id="table-description" rows="4" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900">${window.AdminApp.escapeHtml(table?.description || '')}</textarea>
    </div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Sức chứa</label>
        <input type="number" min="1" id="table-capacity" value="${table?.capacity || ''}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Trạng thái</label>
        <select id="table-status" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900">
          ${['AVAILABLE', 'RESERVED', 'OCCUPIED'].map((status) => `
            <option value="${status}" ${status === (table?.status || 'AVAILABLE') ? 'selected' : ''}>${status}</option>
          `).join('')}
        </select>
      </div>
    </div>
  `;

  const footer = `
    <button class="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700" onclick="closeGlobalModal()">Hủy</button>
    <button class="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-600" onclick="saveTableForm(${table?.id || 'null'})">
      ${table ? 'Lưu thay đổi' : 'Thêm bàn'}
    </button>
  `;

  openGlobalModal(title, content, footer);
}

async function saveTableForm(tableId) {
  const payload = {
    name: document.getElementById('table-name').value.trim(),
    description: document.getElementById('table-description').value.trim(),
    capacity: Number(document.getElementById('table-capacity').value),
    status: document.getElementById('table-status').value
  };

  try {
    if (tableId) {
      await window.AdminApp.request(`/tables/${tableId}`, { method: 'PUT', body: payload });
      window.AdminApp.showToast('Đã cập nhật bàn.');
    } else {
      await window.AdminApp.request('/tables', { method: 'POST', body: payload });
      window.AdminApp.showToast('Đã thêm bàn mới.');
    }

    closeGlobalModal();
    await loadTables();
  } catch (error) {
    window.AdminApp.showToast(error.message || 'Không thể lưu bàn.', 'error');
  }
}

async function deleteTable(tableId) {
  if (!window.AdminApp.confirmAction('Bạn có chắc muốn xóa bàn này?')) {
    return;
  }

  try {
    await window.AdminApp.request(`/tables/${tableId}`, { method: 'DELETE' });
    window.AdminApp.showToast('Đã xóa bàn.');
    await loadTables();
  } catch (error) {
    window.AdminApp.showToast(error.message || 'Không thể xóa bàn.', 'error');
  }
}
