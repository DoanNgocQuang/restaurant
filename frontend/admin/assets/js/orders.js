const ordersState = {
  orders: [],
  bookings: [],
  foods: [],
  combos: [],
  tables: [],
  query: '',
  statusFilter: '',
  tableFilter: '',
  dateSort: 'desc',
  totalSort: '',
  page: 1,
  pageSize: 10,
  formItems: []
};

async function initOrders() {
  ordersState.query = '';
  ordersState.statusFilter = '';
  ordersState.tableFilter = '';
  ordersState.dateSort = 'desc';
  ordersState.totalSort = '';
  ordersState.page = 1;
  ordersState.formItems = [];

  bindOrderEvents();
  window.AdminApp.configureGlobalSearch({
    placeholder: 'Tìm đơn theo khách, email, bàn, món hoặc mã đơn...',
    handler: (query) => {
      ordersState.query = query.toLowerCase();
      ordersState.page = 1;
      renderOrdersList();
    }
  });

  await loadOrdersData();
}

function bindOrderEvents() {
  const addButton = document.getElementById('add-order-btn');
  if (addButton && !addButton.dataset.bound) {
    addButton.dataset.bound = 'true';
    addButton.addEventListener('click', () => openOrderModal());
  }

  const statusFilter = document.getElementById('orders-status-filter');
  if (statusFilter && !statusFilter.dataset.bound) {
    statusFilter.dataset.bound = 'true';
    statusFilter.value = ordersState.statusFilter;
    statusFilter.addEventListener('change', (event) => {
      ordersState.statusFilter = event.target.value;
      ordersState.page = 1;
      renderOrdersList();
    });
  }

  const tableFilter = document.getElementById('orders-table-filter');
  if (tableFilter && !tableFilter.dataset.bound) {
    tableFilter.dataset.bound = 'true';
    tableFilter.value = ordersState.tableFilter;
    tableFilter.addEventListener('change', (event) => {
      ordersState.tableFilter = event.target.value;
      ordersState.page = 1;
      renderOrdersList();
    });
  }

  const dateSort = document.getElementById('orders-date-sort');
  if (dateSort && !dateSort.dataset.bound) {
    dateSort.dataset.bound = 'true';
    dateSort.value = ordersState.dateSort;
    dateSort.addEventListener('change', (event) => {
      ordersState.dateSort = event.target.value;
      ordersState.page = 1;
      renderOrdersList();
    });
  }

  const totalSort = document.getElementById('orders-total-sort');
  if (totalSort && !totalSort.dataset.bound) {
    totalSort.dataset.bound = 'true';
    totalSort.value = ordersState.totalSort;
    totalSort.addEventListener('change', (event) => {
      ordersState.totalSort = event.target.value;
      ordersState.page = 1;
      renderOrdersList();
    });
  }
}

async function loadOrdersData() {
  const tbody = document.getElementById('orders-tbody');
  if (tbody) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(7, 'Đang tải danh sách đơn hàng...');
  }

  try {
    const [orders, bookings, foods, combos, tables] = await Promise.all([
      window.AdminApp.request('/orders/all'),
      window.AdminApp.request('/bookings'),
      window.AdminApp.request('/foods'),
      window.AdminApp.request('/combos'),
      window.AdminApp.request('/tables')
    ]);

    ordersState.orders = Array.isArray(orders) ? orders : [];
    ordersState.bookings = Array.isArray(bookings) ? bookings : [];
    ordersState.foods = Array.isArray(foods) ? foods : [];
    ordersState.combos = Array.isArray(combos) ? combos : [];
    ordersState.tables = Array.isArray(tables) ? tables : [];

    renderOrderTableFilter();
    renderOrdersStats();
    renderOrdersList();
  } catch (error) {
    console.error(error);
    if (tbody) {
      tbody.innerHTML = window.AdminApp.renderTableMessage(7, error.message || 'Không thể tải danh sách đơn hàng.', 'error');
    }

    const pagination = document.getElementById('orders-pagination');
    if (pagination) {
      pagination.innerHTML = '';
    }
  }
}

function renderOrderTableFilter() {
  const tableFilter = document.getElementById('orders-table-filter');
  if (!tableFilter) {
    return;
  }

  tableFilter.innerHTML = `
    <option value="">Tất cả bàn</option>
    ${ordersState.tables.map((table) => `
      <option value="${table.id}" ${String(table.id) === ordersState.tableFilter ? 'selected' : ''}>
        ${window.AdminApp.escapeHtml(table.name || `Bàn #${table.id}`)}
      </option>
    `).join('')}
  `;
}

