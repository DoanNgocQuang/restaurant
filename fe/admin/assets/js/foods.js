function initFoods() {
  const dishesTbody = document.getElementById('dishes-tbody');
  if (dishesTbody) {
    const dishes = [
      { id: 1, name: 'Bò bít tết Wagyu', category: 'Món chính', price: '$120.00', status: 'Còn hàng', image: 'https://picsum.photos/seed/steak/100/100', details: 'Thịt bò Wagyu A5 nhập khẩu, sốt tiêu đen.' },
      { id: 2, name: 'Cá hồi áp chảo', category: 'Hải sản', price: '$85.00', status: 'Còn hàng', image: 'https://picsum.photos/seed/salmon/100/100', details: 'Cá hồi Na Uy, măng tây, sốt chanh leo.' },
      { id: 3, name: 'Súp nấm Truffle', category: 'Khai vị', price: '$45.00', status: 'Hết hàng', image: 'https://picsum.photos/seed/soup/100/100', details: 'Nấm Truffle đen, kem tươi, bánh mì bơ tỏi.' }
    ];

    let html = '';
    dishes.forEach(dish => {
      const statusClass = dish.status === 'Còn hàng' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      
      html += `
        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap">
            <img src="${dish.image}" alt="${dish.name}" class="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700">
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="font-bold text-sm text-slate-900 dark:text-white">${dish.name}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${dish.category}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">${dish.price}</td>
          <td class="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title="${dish.details}">${dish.details}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2.5 py-1 rounded-full text-xs font-bold ${statusClass}">${dish.status}</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3" onclick="openEditDishModal(${dish.id})">Sửa</button>
            <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onclick="deleteDish(${dish.id})">Xóa</button>
          </td>
        </tr>
      `;
    });
    dishesTbody.innerHTML = html;
  }
}

function openModal(modalId) {
  if (modalId === 'modal-add-dish') {
    const content = `
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ảnh món ăn (URL)</label>
        <input type="text" id="add-dish-image" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="https://example.com/image.jpg">
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên món ăn</label>
        <input type="text" id="add-dish-name" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Danh mục</label>
        <select id="add-dish-category" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="Món chính">Món chính</option>
          <option value="Hải sản">Hải sản</option>
          <option value="Khai vị">Khai vị</option>
          <option value="Tráng miệng">Tráng miệng</option>
          <option value="Đồ uống">Đồ uống</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Giá tiền</label>
        <input type="text" id="add-dish-price" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Chi tiết món ăn</label>
        <textarea id="add-dish-details" rows="3" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Mô tả chi tiết món ăn..."></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Trạng thái</label>
        <select id="add-dish-status" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="Còn hàng">Còn hàng</option>
          <option value="Hết hàng">Hết hàng</option>
        </select>
      </div>
    `;
    const footer = `
      <button class="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors" onclick="closeGlobalModal()">Hủy</button>
      <button class="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-rose-600 rounded-xl transition-colors" onclick="saveAddDish()">Thêm món</button>
    `;
    openGlobalModal('Thêm món ăn', content, footer);
  }
}

function openEditDishModal(id) {
  const content = `
    <input type="hidden" id="edit-dish-id" value="${id}">
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ảnh món ăn (URL)</label>
      <input type="text" id="edit-dish-image" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="https://example.com/image.jpg">
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tên món ăn</label>
      <input type="text" id="edit-dish-name" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Danh mục</label>
      <select id="edit-dish-category" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
        <option value="Món chính">Món chính</option>
        <option value="Hải sản">Hải sản</option>
        <option value="Khai vị">Khai vị</option>
        <option value="Tráng miệng">Tráng miệng</option>
        <option value="Đồ uống">Đồ uống</option>
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Giá tiền</label>
      <input type="text" id="edit-dish-price" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Chi tiết món ăn</label>
      <textarea id="edit-dish-details" rows="3" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Mô tả chi tiết món ăn..."></textarea>
    </div>
    <div>
      <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Trạng thái</label>
      <select id="edit-dish-status" class="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/50">
        <option value="Còn hàng">Còn hàng</option>
        <option value="Hết hàng">Hết hàng</option>
      </select>
    </div>
  `;
  const footer = `
    <button class="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors" onclick="closeGlobalModal()">Hủy</button>
    <button class="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-rose-600 rounded-xl transition-colors" onclick="saveEditDish()">Lưu thay đổi</button>
  `;
  openGlobalModal('Sửa món ăn', content, footer);
}

function saveAddDish() {
  closeGlobalModal();
  // Add logic to save new dish
}

function saveEditDish() {
  closeGlobalModal();
  // Add logic to save edited dish
}

function deleteDish(id) {
  if(confirm('Bạn có chắc chắn muốn xóa món ăn này?')) {
    // Add logic to delete dish
  }
}
