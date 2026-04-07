function initVouchers() {
  const vouchersTbody = document.getElementById('vouchers-tbody');
  if (vouchersTbody) {
    const vouchers = [
      { id: 1, code: 'WELCOME10', discount: '10%', expiry: '31/12/2023', status: 'Đang hoạt động' },
      { id: 2, code: 'SUMMER20', discount: '20%', expiry: '30/06/2023', status: 'Đã hết hạn' },
      { id: 3, code: 'VIP50', discount: '50K', expiry: '15/11/2023', status: 'Đang hoạt động' }
    ];

    let html = '';
    vouchers.forEach(voucher => {
      const statusClass = voucher.status === 'Đang hoạt động' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      
      html += `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">${voucher.code}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-rose-600 dark:text-rose-400">${voucher.discount}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${voucher.expiry}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2.5 py-1 rounded-full text-xs font-bold ${statusClass}">${voucher.status}</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3" onclick="openEditVoucherModal(${voucher.id})">Sửa</button>
            <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onclick="deleteVoucher(${voucher.id})">Xóa</button>
          </td>
        </tr>
      `;
    });
    vouchersTbody.innerHTML = html;
  }
}

function openVoucherModal() {
  const content = `
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mã Voucher</label>
      <input type="text" id="add-voucher-code" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase">
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Loại giảm giá</label>
      <select id="add-voucher-type" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
        <option value="percent">Phần trăm (%)</option>
        <option value="fixed">Số tiền cố định (VND)</option>
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Giá trị giảm</label>
      <input type="number" id="add-voucher-value" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hạn sử dụng</label>
      <input type="date" id="add-voucher-expiry" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
    </div>
  `;
  const footer = `
    <button class="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors" onclick="closeGlobalModal()">Hủy</button>
    <button class="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-rose-600 rounded-xl transition-colors" onclick="saveAddVoucher()">Tạo Voucher</button>
  `;
  openGlobalModal('Tạo Voucher', content, footer);
}

function openEditVoucherModal(id) {
  // Similar to openVoucherModal but with pre-filled data
  openVoucherModal();
}

function saveAddVoucher() {
  closeGlobalModal();
}

function deleteVoucher(id) {
  if(confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
    // delete
  }
}