function renderOrdersStats() {
  const orders = ordersState.orders;
  document.getElementById('orders-total-count').textContent = window.AdminApp.formatNumber(orders.length);
  document.getElementById('orders-pending-count').textContent = window.AdminApp.formatNumber(
    orders.filter((order) => order.status === 'PENDING').length
  );
  document.getElementById('orders-confirmed-count').textContent = window.AdminApp.formatNumber(
    orders.filter((order) => order.status === 'CONFIRMED').length
  );
}

function getOrderItemsSummary(order) {
  return (order.orderDetails || [])
    .map((item) => `${item.itemName} (x${item.quantity})`)
    .join(', ');
}

function getFilteredOrders() {
  const filtered = ordersState.orders.filter((order) => {
    const booking = getBookingById(order.bookingId);
    const bookingTables = getBookingTablesLabel(getBookingById(order.bookingId));
    const matchesTable = !ordersState.tableFilter || (booking?.tables || []).some((table) => String(table.id) === ordersState.tableFilter);
    const haystack = [
      order.id,
      order.userName,
      order.userEmail,
      order.tablesName,
      bookingTables,
      order.status,
      order.bookingId,
      getOrderItemsSummary(order)
    ].join(' ').toLowerCase();

    const matchesQuery = !ordersState.query || haystack.includes(ordersState.query);
    const matchesStatus = !ordersState.statusFilter || order.status === ordersState.statusFilter;

    return matchesQuery && matchesStatus && matchesTable;
  });

  const sorted = [...filtered];
  const getTimestamp = (order) => new Date(order.createdAt || 0).getTime() || 0;
  const getTotal = (order) => Number(order.totalAmount || 0);

  if (ordersState.totalSort) {
    sorted.sort((left, right) => (
      ordersState.totalSort === 'asc'
        ? getTotal(left) - getTotal(right)
        : getTotal(right) - getTotal(left)
    ));
    return sorted;
  }

  sorted.sort((left, right) => (
    ordersState.dateSort === 'asc'
      ? getTimestamp(left) - getTimestamp(right)
      : getTimestamp(right) - getTimestamp(left)
  ));

  return sorted;
}

function getBookingById(bookingId) {
  return ordersState.bookings.find((booking) => booking.id === bookingId) || null;
}

function getTableNameById(tableId) {
  const table = ordersState.tables.find((item) => item.id === tableId);
  return table?.name || `Bàn #${tableId}`;
}

function getBookingTablesLabel(booking) {
  if (!booking || !Array.isArray(booking.tables) || booking.tables.length === 0) {
    return '--';
  }

  return booking.tables.map((table) => getTableNameById(table.id)).join(', ');
}

function getBookingSelectOptions(order = null) {
  const currentBookingId = order?.bookingId || null;
  const bookings = ordersState.bookings.filter((booking) => {
    if (booking.id === currentBookingId) {
      return true;
    }

    return booking.status !== 'CANCELLED';
  });

  return bookings.map((booking) => {
    const label = [
      `#${booking.id}`,
      booking.contactName || booking.userFullname || 'Khách lẻ',
      getBookingTablesLabel(booking),
      window.AdminApp.formatDateTime(booking.bookingTime)
    ].join(' • ');

    return `
      <option value="${booking.id}" ${booking.id === currentBookingId ? 'selected' : ''}>
        ${window.AdminApp.escapeHtml(label)}
      </option>
    `;
  }).join('');
}

function getSelectableFoods(selectedId = null) {
  return ordersState.foods.filter((food) => food.status === 'AVAILABLE' || food.id === selectedId);
}

function getSelectableCombos(selectedId = null) {
  return ordersState.combos.filter((combo) => combo.status === 'AVAILABLE' || combo.id === selectedId);
}

function createDefaultOrderItem() {
  const firstFood = getSelectableFoods()[0];
  const firstCombo = getSelectableCombos()[0];

  if (firstFood) {
    return { type: 'FOOD', itemId: firstFood.id, quantity: 1 };
  }

  if (firstCombo) {
    return { type: 'COMBO', itemId: firstCombo.id, quantity: 1 };
  }

  return { type: 'FOOD', itemId: '', quantity: 1 };
}

