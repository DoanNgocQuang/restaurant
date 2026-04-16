const vouchersState = {
  vouchers: [],
  query: ''
};

async function initVouchers() {
  bindVoucherEvents();
  window.AdminApp.configureGlobalSearch({
    placeholder: 'Tìm theo mã voucher hoặc loại giảm giá...',
    handler: (value) => {
      vouchersState.query = value.toLowerCase();
      renderVouchers();
    }
  });
  await loadVouchers();
}

function bindVoucherEvents() {
  const addButton = document.getElementById('add-voucher-btn');
  if (addButton) {
    addButton.addEventListener('click', () => openVoucherModal());
  }
}

async function loadVouchers() {
  const tbody = document.getElementById('vouchers-tbody');
  if (tbody) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(8, 'Đang tải voucher...');
  }

  try {
    const vouchers = await window.AdminApp.request('/vouchers');
    vouchersState.vouchers = Array.isArray(vouchers) ? vouchers : [];
    renderVouchers();
  } catch (error) {
    console.error(error);
    if (tbody) {
      tbody.innerHTML = window.AdminApp.renderTableMessage(8, error.message || 'Không thể tải voucher.', 'error');
    }
  }
}

function getFilteredVouchers() {
  return vouchersState.vouchers.filter((voucher) => {
    const haystack = [voucher.code, voucher.discountType].join(' ').toLowerCase();
    return !vouchersState.query || haystack.includes(vouchersState.query);
  });
}

function getVoucherStatus(voucher) {
  const now = new Date();
  const endDate = new Date(voucher.endDate);
  if (Number.isNaN(endDate.getTime())) {
    return { label: 'UNKNOWN', className: 'bg-slate-100 text-slate-700' };
  }

  if (endDate < now) {
    return { label: 'EXPIRED', className: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' };
  }

  return { label: 'ACTIVE', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
}

function formatVoucherValue(voucher) {
  if (voucher.discountType === 'PERCENT') {
    return `${voucher.discountValue}%`;
  }
  return window.AdminApp.formatCurrency(voucher.discountValue);
}

function renderVouchers() {
  const tbody = document.getElementById('vouchers-tbody');
  if (!tbody) return;

  const vouchers = getFilteredVouchers();
  if (vouchers.length === 0) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(8, 'Không có voucher phù hợp.');
    return;
  }

  tbody.innerHTML = vouchers.map((voucher) => {
    const status = getVoucherStatus(voucher);
    return `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="font-bold text-sm uppercase tracking-wide text-slate-900 dark:text-white">${window.AdminApp.escapeHtml(voucher.code)}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.escapeHtml(voucher.discountType)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-rose-600 dark:text-rose-400">${window.AdminApp.escapeHtml(formatVoucherValue(voucher))}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
          <div>${window.AdminApp.formatDateTime(voucher.startDate)}</div>
          <div class="text-xs text-slate-400">đến ${window.AdminApp.formatDateTime(voucher.endDate)}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.formatNumber(voucher.quantity)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.formatNumber(voucher.usedUserCount)}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="rounded-full px-2.5 py-1 text-xs font-bold ${status.className}">
            ${status.label}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button class="mr-3 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" onclick="openVoucherModal(${voucher.id})">Sửa</button>
          <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onclick="deleteVoucher(${voucher.id})">Xóa</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openVoucherModal(voucherId = null) {
  const voucher = voucherId ? vouchersState.vouchers.find((item) => item.id === voucherId) : null;
  const title = voucher ? 'Cập nhật voucher' : 'Tạo voucher';

  const content = `
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Mã voucher</label>
      <input type="text" id="voucher-code" value="${window.AdminApp.escapeHtml(voucher?.code || '')}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 uppercase dark:border-slate-700 dark:bg-slate-900" />
    </div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Loại giảm giá</label>
        <select id="voucher-discount-type" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900">
          ${['FIXED', 'PERCENT'].map((type) => `<option value="${type}" ${type === (voucher?.discountType || 'FIXED') ? 'selected' : ''}>${type}</option>`).join('')}
        </select>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Giá trị giảm</label>
        <input type="number" min="1" step="1" id="voucher-discount-value" value="${voucher?.discountValue || ''}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" />
      </div>
    </div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Ngày bắt đầu</label>
        <input type="datetime-local" id="voucher-start-date" value="${window.AdminApp.formatDateTimeLocal(voucher?.startDate)}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Ngày kết thúc</label>
        <input type="datetime-local" id="voucher-end-date" value="${window.AdminApp.formatDateTimeLocal(voucher?.endDate)}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" />
      </div>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Số lượng</label>
      <input type="number" min="1" id="voucher-quantity" value="${voucher?.quantity || ''}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" />
    </div>
  `;

  const footer = `
    <button class="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700" onclick="closeGlobalModal()">Hủy</button>
    <button class="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-600" onclick="saveVoucherForm(${voucher?.id || 'null'})">
      ${voucher ? 'Lưu voucher' : 'Tạo voucher'}
    </button>
  `;

  openGlobalModal(title, content, footer);
}

async function saveVoucherForm(voucherId) {
  const payload = {
    code: document.getElementById('voucher-code').value.trim().toUpperCase(),
    discountType: document.getElementById('voucher-discount-type').value,
    discountValue: Number(document.getElementById('voucher-discount-value').value),
    startDate: document.getElementById('voucher-start-date').value ? window.AdminApp.toApiDateTime(document.getElementById('voucher-start-date').value) : null,
    endDate: window.AdminApp.toApiDateTime(document.getElementById('voucher-end-date').value),
    quantity: Number(document.getElementById('voucher-quantity').value)
  };

  try {
    if (voucherId) {
      await window.AdminApp.request(`/vouchers/${voucherId}`, { method: 'PUT', body: payload });
      window.AdminApp.showToast('Đã cập nhật voucher.');
    } else {
      await window.AdminApp.request('/vouchers', { method: 'POST', body: payload });
      window.AdminApp.showToast('Đã tạo voucher.');
    }

    closeGlobalModal();
    await loadVouchers();
  } catch (error) {
    window.AdminApp.showToast(error.message || 'Không thể lưu voucher.', 'error');
  }
}

async function deleteVoucher(voucherId) {
  if (!window.AdminApp.confirmAction('Bạn có chắc muốn xóa voucher này?')) {
    return;
  }

  try {
    await window.AdminApp.request(`/vouchers/${voucherId}`, { method: 'DELETE' });
    window.AdminApp.showToast('Đã xóa voucher.');
    await loadVouchers();
  } catch (error) {
    window.AdminApp.showToast(error.message || 'Không thể xóa voucher.', 'error');
  }
}
