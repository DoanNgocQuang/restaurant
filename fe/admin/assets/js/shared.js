const AdminApp = (() => {
  const API_BASE = 'http://localhost:8080/api';
  const toastRootId = 'admin-toast-root';
  const defaultAvatar = 'https://ui-avatars.com/api/?name=Admin&background=800020&color=fff';
  let globalSearchHandler = null;
  let globalSearchBound = false;

  function safeJsonParse(value, fallback = null) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function getStoredUser() {
    return safeJsonParse(localStorage.getItem('user'), null);
  }

  function getToken() {
    return localStorage.getItem('token');
  }

  function requireAdmin() {
    const user = getStoredUser();
    if (!user || user.role !== 'ADMIN') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '../pages/login.html';
      return false;
    }
    return true;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function createToastRoot() {
    if (document.getElementById(toastRootId)) {
      return;
    }

    const root = document.createElement('div');
    root.id = toastRootId;
    root.className = 'fixed top-4 right-4 z-[70] flex max-w-sm flex-col gap-3';
    document.body.appendChild(root);
  }

  function showToast(message, type = 'success') {
    createToastRoot();
    const root = document.getElementById(toastRootId);
    const toast = document.createElement('div');
    const palette = {
      success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
      error: 'border-rose-200 bg-rose-50 text-rose-900',
      info: 'border-slate-200 bg-white text-slate-900'
    };

    toast.className = `rounded-2xl border px-4 py-3 text-sm shadow-lg backdrop-blur transition-all ${palette[type] || palette.info}`;
    toast.innerHTML = `
      <div class="flex items-start gap-3">
        <span class="material-symbols-outlined text-base leading-none">${type === 'error' ? 'error' : 'check_circle'}</span>
        <p class="leading-6">${escapeHtml(message)}</p>
      </div>
    `;

    root.appendChild(toast);

    window.setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-8px)';
    }, 2800);

    window.setTimeout(() => {
      toast.remove();
    }, 3200);
  }

  function normalizeApiError(payload, fallbackMessage) {
    if (!payload) {
      return fallbackMessage;
    }

    if (typeof payload.message === 'string' && payload.message.trim()) {
      if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) {
        const details = Object.values(payload.data).filter(Boolean);
        if (details.length > 0) {
          return `${payload.message}: ${details.join(', ')}`;
        }
      }
      return payload.message;
    }

    return fallbackMessage;
  }

  async function request(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    const token = getToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok || payload?.status === 'error') {
      const error = new Error(normalizeApiError(payload, `Yêu cầu thất bại (${response.status})`));
      error.payload = payload;
      error.status = response.status;
      throw error;
    }

    return payload?.data;
  }

  function formatCurrency(value) {
    const amount = Number(value || 0);
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  }

  function formatNumber(value) {
    return new Intl.NumberFormat('vi-VN').format(Number(value || 0));
  }

  function formatDateTime(value) {
    if (!value) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  function formatDate(value) {
    if (!value) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  function formatDateTimeLocal(value) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  function toApiDateTime(value) {
    if (!value) return null;
    return `${value}:00`;
  }

  function setLoading(containerId, message = 'Đang tải dữ liệu...') {
    const target = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
    if (!target) return;
    target.innerHTML = `<div class="px-6 py-8 text-center text-sm text-slate-500">${escapeHtml(message)}</div>`;
  }

  function renderTableMessage(colspan, message, tone = 'muted') {
    const toneClass = tone === 'error' ? 'text-rose-500' : 'text-slate-500';
    return `
      <tr>
        <td colspan="${colspan}" class="px-6 py-10 text-center text-sm ${toneClass}">
          ${escapeHtml(message)}
        </td>
      </tr>
    `;
  }

  function confirmAction(message) {
    return window.confirm(message);
  }

  function bindGlobalSearchInput() {
    if (globalSearchBound) {
      return;
    }

    const input = document.querySelector('#global-search-container input');
    if (!input) {
      return;
    }

    input.addEventListener('input', (event) => {
      if (typeof globalSearchHandler === 'function') {
        globalSearchHandler(event.target.value.trim());
      }
    });

    globalSearchBound = true;
  }

  function configureGlobalSearch({ placeholder = 'Tìm kiếm...', handler = null, value = '' } = {}) {
    bindGlobalSearchInput();
    const input = document.querySelector('#global-search-container input');
    if (!input) return;

    globalSearchHandler = handler;
    input.placeholder = placeholder;
    input.value = value;
  }

  function clearGlobalSearch() {
    configureGlobalSearch({ handler: null, value: '' });
  }

  function hydrateShell() {
    const user = getStoredUser();
    if (!user) return;

    const fullName = user.fullname || 'Quản trị viên';
    const role = user.role === 'ADMIN' ? 'Administrator' : user.role || 'Staff';
    const avatarUrl = `${defaultAvatar}&name=${encodeURIComponent(fullName)}`;

    document.querySelectorAll('[data-admin-fullname]').forEach((node) => {
      node.textContent = fullName;
    });
    document.querySelectorAll('[data-admin-role]').forEach((node) => {
      node.textContent = role;
    });
    document.querySelectorAll('[data-admin-email]').forEach((node) => {
      node.textContent = user.email || '--';
    });
    document.querySelectorAll('[data-admin-phone]').forEach((node) => {
      node.textContent = user.phone || '--';
    });
    document.querySelectorAll('[data-admin-avatar]').forEach((node) => {
      node.src = avatarUrl;
      node.alt = fullName;
    });

    const logoutButton = document.getElementById('admin-logout-btn');
    if (logoutButton && !logoutButton.dataset.bound) {
      logoutButton.dataset.bound = 'true';
      logoutButton.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '../pages/login.html';
      });
    }
  }

  return {
    API_BASE,
    clearGlobalSearch,
    confirmAction,
    configureGlobalSearch,
    escapeHtml,
    formatCurrency,
    formatDate,
    formatDateTime,
    formatDateTimeLocal,
    formatNumber,
    getStoredUser,
    hydrateShell,
    renderTableMessage,
    request,
    requireAdmin,
    setLoading,
    showToast,
    toApiDateTime
  };
})();

window.AdminApp = AdminApp;
