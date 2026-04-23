const combosState = {
  combos: [],
  foods: [],
  query: '',
  page: 1,
  pageSize: 10
};

async function initCombos() {
  combosState.query = '';
  combosState.page = 1;
  bindComboEvents();
  window.AdminApp.configureGlobalSearch({
    placeholder: 'Tìm theo tên combo...',
    value: '',
    handler: (value) => {
      combosState.query = value.toLowerCase();
      combosState.page = 1;
      renderCombosTable();
    }
  });
  await loadCombosData();
}

function bindComboEvents() {
  const addButton = document.getElementById('add-combo-btn');
  if (addButton) {
    addButton.addEventListener('click', () => openComboModal());
  }
}

async function loadCombosData() {
  const tbody = document.getElementById('combos-tbody');
  if (tbody) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(6, 'Đang tải combo...');
  }

  try {
    const [combos, foods] = await Promise.all([
      window.AdminApp.request('/combos'),
      window.AdminApp.request('/foods')
    ]);

    combosState.combos = Array.isArray(combos) ? combos : [];
    combosState.foods = Array.isArray(foods) ? foods : [];
    renderCombosTable();
  } catch (error) {
    console.error(error);
    if (tbody) {
      tbody.innerHTML = window.AdminApp.renderTableMessage(6, error.message || 'Không thể tải combo.', 'error');
    }
  }
}

function getFilteredCombos() {
  return combosState.combos.filter((combo) => {
    const haystack = [combo.name, combo.description, combo.status].join(' ').toLowerCase();
    return !combosState.query || haystack.includes(combosState.query);
  });
}

