const API = '/comments';

const commentsState = {
  comments: [],
  query: '',
  statusFilter: '',
  sortFilter: 'newest',
  page: 1,
  pageSize: 10
};

async function initComments() {
  resetCommentsState();
  bindCommentsEvents();
  bindGlobalSearch();
  await loadCommentsData();
}

function resetCommentsState() {
  commentsState.query = '';
  commentsState.statusFilter = '';
  commentsState.sortFilter = 'newest';
  commentsState.page = 1;
}

function bindCommentsEvents() {
  const statusFilter = document.getElementById('comment-status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
      commentsState.statusFilter = e.target.value;
      commentsState.page = 1;
      renderCommentsTable();
    });
  }

  const sortFilter = document.getElementById('comment-sort-filter');
  if (sortFilter) {
    sortFilter.addEventListener('change', (e) => {
      commentsState.sortFilter = e.target.value;
      commentsState.page = 1;
      renderCommentsTable();
    });
  }
}

function bindGlobalSearch() {
  window.AdminApp.configureGlobalSearch({
    placeholder: 'Tìm bình luận, người dùng, món ăn...',
    value: '',
    handler: (value) => {
      commentsState.query = (value || '').toLowerCase().trim();
      commentsState.page = 1;
      renderCommentsTable();
    }
  });
}

async function loadCommentsData() {
  const tbody = document.getElementById('comments-tbody');

  if (tbody) {
    tbody.innerHTML = skeletonLoading();
  }

  try {
    const res = await window.AdminApp.request(API);
    commentsState.comments = Array.isArray(res?.data) ? res.data : res || [];

    renderCommentStats();
    renderCommentsTable();
  } catch (error) {
    if (tbody) {
      tbody.innerHTML = window.AdminApp.renderTableMessage(
        7,
        error.message || 'Không thể tải bình luận.',
        'error'
      );
    }
  }
}

function renderCommentStats() {
  const all = commentsState.comments;

  document.getElementById('comments-total').textContent = all.length;

  document.getElementById('comments-active').textContent =
    all.filter(x => x.status === 'ACTIVE').length;

  document.getElementById('comments-hidden').textContent =
    all.filter(x => x.status === 'HIDDEN').length;
}

function getFilteredComments() {
  return commentsState.comments
    .filter((c) => {
      const matchStatus =
        !commentsState.statusFilter || c.status === commentsState.statusFilter;

      const text = [
        c.userName,
        c.content,
        c.foodName,
        c.comboName
      ].join(' ').toLowerCase();

      const matchQuery =
        !commentsState.query || text.includes(commentsState.query);

      return matchStatus && matchQuery;
    })
    .sort((a, b) => {
      switch (commentsState.sortFilter) {
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'rating_high':
          return (b.rating || 0) - (a.rating || 0);
        case 'rating_low':
          return (a.rating || 0) - (b.rating || 0);
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });
}

function renderCommentsTable() {
  const tbody = document.getElementById('comments-tbody');
  const pagination = document.getElementById('comments-pagination');
  if (!tbody) return;

  const data = getFilteredComments();

  if (data.length === 0) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(
      7,
      'Không có bình luận phù hợp.'
    );
    if (pagination) pagination.innerHTML = '';
    return;
  }

  const meta = window.AdminPagination.render({
    containerId: 'comments-pagination',
    items: data,
    currentPage: commentsState.page,
    pageSize: commentsState.pageSize,
    onPageChange: (page) => {
      commentsState.page = page;
      renderCommentsTable();
    }
  });

  commentsState.page = meta.page;

  tbody.innerHTML = meta.items.map(renderCommentRow).join('');
}

function renderCommentRow(comment) {
  if (!comment) return '';

  const active = comment.status === 'ACTIVE';
  const itemName = comment.foodName || comment.comboName || 'Không xác định';

  return `
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">

      <td class="px-6 py-4 font-semibold text-slate-900 dark:text-white">
        ${escapeHtml(comment.userName || '')}
      </td>

      <td class="px-6 py-4 text-slate-700 dark:text-slate-200">
        ${escapeHtml(itemName)}
      </td>

      <td class="px-6 py-4">
        ${renderStars(comment.rating || 0)}
      </td>

      <td class="px-6 py-4 max-w-xs">
        <p class="line-clamp-2 text-slate-600 dark:text-slate-300">
          ${escapeHtml(comment.content || '')}
        </p>
      </td>

      <td class="px-6 py-4 text-sm text-slate-500">
        ${window.AdminApp?.formatDate?.(comment.created_at) || '--'}
      </td>

      <td class="px-6 py-4">
        ${renderStatus(active)}
      </td>

      <td class="px-6 py-4 text-right">
        ${renderActions(comment, active)}
      </td>

    </tr>
  `;
}

