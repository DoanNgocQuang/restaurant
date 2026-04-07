function initCustomers() {
  const customersTbody = document.getElementById('customers-tbody');
  if (customersTbody) {
    const customers = [
      { id: 1, name: 'Nguyễn Văn A', phone: '0901234567', points: 1500, tier: 'Kim Cương' },
      { id: 2, name: 'Trần Thị B', phone: '0987654321', points: 800, tier: 'Vàng' },
      { id: 3, name: 'Lê Văn C', phone: '0912345678', points: 300, tier: 'Bạc' }
    ];

    let html = '';
    customers.forEach(customer => {
      let tierClass = '';
      switch (customer.tier) {
        case 'Kim Cương': tierClass = 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'; break;
        case 'Vàng': tierClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'; break;
        case 'Bạc': tierClass = 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300'; break;
        default: tierClass = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      }

      html += `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="font-bold text-sm text-slate-900 dark:text-white">${customer.name}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${customer.phone}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">${customer.points}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2.5 py-1 rounded-full text-xs font-bold ${tierClass}">${customer.tier}</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3" onclick="openEditCustomerModal(${customer.id})">Sửa</button>
            <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onclick="deleteCustomer(${customer.id})">Xóa</button>
          </td>
        </tr>
      `;
    });
    customersTbody.innerHTML = html;
  }
}

// Override openModal for customers
const originalOpenModal = window.openModal;
window.openModal = function(modalId) {
  if (modalId === 'modal-add-customer') {
    const content = `
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên khách hàng</label>
        <input type="text" id="add-customer-name" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Số điện thoại</label>
        <input type="text" id="add-customer-phone" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Điểm tích lũy</label>
        <input type="number" id="add-customer-points" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50" value="0">
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hạng thành viên</label>
        <select id="add-customer-tier" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="Thành viên">Thành viên</option>
          <option value="Bạc">Bạc</option>
          <option value="Vàng">Vàng</option>
          <option value="Kim Cương">Kim Cương</option>
        </select>
      </div>
    `;
    const footer = `
      <button class="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors" onclick="closeGlobalModal()">Hủy</button>
      <button class="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-rose-600 rounded-xl transition-colors" onclick="saveAddCustomer()">Thêm khách hàng</button>
    `;
    openGlobalModal('Thêm khách hàng', content, footer);
  } else if (originalOpenModal) {
    originalOpenModal(modalId);
  }
};

function openEditCustomerModal(id) {
  const content = `
    <input type="hidden" id="edit-customer-id" value="${id}">
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên khách hàng</label>
      <input type="text" id="edit-customer-name" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Số điện thoại</label>
      <input type="text" id="edit-customer-phone" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Điểm tích lũy</label>
      <input type="number" id="edit-customer-points" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hạng thành viên</label>
      <select id="edit-customer-tier" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
        <option value="Kim Cương">Kim Cương</option>
        <option value="Vàng">Vàng</option>
        <option value="Bạc">Bạc</option>
        <option value="Thành viên">Thành viên</option>
      </select>
    </div>
  `;
  const footer = `
    <button class="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors" onclick="closeGlobalModal()">Hủy</button>
    <button class="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-rose-600 rounded-xl transition-colors" onclick="saveEditCustomer()">Lưu thay đổi</button>
  `;
  openGlobalModal('Sửa khách hàng', content, footer);
}

function saveAddCustomer() {
  closeGlobalModal();
}

function saveEditCustomer() {
  closeGlobalModal();
}

function deleteCustomer(id) {
  if(confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
    // delete
  }
}