function renderCombosTable() {
  const tbody = document.getElementById('combos-tbody');
  const pagination = document.getElementById('combos-pagination');
  if (!tbody) return;

  const combos = getFilteredCombos();
  if (combos.length === 0) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(6, 'Không có combo phù hợp.');
    if (pagination) pagination.innerHTML = '';
    return;
  }

  const paginationMeta = window.AdminPagination.render({
    containerId: 'combos-pagination',
    items: combos,
    currentPage: combosState.page,
    pageSize: combosState.pageSize,
    onPageChange: (page) => {
      combosState.page = page;
      renderCombosTable();
    }
  });
  combosState.page = paginationMeta.page;

  tbody.innerHTML = paginationMeta.items.map((combo) => {
    const statusMap = {
      AVAILABLE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      UNAVAILABLE: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
      OUT_OF_STOCK: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    };

    const foodNames = (combo.foods || []).map((f) => f.foodName).join(', ') || '--';

    return `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <td class="px-6 py-4 whitespace-nowrap">
          <img src="${window.AdminApp.escapeHtml(combo.imageUrl)}" alt="${window.AdminApp.escapeHtml(combo.name)}" class="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700">
        </td>
        <td class="px-6 py-4">
          <div class="font-bold text-sm text-slate-900 dark:text-white">${window.AdminApp.escapeHtml(combo.name)}</div>
          <div class="text-xs text-slate-400 mt-0.5 max-w-xs truncate">${window.AdminApp.escapeHtml(combo.description)}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">${window.AdminApp.formatCurrency(combo.price)}</td>
        <td class="px-6 py-4 text-sm text-slate-500 max-w-xs">
          <div class="flex flex-wrap gap-1">
            ${(combo.foods || []).map((f) => `<span class="inline-block rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-300">${window.AdminApp.escapeHtml(f.foodName)}${f.quantity > 1 ? ' x' + f.quantity : ''}</span>`).join('')}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="rounded-full px-2.5 py-1 text-xs font-bold ${statusMap[combo.status] || statusMap.UNAVAILABLE}">
            ${window.AdminApp.escapeHtml(combo.status || '--')}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button class="mr-3 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" onclick="openComboModal(${combo.id})">Sửa</button>
          <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onclick="deleteCombo(${combo.id})">Xóa</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openComboModal(comboId = null) {
  const combo = comboId ? combosState.combos.find((c) => c.id === comboId) : null;
  const title = combo ? 'Cập nhật combo' : 'Thêm combo';

  const existingFoods = combo ? (combo.foods || []) : [];
  const foodRows = existingFoods.length > 0
    ? existingFoods.map((f, i) => buildFoodRowHtml(i, f.foodId, f.quantity || 1)).join('')
    : buildFoodRowHtml(0, null, 1);

  const content = `
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Tên combo</label>
      <input type="text" id="combo-name" value="${window.AdminApp.escapeHtml(combo?.name || '')}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" />
    </div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Giá</label>
        <input type="number" min="1" step="1000" id="combo-price" value="${combo?.price || ''}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Trạng thái</label>
        <select id="combo-status" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900">
          ${['AVAILABLE', 'UNAVAILABLE', 'OUT_OF_STOCK'].map((s) => `<option value="${s}" ${s === (combo?.status || 'AVAILABLE') ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Ảnh URL</label>
      <input type="text" id="combo-image-url" value="${window.AdminApp.escapeHtml(combo?.imageUrl || '')}" placeholder="URL ảnh combo" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Mô tả</label>
      <textarea id="combo-description" rows="3" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900">${window.AdminApp.escapeHtml(combo?.description || '')}</textarea>
    </div>
    <div>
      <div class="flex items-center justify-between mb-2">
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Món ăn trong combo</label>
        <button type="button" onclick="addComboFoodRow()" class="text-xs font-bold text-primary hover:underline">+ Thêm món</button>
      </div>
      <div id="combo-foods-list" class="space-y-2">
        ${foodRows}
      </div>
    </div>
  `;

  const footer = `
    <button class="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700" onclick="closeGlobalModal()">Hủy</button>
    <button class="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-600" onclick="saveComboForm(${combo?.id || 'null'})">
      ${combo ? 'Lưu thay đổi' : 'Thêm combo'}
    </button>
  `;

  openGlobalModal(title, content, footer);
}

function buildFoodRowHtml(index, selectedFoodId, quantity = 1) {
  const options = combosState.foods.map((f) =>
    `<option value="${f.id}" ${f.id === selectedFoodId ? 'selected' : ''}>${window.AdminApp.escapeHtml(f.name)} - ${window.AdminApp.formatCurrency(f.price)}</option>`
  ).join('');

  return `
    <div class="flex items-center gap-2 combo-food-row">
      <select class="combo-food-select flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
        <option value="">-- Chọn món --</option>
        ${options}
      </select>
      <input type="number" min="1" value="${quantity}" class="combo-food-qty w-16 rounded-xl border border-slate-200 bg-slate-50 px-2 py-2 text-sm text-center dark:border-slate-700 dark:bg-slate-900" title="Số lượng" />
      <button type="button" onclick="this.closest('.combo-food-row').remove()" class="text-red-400 hover:text-red-300 px-2">
        <span class="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  `;
}

window.addComboFoodRow = function () {
  const container = document.getElementById('combo-foods-list');
  if (!container) return;
  const index = container.querySelectorAll('.combo-food-row').length;
  container.insertAdjacentHTML('beforeend', buildFoodRowHtml(index, null, 1));
};

async function saveComboForm(comboId) {
  const foodRows = document.querySelectorAll('.combo-food-row');
  const foods = [];
  foodRows.forEach((row) => {
    const select = row.querySelector('.combo-food-select');
    const qtyInput = row.querySelector('.combo-food-qty');
    const val = Number(select?.value);
    const qty = Number(qtyInput?.value) || 1;
    if (val) {
      foods.push({ foodId: val, quantity: qty });
    }
  });

  if (foods.length === 0) {
    window.AdminApp.showToast('Combo phải có ít nhất một món ăn.', 'error');
    return;
  }

  const payload = {
    name: document.getElementById('combo-name').value.trim(),
    price: Number(document.getElementById('combo-price').value),
    status: document.getElementById('combo-status').value,
    imageUrl: document.getElementById('combo-image-url').value.trim(),
    description: document.getElementById('combo-description').value.trim(),
    foods: foods
  };

  try {
    if (comboId) {
      await window.AdminApp.request(`/combos/${comboId}`, { method: 'PUT', body: payload });
      window.AdminApp.showToast('Đã cập nhật combo.');
    } else {
      await window.AdminApp.request('/combos', { method: 'POST', body: payload });
      window.AdminApp.showToast('Đã thêm combo mới.');
    }

    closeGlobalModal();
    await loadCombosData();
  } catch (error) {
    window.AdminApp.showToast(error.message || 'Không thể lưu combo.', 'error');
  }
}

async function deleteCombo(comboId) {
  if (!window.AdminApp.confirmAction('Bạn có chắc muốn xóa combo này?')) {
    return;
  }

  try {
    await window.AdminApp.request(`/combos/${comboId}`, { method: 'DELETE' });
    window.AdminApp.showToast('Đã xóa combo.');
    await loadCombosData();
  } catch (error) {
    window.AdminApp.showToast(error.message || 'Không thể xóa combo.', 'error');
  }
}