function renderStars(rating = 0) {
  const full = Math.round(Math.max(0, Math.min(5, rating)));

  let html = `<div class="flex gap-0.5">`;

  for (let i = 1; i <= 5; i++) {
    html += `
      <svg class="w-4 h-4 ${i <= full ? 'text-amber-400' : 'text-slate-300'}"
        fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44 1.286 3.955c.3.921-.755 1.688-1.54 1.118L10 13.348l-3.36 2.857c-.784.57-1.838-.197-1.539-1.118l1.286-3.955-3.36-2.44c-.784-.57-.38-1.81.588-1.81h4.15l1.286-3.955z"/>
      </svg>
    `;
  }

  html += `</div>`;
  return html;
}

function renderStatus(active) {
  return `
    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
      ${active
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
        : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}">

      <span class="w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-400'}"></span>
      ${active ? 'Active' : 'Hidden'}
    </span>
  `;
}

function renderActions(comment, active) {
  return `
    <div class="flex justify-end gap-2">

      ${
        active
          ? `<button class="px-3 py-1.5 text-xs rounded-lg bg-amber-100 text-amber-700"
              onclick="hideComment(${comment.id})">Ẩn</button>`
          : `<button class="px-3 py-1.5 text-xs rounded-lg bg-emerald-100 text-emerald-700"
              onclick="showComment(${comment.id})">Hiện</button>`
      }

      <button class="px-3 py-1.5 text-xs rounded-lg bg-indigo-100 text-indigo-700"
        onclick="viewComment(${comment.id})">Xem</button>

    </div>
  `;
}

async function hideComment(id) {
  try {
    await window.AdminApp.request(`${API}/${id}/status?status=HIDDEN`, {
      method: 'PUT'
    });

    const c = commentsState.comments.find(x => x.id == id);
    if (c) c.status = 'HIDDEN';

    renderCommentStats();
    renderCommentsTable();

    window.AdminApp?.toast?.success?.('Đã ẩn bình luận');
  } catch (err) {
    window.AdminApp?.toast?.error?.('Không thể ẩn bình luận');
  }
}

async function showComment(id) {
  try {
    await window.AdminApp.request(`${API}/${id}/status?status=ACTIVE`, {
      method: 'PUT'
    });

    const c = commentsState.comments.find(x => x.id == id);
    if (c) c.status = 'ACTIVE';

    renderCommentStats();
    renderCommentsTable();

    window.AdminApp?.toast?.success?.('Đã hiển thị bình luận');
  } catch (err) {
    window.AdminApp?.toast?.error?.('Không thể hiển thị bình luận');
  }
}

function viewComment(id) {
  const c = commentsState.comments.find(x => x.id == id);
  if (!c) return;

  const active = c.status === 'ACTIVE';
  const itemName = c.foodName || c.comboName || 'Không xác định';

  window.openGlobalModal(
    'Chi tiết bình luận',
    `
      <div class="space-y-4 text-sm">

        <div>
          <p class="font-bold">${escapeHtml(c.userName || '')}</p>
          <p class="text-xs text-slate-500">${itemName}</p>
        </div>

        <div class="p-4 rounded-xl border-l-4 border-indigo-400 bg-slate-50 dark:bg-slate-900">
          <p class="text-xs text-slate-500 mb-2">Nội dung</p>
          <p class="whitespace-pre-line break-words">
            ${escapeHtml((c.content || '').trim())}
          </p>
        </div>

        <div class="flex justify-between items-center p-4 border rounded-xl">
          <span class="text-xs text-slate-500">Đánh giá</span>
          <div class="flex items-center gap-2">
            ${renderStars(c.rating || 0)}
            <span>${c.rating || 0}/5</span>
          </div>
        </div>

        <div class="text-xs text-slate-500 flex justify-between">
          <span>${window.AdminApp?.formatDate?.(c.created_at) || '--'}</span>
          <span>ID: #${c.id}</span>
        </div>

      </div>
    `,
    ''
  );
}

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function skeletonLoading() {
  return `
    <tr>
      <td colspan="7" class="p-4">
        <div class="animate-pulse space-y-2">
          <div class="h-4 bg-slate-200 rounded w-full"></div>
          <div class="h-4 bg-slate-200 rounded w-3/4"></div>
          <div class="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </td>
    </tr>
  `;
}

window.addEventListener('DOMContentLoaded', initComments);

window.initComments = initComments;
window.hideComment = hideComment;
window.showComment = showComment;
window.viewComment = viewComment;