function normalizeOrderDetail(detail) {
  if (detail.foodId) {
    return { type: 'FOOD', itemId: detail.foodId, quantity: detail.quantity };
  }

  return { type: 'COMBO', itemId: detail.comboId, quantity: detail.quantity };
}

function getSelectableItems(type, selectedId = null) {
  if (type === 'COMBO') {
    return getSelectableCombos(selectedId).map((combo) => ({
      id: combo.id,
      name: combo.name,
      price: combo.price
    }));
  }

  return getSelectableFoods(selectedId).map((food) => ({
    id: food.id,
    name: food.name,
    price: food.price
  }));
}

function ensureFormItemSelection(index) {
  const item = ordersState.formItems[index];
  if (!item) {
    return;
  }

  const options = getSelectableItems(item.type, item.itemId);
  if (options.length === 0) {
    item.itemId = '';
    return;
  }

  const hasSelected = options.some((option) => Number(option.id) === Number(item.itemId));
  if (!hasSelected) {
    item.itemId = options[0].id;
  }
}

function getSelectedItemData(item) {
  const options = getSelectableItems(item.type, item.itemId);
  return options.find((option) => Number(option.id) === Number(item.itemId)) || null;
}

function renderOrdersList() {
  const tbody = document.getElementById('orders-tbody');
  const pagination = document.getElementById('orders-pagination');
  if (!tbody) return;

  const filtered = getFilteredOrders();
  if (filtered.length === 0) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(7, 'Không tìm thấy đơn hàng nào.');
    if (pagination) {
      pagination.innerHTML = '';
    }
    return;
  }

  const paginationMeta = window.AdminPagination.render({
    containerId: 'orders-pagination',
    items: filtered,
    currentPage: ordersState.page,
    pageSize: ordersState.pageSize,
    onPageChange: (page) => {
      ordersState.page = page;
      renderOrdersList();
    }
  });
  ordersState.page = paginationMeta.page;

  tbody.innerHTML = paginationMeta.items.map((order) => {
    const statusMap = {
      PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      CONFIRMED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      CANCELLED: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
    };
    const itemsSummary = getOrderItemsSummary(order);

    return `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700 dark:text-slate-300">#${order.id}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="text-sm font-bold text-slate-900 dark:text-white">${window.AdminApp.escapeHtml(order.userName || 'Ẩn danh')}</div>
          <div class="text-xs text-slate-500">${window.AdminApp.escapeHtml(order.userEmail || '--')}</div>
          <div class="text-xs text-slate-400 mt-1">Booking #${window.AdminApp.escapeHtml(order.bookingId || '--')}</div>
        </td>
        <td class="px-6 py-4 text-sm text-slate-500">
          <div class="font-semibold text-slate-700 dark:text-slate-200">${window.AdminApp.escapeHtml(order.tablesName || '--')}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap font-medium text-emerald-600">
          <div>${window.AdminApp.formatCurrency(order.totalAmount)}</div>
          <div class="mt-1 max-w-[220px] truncate text-[10px] text-slate-400" title="${window.AdminApp.escapeHtml(itemsSummary)}">
            ${window.AdminApp.escapeHtml(itemsSummary || '--')}
          </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.formatDateTime(order.createdAt)}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="rounded-full px-2.5 py-1 text-xs font-bold ${statusMap[order.status] || statusMap.CONFIRMED}">
            ${window.AdminApp.escapeHtml(order.status)}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          ${order.status === 'PENDING' ? `<button class="mr-3 text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300" onclick="updateOrderStatus(${order.id}, 'CONFIRMED')">Xác nhận</button>` : ''}
          ${order.status !== 'CANCELLED' ? `<button class="mr-3 text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300" onclick="updateOrderStatus(${order.id}, 'CANCELLED')">Hủy</button>` : ''}
          <button class="mr-3 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" onclick="openOrderModal(${order.id})">Sửa</button>
          <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onclick="deleteOrder(${order.id})">Xóa</button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderOrderItemsForm() {
  const container = document.getElementById('order-items-list');
  if (!container) {
    return;
  }

  if (ordersState.formItems.length === 0) {
    ordersState.formItems = [createDefaultOrderItem()];
  }

  container.innerHTML = ordersState.formItems.map((item, index) => {
    ensureFormItemSelection(index);
    const options = getSelectableItems(item.type, item.itemId);
    const selectedItem = getSelectedItemData(item);

    return `
      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
        <div class="grid grid-cols-1 gap-4 xl:grid-cols-[140px,1fr,120px,auto]">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Loại</label>
            <select class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-800" onchange="updateOrderItemField(${index}, 'type', this.value)">
              <option value="FOOD" ${item.type === 'FOOD' ? 'selected' : ''}>Món ăn</option>
              <option value="COMBO" ${item.type === 'COMBO' ? 'selected' : ''}>Combo</option>
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Sản phẩm</label>
            <select class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-800" onchange="updateOrderItemField(${index}, 'itemId', this.value)">
              ${options.map((option) => `
                <option value="${option.id}" ${Number(option.id) === Number(item.itemId) ? 'selected' : ''}>
                  ${window.AdminApp.escapeHtml(option.name)} • ${window.AdminApp.formatCurrency(option.price)}
                </option>
              `).join('')}
            </select>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Số lượng</label>
            <input type="number" min="1" value="${item.quantity}" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 dark:border-slate-700 dark:bg-slate-800" onchange="updateOrderItemField(${index}, 'quantity', this.value)" />
          </div>
          <div class="flex items-end justify-end">
            <button
              type="button"
              class="rounded-xl px-4 py-2 text-sm font-semibold ${ordersState.formItems.length === 1 ? 'cursor-not-allowed text-slate-400' : 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20'}"
              onclick="removeOrderItem(${index})"
              ${ordersState.formItems.length === 1 ? 'disabled' : ''}
            >
              Xóa
            </button>
          </div>
        </div>
        <div class="mt-3 text-sm text-slate-500 dark:text-slate-400">
          Đơn giá: <span class="font-semibold text-slate-700 dark:text-slate-200">${selectedItem ? window.AdminApp.formatCurrency(selectedItem.price) : '--'}</span>
        </div>
      </div>
    `;
  }).join('');

  renderOrderDraftSummary();
}

function renderOrderDraftSummary() {
  const summary = document.getElementById('order-draft-summary');
  if (!summary) {
    return;
  }

  const bookingId = Number(document.getElementById('order-booking-id')?.value || 0);
  const booking = getBookingById(bookingId);
  const total = ordersState.formItems.reduce((sum, item) => {
    const selected = getSelectedItemData(item);
    return sum + (Number(selected?.price || 0) * Number(item.quantity || 0));
  }, 0);

  summary.innerHTML = `
    <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
      <div><span class="font-semibold text-slate-800 dark:text-white">Booking:</span> ${window.AdminApp.escapeHtml(booking ? `#${booking.id} • ${booking.contactName || booking.userFullname || 'Khách lẻ'}` : '--')}</div>
      <div class="mt-1"><span class="font-semibold text-slate-800 dark:text-white">Bàn:</span> ${window.AdminApp.escapeHtml(booking ? getBookingTablesLabel(booking) : '--')}</div>
      <div class="mt-1"><span class="font-semibold text-slate-800 dark:text-white">Tạm tính:</span> ${window.AdminApp.formatCurrency(total)}</div>
    </div>
  `;
}

function openOrderModal(orderId = null) {
  if (ordersState.bookings.length === 0) {
    window.AdminApp.showToast('Chưa có booking nào để tạo đơn hàng.', 'error');
    return;
  }

  if (ordersState.foods.length === 0 && ordersState.combos.length === 0) {
    window.AdminApp.showToast('Chưa có món ăn hoặc combo để thêm vào đơn.', 'error');
    return;
  }

  const order = orderId ? ordersState.orders.find((item) => item.id === orderId) : null;
  const options = getBookingSelectOptions(order);
  if (!options) {
    window.AdminApp.showToast('Không có booking hợp lệ để gắn đơn hàng.', 'error');
    return;
  }

  ordersState.formItems = order?.orderDetails?.length
    ? order.orderDetails.map(normalizeOrderDetail)
    : [createDefaultOrderItem()];

  const content = `
    <div class="grid grid-cols-1 gap-4">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Booking gắn với đơn hàng</label>
        <select id="order-booking-id" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" onchange="renderOrderDraftSummary()">
          ${options}
        </select>
      </div>
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Chi tiết đơn hàng</p>
          <p class="text-xs text-slate-500">Chọn món hoặc combo rồi nhập số lượng.</p>
        </div>
        <button type="button" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-200" onclick="addOrderItem()">
          Thêm dòng
        </button>
      </div>
      <div id="order-items-list" class="space-y-3"></div>
      ${order ? `
        <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">
          Trạng thái hiện tại: <span class="font-semibold text-slate-800 dark:text-white">${window.AdminApp.escapeHtml(order.status)}</span>
        </div>
      ` : ''}
      <div id="order-draft-summary"></div>
    </div>
  `;

  const footer = `
    <button class="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700" onclick="closeGlobalModal()">Hủy</button>
    <button class="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-600" onclick="saveOrderForm(${order?.id || 'null'})">
      ${order ? 'Lưu đơn hàng' : 'Tạo đơn hàng'}
    </button>
  `;

  openGlobalModal(
    order ? `Cập nhật đơn #${order.id}` : 'Tạo đơn hàng mới',
    content,
    footer,
    'max-w-5xl mx-4'
  );
  renderOrderItemsForm();
  renderOrderDraftSummary();
}

