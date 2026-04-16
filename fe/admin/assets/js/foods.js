const foodsState = {
  foods: [],
  categories: [],
  query: '',
  categoryFilter: ''
};

async function initFoods() {
  foodsState.query = '';
  foodsState.categoryFilter = '';
  bindFoodsEvents();
  window.AdminApp.configureGlobalSearch({
    placeholder: 'Tìm món ăn, mô tả hoặc danh mục...',
    value: '',
    handler: (value) => {
      foodsState.query = value.toLowerCase();
      renderFoodsTable();
    }
  });
  await loadFoodsData();
}

function bindFoodsEvents() {
  const addDishButton = document.getElementById('add-dish-btn');
  if (addDishButton) {
    addDishButton.addEventListener('click', () => openFoodModal());
  }

  const addCategoryButton = document.getElementById('add-category-btn');
  if (addCategoryButton) {
    addCategoryButton.addEventListener('click', () => openCategoryModal());
  }

  const categoryFilter = document.getElementById('food-category-filter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', (event) => {
      foodsState.categoryFilter = event.target.value;
      renderFoodsTable();
    });
  }
}

async function loadFoodsData() {
  const tbody = document.getElementById('dishes-tbody');
  if (tbody) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(7, 'Đang tải thực đơn...');
  }

  try {
    const [foods, categories] = await Promise.all([
      window.AdminApp.request('/foods'),
      window.AdminApp.request('/categories')
    ]);

    foodsState.foods = Array.isArray(foods) ? foods : [];
    foodsState.categories = Array.isArray(categories) ? categories : [];

    renderFoodsCategoryFilter();
    renderCategoryChips();
    renderFoodsTable();
  } catch (error) {
    console.error(error);
    if (tbody) {
      tbody.innerHTML = window.AdminApp.renderTableMessage(7, error.message || 'Không thể tải thực đơn.', 'error');
    }
  }
}

function renderFoodsCategoryFilter() {
  const categoryFilter = document.getElementById('food-category-filter');
  if (!categoryFilter) return;

  categoryFilter.innerHTML = `
    <option value="">Tất cả danh mục</option>
    ${foodsState.categories.map((category) => `
      <option value="${category.id}" ${String(category.id) === foodsState.categoryFilter ? 'selected' : ''}>
        ${window.AdminApp.escapeHtml(category.name)}
      </option>
    `).join('')}
  `;
}

function renderCategoryChips() {
  const container = document.getElementById('food-categories-list');
  if (!container) return;

  if (foodsState.categories.length === 0) {
    container.innerHTML = '<p class="text-sm text-slate-500">Chưa có danh mục nào. Hãy tạo danh mục trước khi thêm món ăn.</p>';
    return;
  }

  container.innerHTML = foodsState.categories.map((category) => `
    <div class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
      <button class="font-semibold text-slate-700 dark:text-slate-200" onclick="openCategoryModal(${category.id})">
        ${window.AdminApp.escapeHtml(category.name)}
      </button>
      <span class="text-xs text-slate-500">${window.AdminApp.formatNumber(category.foodCount || 0)} món</span>
      <button class="text-rose-500" onclick="deleteCategory(${category.id})" title="Xóa danh mục">
        <span class="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  `).join('');
}

function getFilteredFoods() {
  return foodsState.foods.filter((food) => {
    const matchesCategory = !foodsState.categoryFilter || String(food.category?.id) === foodsState.categoryFilter;
    const haystack = [
      food.name,
      food.description,
      food.category?.name,
      food.status
    ].join(' ').toLowerCase();
    const matchesQuery = !foodsState.query || haystack.includes(foodsState.query);
    return matchesCategory && matchesQuery;
  });
}

function renderFoodsTable() {
  const tbody = document.getElementById('dishes-tbody');
  if (!tbody) return;

  const foods = getFilteredFoods();
  if (foods.length === 0) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(7, 'Không có món ăn phù hợp với bộ lọc.');
    return;
  }

  tbody.innerHTML = foods.map((food) => {
    const statusMap = {
      AVAILABLE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      UNAVAILABLE: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
      OUT_OF_STOCK: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    };

    return `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        <td class="px-6 py-4 whitespace-nowrap">
          <img src="${window.AdminApp.escapeHtml(food.imageUrl)}" alt="${window.AdminApp.escapeHtml(food.name)}" class="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700">
        </td>
        <td class="px-6 py-4">
          <div class="font-bold text-sm text-slate-900 dark:text-white">${window.AdminApp.escapeHtml(food.name)}</div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.escapeHtml(food.category?.name || '--')}</td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">${window.AdminApp.formatCurrency(food.price)}</td>
        <td class="px-6 py-4 text-sm text-slate-500 max-w-sm truncate" title="${window.AdminApp.escapeHtml(food.description)}">${window.AdminApp.escapeHtml(food.description)}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="rounded-full px-2.5 py-1 text-xs font-bold ${statusMap[food.status] || statusMap.UNAVAILABLE}">
            ${window.AdminApp.escapeHtml(food.status || '--')}
          </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button class="mr-3 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" onclick="openFoodModal(${food.id})">Sửa</button>
          <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onclick="deleteFood(${food.id})">Xóa</button>
        </td>
      </tr>
    `;
  }).join('');
}

