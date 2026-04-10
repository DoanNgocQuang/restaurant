const SYSTEM_LOG_API = "http://localhost:8080/api/system-logs";

function initSystemLog() {
  renderHistory();
  initSearchDebounce();
}

// ================= FETCH + RENDER =================
async function renderHistory(page = 0) {
  const tbody = document.getElementById('history-tbody');
  const pagination = document.getElementById('pagination');

  const keyword = document.getElementById('history-search').value.trim();
  const action = document.getElementById('history-action').value;
  const from = document.getElementById('history-start').value;
  const to = document.getElementById('history-end').value;

  // loading state
  tbody.innerHTML = `
    <tr>
      <td colspan="4" class="text-center py-4 text-slate-500">
        Loading...
      </td>
    </tr>
  `;

  try {
    // build params sạch
    const params = new URLSearchParams({
      page,
      size: 10,
      sort: "loggedAt,desc"
    });

    if (keyword) params.append("keyword", keyword);
    if (action) params.append("action", action);
    if (from) params.append("from", from);
    if (to) params.append("to", to);

    const res = await fetch(`${SYSTEM_LOG_API}?${params}`);
    const json = await res.json();

    const logs = json.data.content;

    // empty state
    if (!logs || logs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="text-center py-4 text-slate-500">
            Không có dữ liệu
          </td>
        </tr>
      `;
      pagination.innerHTML = '';
      return;
    }

    let html = '';

    logs.forEach(item => {
      const actionLabelMap = {
        CREATE: "Thêm mới",
        UPDATE: "Cập nhật",
        DELETE: "Xóa",
        LOGIN: "Đăng nhập",
        OTHER: "Khác"
      };

      const actionLabel = actionLabelMap[item.action] || item.action;

      let actionClass = '';
      switch (actionLabel) {
        case 'Thêm mới':
          actionClass = 'bg-green-100 text-green-800';
          break;
        case 'Cập nhật':
          actionClass = 'bg-blue-100 text-blue-800';
          break;
        case 'Xóa':
          actionClass = 'bg-red-100 text-red-800';
          break;
        case 'Đăng nhập':
          actionClass = 'bg-purple-100 text-purple-800';
          break;
        default:
          actionClass = 'bg-slate-100 text-slate-800';
      }

      const formattedTime = new Date(item.loggedAt).toLocaleString('vi-VN');

      html += `
        <tr class="hover:bg-slate-50 transition">
          <td class="px-6 py-4 text-sm text-slate-500">
            ${formattedTime}
          </td>
          <td class="px-6 py-4 text-sm font-medium text-slate-900">
            ${item.userEmail || 'System'}
          </td>
          <td class="px-6 py-4">
            <span class="px-2 py-1 rounded text-xs font-semibold ${actionClass}">
              ${actionLabel}
            </span>
          </td>
          <td class="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title="${item.detail}">
            ${item.detail}
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;

    renderPagination(json.data);

  } catch (err) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-4 text-red-500">
          Lỗi tải dữ liệu
        </td>
      </tr>
    `;
    console.error(err);
  }
}

// ================= PAGINATION =================
function renderPagination(pageData) {
  const container = document.getElementById('pagination');
  if (!container) return;

  const { totalPages, number } = pageData;

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';

  // Prev
  if (number > 0) {
    html += `
      <button onclick="renderHistory(${number - 1})"
        class="px-3 py-1 rounded bg-slate-200">
        ←
      </button>
    `;
  }

  // Pages (limit 5)
  const start = Math.max(0, number - 2);
  const end = Math.min(totalPages, number + 3);

  for (let i = start; i < end; i++) {
    html += `
      <button onclick="renderHistory(${i})"
        class="px-3 py-1 rounded ${
          i === number ? 'bg-indigo-600 text-white' : 'bg-slate-200'
        }">
        ${i + 1}
      </button>
    `;
  }

  // Next
  if (number < totalPages - 1) {
    html += `
      <button onclick="renderHistory(${number + 1})"
        class="px-3 py-1 rounded bg-slate-200">
        →
      </button>
    `;
  }

  container.innerHTML = html;
}

// ================= SEARCH DEBOUNCE =================
function initSearchDebounce() {
  let timer;

  const searchInput = document.getElementById('history-search');

  searchInput.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      renderHistory(0);
    }, 500);
  });
}

window.initSystemLog = initSystemLog;