function addOrderItem() {
  ordersState.formItems.push(createDefaultOrderItem());
  renderOrderItemsForm();
}

function removeOrderItem(index) {
  if (ordersState.formItems.length <= 1) {
    return;
  }

  ordersState.formItems.splice(index, 1);
  renderOrderItemsForm();
}

function updateOrderItemField(index, field, value) {
  const item = ordersState.formItems[index];
  if (!item) {
    return;
  }

  if (field === 'type') {
    item.type = value;
    item.itemId = '';
    ensureFormItemSelection(index);
  } else if (field === 'quantity') {
    item.quantity = Math.max(Number(value) || 1, 1);
  } else if (field === 'itemId') {
    item.itemId = Number(value) || '';
  }

  renderOrderItemsForm();
}

function buildOrderPayload() {
  const bookingId = Number(document.getElementById('order-booking-id')?.value || 0);
  if (!bookingId) {
    throw new Error('Vui lòng chọn booking cho đơn hàng.');
  }

  const orderDetails = ordersState.formItems.map((item) => {
    const selected = getSelectedItemData(item);
    if (!selected) {
      throw new Error('Có dòng món ăn/combo chưa được chọn hợp lệ.');
    }

    return {
      quantity: Math.max(Number(item.quantity) || 1, 1),
      foodId: item.type === 'FOOD' ? Number(item.itemId) : null,
      comboId: item.type === 'COMBO' ? Number(item.itemId) : null
    };
  });

  if (orderDetails.length === 0) {
    throw new Error('Đơn hàng cần ít nhất một món.');
  }

  return {
    bookingId,
    orderDetails
  };
}