function openFoodModal(foodId = null) {
  if (foodsState.categories.length === 0) {
    window.AdminApp.showToast('Hãy tạo ít nhất một danh mục trước khi thêm món ăn.', 'error');
    return;
  }

  const food = foodId ? foodsState.foods.find((item) => item.id === foodId) : null;
  const title = food ? 'Cập nhật món ăn' : 'Thêm món ăn';

  const content = `
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Tên món ăn</label>
      <input type="text" id="food-name" value="${window.AdminApp.escapeHtml(food?.name || '')}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" />
    </div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Danh mục</label>
        <select id="food-category-id" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900">
          ${foodsState.categories.map((category) => `
            <option value="${category.id}" ${category.id === food?.category?.id ? 'selected' : ''}>
              ${window.AdminApp.escapeHtml(category.name)}
            </option>
          `).join('')}
        </select>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Trạng thái</label>
        <select id="food-status" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900">
          ${['AVAILABLE', 'UNAVAILABLE', 'OUT_OF_STOCK'].map((status) => `
            <option value="${status}" ${status === (food?.status || 'AVAILABLE') ? 'selected' : ''}>${status}</option>
          `).join('')}
        </select>
      </div>
    </div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Giá</label>
        <input type="number" min="1" step="1000" id="food-price" value="${food?.price || ''}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Ảnh URL</label>
        <input type="text" id="food-image-url" value="${window.AdminApp.escapeHtml(food?.imageUrl || '')}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" />
      </div>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Mô tả</label>
      <textarea id="food-description" rows="4" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900">${window.AdminApp.escapeHtml(food?.description || '')}</textarea>
    </div>
  `;

  const footer = `
    <button class="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700" onclick="closeGlobalModal()">Hủy</button>
    <button class="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-600" onclick="saveFoodForm(${food?.id || 'null'})">
      ${food ? 'Lưu thay đổi' : 'Thêm món'}
    </button>
  `;

  openGlobalModal(title, content, footer);
}

async function saveFoodForm(foodId) {
  const payload = {
    name: document.getElementById('food-name').value.trim(),
    categoryId: Number(document.getElementById('food-category-id').value),
    status: document.getElementById('food-status').value,
    price: Number(document.getElementById('food-price').value),
    imageUrl: document.getElementById('food-image-url').value.trim(),
    description: document.getElementById('food-description').value.trim()
  };

  try {
    if (foodId) {
      await window.AdminApp.request(`/foods/${foodId}`, { method: 'PUT', body: payload });
      window.AdminApp.showToast('Đã cập nhật món ăn.');
    } else {
      await window.AdminApp.request('/foods', { method: 'POST', body: payload });
      foodsState.query = '';
      foodsState.categoryFilter = '';
      window.AdminApp.configureGlobalSearch({
        placeholder: 'Tìm món ăn, mô tả hoặc danh mục...',
        value: '',
        handler: (value) => {
          foodsState.query = value.toLowerCase();
          renderFoodsTable();
        }
      });
      window.AdminApp.showToast('Đã thêm món ăn mới.');
    }

    closeGlobalModal();
    await loadFoodsData();
  } catch (error) {
    window.AdminApp.showToast(error.message || 'Không thể lưu món ăn.', 'error');
  }
}

async function deleteFood(foodId) {
  if (!window.AdminApp.confirmAction('Bạn có chắc muốn xóa món ăn này?')) {
    return;
  }

  try {
    await window.AdminApp.request(`/foods/${foodId}`, { method: 'DELETE' });
    window.AdminApp.showToast('Đã xóa món ăn.');
    await loadFoodsData();
  } catch (error) {
    window.AdminApp.showToast(error.message || 'Không thể xóa món ăn.', 'error');
  }
}

function openCategoryModal(categoryId = null) {
  const category = categoryId ? foodsState.categories.find((item) => item.id === categoryId) : null;
  const title = category ? 'Cập nhật danh mục' : 'Thêm danh mục';

  const content = `
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Tên danh mục</label>
      <input type="text" id="category-name" value="${window.AdminApp.escapeHtml(category?.name || '')}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Mô tả</label>
      <textarea id="category-description" rows="4" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900">${window.AdminApp.escapeHtml(category?.description || '')}</textarea>
    </div>
  `;

  const footer = `
    <button class="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700" onclick="closeGlobalModal()">Hủy</button>
    <button class="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-600" onclick="saveCategoryForm(${category?.id || 'null'})">
      ${category ? 'Lưu danh mục' : 'Tạo danh mục'}
    </button>
  `;

  openGlobalModal(title, content, footer);
}

async function saveCategoryForm(categoryId) {
  const payload = {
    name: document.getElementById('category-name').value.trim(),
    description: document.getElementById('category-description').value.trim()
  };

  try {
    if (categoryId) {
      await window.AdminApp.request(`/categories/${categoryId}`, { method: 'PUT', body: payload });
      window.AdminApp.showToast('Đã cập nhật danh mục.');
    } else {
      await window.AdminApp.request('/categories', { method: 'POST', body: payload });
      window.AdminApp.showToast('Đã tạo danh mục.');
    }

    closeGlobalModal();
    await loadFoodsData();
  } catch (error) {
    window.AdminApp.showToast(error.message || 'Không thể lưu danh mục.', 'error');
  }
}

async function deleteCategory(categoryId) {
  if (!window.AdminApp.confirmAction('Xóa danh mục sẽ thất bại nếu còn món ăn tham chiếu tới danh mục này. Bạn vẫn muốn tiếp tục chứ?')) {
    return;
  }

  try {
    await window.AdminApp.request(`/categories/${categoryId}`, { method: 'DELETE' });
    if (foodsState.categoryFilter === String(categoryId)) {
      foodsState.categoryFilter = '';
    }
    window.AdminApp.showToast('Đã xóa danh mục.');
    await loadFoodsData();
  } catch (error) {
    window.AdminApp.showToast(error.message || 'Không thể xóa danh mục.', 'error');
  }
}
