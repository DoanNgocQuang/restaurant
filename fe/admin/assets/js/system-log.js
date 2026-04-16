const systemLogState = {
  page: 0,
  searchTimer: null
};

async function initSystemLog() {
  bindSystemLogEvents();
  window.AdminApp.configureGlobalSearch({
    placeholder: 'Tìm nhanh trong log hệ thống...',
    handler: (value) => {
      const searchInput = document.getElementById('history-search');
      if (searchInput) {
        searchInput.value = value;
      }
      debounceRenderHistory();
    }
  });
  await renderHistory(0);
}

function bindSystemLogEvents() {
  const searchInput = document.getElementById('history-search');
  const actionInput = document.getElementById('history-action');
  const startInput = document.getElementById('history-start');
  const endInput = document.getElementById('history-end');

  if (searchInput && !searchInput.dataset.bound) {
    searchInput.dataset.bound = 'true';
    searchInput.addEventListener('input', debounceRenderHistory);
  }

  [actionInput, startInput, endInput].forEach((element) => {
    if (element && !element.dataset.bound) {
      element.dataset.bound = 'true';
      element.addEventListener('change', () => renderHistory(0));
    }
  });
}

function debounceRenderHistory() {
  window.clearTimeout(systemLogState.searchTimer);
  systemLogState.searchTimer = window.setTimeout(() => {
    renderHistory(0);
  }, 350);
}

async function renderHistory(page = 0) {
  systemLogState.page = page;
  const tbody = document.getElementById('history-tbody');
  const pagination = document.getElementById('pagination');

  if (!tbody || !pagination) return;
  tbody.innerHTML = window.AdminApp.renderTableMessage(4, 'Đang tải log hệ thống...');

  const params = new URLSearchParams({
    page: String(page),
    size: '10',
    sort: 'loggedAt,desc'
  });

  const keyword = document.getElementById('history-search')?.value.trim();
  const action = document.getElementById('history-action')?.value;
  const from = document.getElementById('history-start')?.value;
  const to = document.getElementById('history-end')?.value;

  if (keyword) params.append('keyword', keyword);
  if (action) params.append('action', action);
  if (from) params.append('from', from);
  if (to) params.append('to', to);

  try {
    const pageData = await window.AdminApp.request(`/system-logs?${params.toString()}`);
    const logs = pageData?.content || [];

    if (logs.length === 0) {
      tbody.innerHTML = window.AdminApp.renderTableMessage(4, 'Không có log hệ thống phù hợp.');
      pagination.innerHTML = '';
      return;
    }

    tbody.innerHTML = logs.map((item) => {
      const colorMap = {
        CREATE: 'bg-emerald-100 text-emerald-700',
        UPDATE: 'bg-blue-100 text-blue-700',
        DELETE: 'bg-rose-100 text-rose-700',
        LOGIN: 'bg-violet-100 text-violet-700',
        OTHER: 'bg-slate-100 text-slate-700'
      };

      return `
        <tr class="hover:bg-slate-50 transition">
          <td class="px-6 py-4 text-sm text-slate-500">${window.AdminApp.formatDateTime(item.loggedAt)}</td>
          <td class="px-6 py-4 text-sm font-medium text-slate-900">${window.AdminApp.escapeHtml(item.userEmail || 'System')}</td>
          <td class="px-6 py-4">
            <span class="rounded px-2 py-1 text-xs font-semibold ${colorMap[item.action] || colorMap.OTHER}">
              ${window.AdminApp.escapeHtml(item.action || 'OTHER')}
            </span>
          </td>
          <td class="px-6 py-4 text-sm text-slate-500 max-w-xl truncate" title="${window.AdminApp.escapeHtml(item.detail || '')}">${window.AdminApp.escapeHtml(item.detail || '--')}</td>
        </tr>
      `;
    }).join('');

    renderPagination(pageData);
  } catch (error) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(4, error.message || 'Không thể tải log hệ thống.', 'error');
    pagination.innerHTML = '';
  }
}

function renderPagination(pageData) {
  const container = document.getElementById('pagination');
  if (!container) return;

  const totalPages = pageData?.totalPages || 0;
  const number = pageData?.number || 0;

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';
  if (number > 0) {
    html += `<button onclick="renderHistory(${number - 1})" class="rounded bg-slate-200 px-3 py-1 text-sm">←</button>`;
  }

  const start = Math.max(0, number - 2);
  const end = Math.min(totalPages, number + 3);
  for (let index = start; index < end; index += 1) {
    html += `
      <button onclick="renderHistory(${index})" class="rounded px-3 py-1 text-sm ${index === number ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700'}">
        ${index + 1}
      </button>
    `;
  }

  if (number < totalPages - 1) {
    html += `<button onclick="renderHistory(${number + 1})" class="rounded bg-slate-200 px-3 py-1 text-sm">→</button>`;
  }

  container.innerHTML = html;
}

window.initSystemLog = initSystemLog;