async function saveOrderForm(orderId) {
  try {
    const payload = buildOrderPayload();
    if (orderId) {
      await window.AdminApp.request(`/orders/admin/${orderId}`, { method: 'PUT', body: payload });
      window.AdminApp.showToast('Đã cập nhật đơn hàng.');
    } else {
      await window.AdminApp.request('/orders/admin', { method: 'POST', body: payload });
      ordersState.page = 1;
      window.AdminApp.showToast('Đã tạo đơn hàng mới.');
    }

    closeGlobalModal();
    await loadOrdersData();
  } catch (error) {
    window.AdminApp.showToast(error.message || 'Không thể lưu đơn hàng.', 'error');
  }
}

async function deleteOrder(orderId) {
  if (!window.AdminApp.confirmAction(`Bạn có chắc muốn xóa đơn hàng #${orderId}?`)) {
    return;
  }

  try {
    await window.AdminApp.request(`/orders/${orderId}`, { method: 'DELETE' });
    window.AdminApp.showToast('Đã xóa đơn hàng.');
    await loadOrdersData();
  } catch (error) {
    window.AdminApp.showToast(error.message || 'Không thể xóa đơn hàng.', 'error');
  }
}

async function updateOrderStatus(orderId, status) {
  const labels = {
    CONFIRMED: 'xác nhận',
    CANCELLED: 'hủy'
  };

  if (!window.AdminApp.confirmAction(`Bạn có chắc muốn ${labels[status] || 'cập nhật'} đơn hàng #${orderId}?`)) {
    return;
  }

  try {
    await window.AdminApp.request(`/orders/${orderId}/status?status=${encodeURIComponent(status)}`, {
      method: 'PATCH'
    });
    window.AdminApp.showToast(`Đã cập nhật trạng thái đơn hàng #${orderId}.`);
    await loadOrdersData();
  } catch (error) {
    window.AdminApp.showToast(error.message || 'Không thể cập nhật trạng thái đơn hàng.', 'error');
  }
}
