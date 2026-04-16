const customersState = {
  users: [],
  query: ''
};

async function initCustomers() {
  window.AdminApp.configureGlobalSearch({
    placeholder: 'Tìm theo tên, email, số điện thoại...',
    handler: (value) => {
      customersState.query = value.toLowerCase();
      renderCustomers();
    }
  });
  await loadCustomers();
}

async function loadCustomers() {
  const tbody = document.getElementById('customers-tbody');
  if (tbody) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(7, 'Đang tải danh sách người dùng...');
  }

  try {
    const users = await window.AdminApp.request('/users');
    customersState.users = Array.isArray(users) ? users : [];
    renderCustomersStats();
    renderCustomers();
  } catch (error) {
    console.error(error);
    if (tbody) {
      tbody.innerHTML = window.AdminApp.renderTableMessage(7, error.message || 'Không thể tải người dùng.', 'error');
    }
  }
}

function getFilteredUsers() {
  return customersState.users.filter((user) => {
    const haystack = [
      user.fullname,
      user.email,
      user.phone,
      user.role
    ].join(' ').toLowerCase();

    return !customersState.query || haystack.includes(customersState.query);
  });
}

function renderCustomersStats() {
  const users = customersState.users;
  document.getElementById('customers-total-count').textContent = window.AdminApp.formatNumber(users.length);
  document.getElementById('customers-active-count').textContent = window.AdminApp.formatNumber(users.filter((user) => user.isActive).length);
  document.getElementById('customers-admin-count').textContent = window.AdminApp.formatNumber(users.filter((user) => user.role === 'ADMIN').length);
}

function renderCustomers() {
  const tbody = document.getElementById('customers-tbody');
  if (!tbody) return;

  const users = getFilteredUsers();
  if (users.length === 0) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(7, 'Không có người dùng phù hợp.');
    return;
  }

  tbody.innerHTML = users.map((user) => `
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">${window.AdminApp.escapeHtml(user.fullname || '--')}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.escapeHtml(user.email || '--')}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.escapeHtml(user.phone || '--')}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="rounded-full px-2.5 py-1 text-xs font-bold ${user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}">
          ${window.AdminApp.escapeHtml(user.role || '--')}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="rounded-full px-2.5 py-1 text-xs font-bold ${user.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}">
          ${user.isActive ? 'ACTIVE' : 'DISABLED'}
        </span>
      </td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.formatDateTime(user.createdAt)}</td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" onclick="toggleCustomerStatus(${user.id})">
          ${user.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
        </button>
      </td>
    </tr>
  `).join('');
}

async function toggleCustomerStatus(userId) {
  const user = customersState.users.find((item) => item.id === userId);
  if (!user) {
    return;
  }

  const nextState = !user.isActive;
  const confirmed = window.AdminApp.confirmAction(`Bạn có chắc muốn ${nextState ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản ${user.fullname}?`);
  if (!confirmed) {
    return;
  }

  try {
    await window.AdminApp.request(`/users/${userId}`, {
      method: 'PUT',
      body: { isActive: nextState }
    });
    window.AdminApp.showToast(`Đã ${nextState ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản.`);
    await loadCustomers();
  } catch (error) {
    window.AdminApp.showToast(error.message || 'Không thể cập nhật trạng thái tài khoản.', 'error');
  }
}
