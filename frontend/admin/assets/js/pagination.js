const AdminPagination = (() => {
  function clampPage(page, totalPages) {
    if (totalPages <= 0) {
      return 1;
    }

    return Math.min(Math.max(Number(page) || 1, 1), totalPages);
  }

  function paginate(items, currentPage = 1, pageSize = 10) {
    const safeItems = Array.isArray(items) ? items : [];
    const safePageSize = Math.max(Number(pageSize) || 10, 1);
    const totalItems = safeItems.length;
    const totalPages = Math.max(Math.ceil(totalItems / safePageSize), 1);
    const page = clampPage(currentPage, totalPages);
    const startIndex = totalItems === 0 ? 0 : (page - 1) * safePageSize;
    const endIndex = Math.min(startIndex + safePageSize, totalItems);

    return {
      items: safeItems.slice(startIndex, endIndex),
      page,
      pageSize: safePageSize,
      totalItems,
      totalPages,
      startIndex,
      endIndex
    };
  }

  function buildButton(label, page, isActive, isDisabled) {
    const baseClass = 'inline-flex min-w-10 items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold transition-colors';
    const activeClass = isActive
      ? 'border-primary bg-primary text-white shadow-sm'
      : 'border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-primary dark:hover:text-white';
    const disabledClass = isDisabled
      ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-500'
      : activeClass;

    return `
      <button
        type="button"
        class="${baseClass} ${disabledClass}"
        data-page="${page}"
        ${isDisabled ? 'disabled' : ''}
      >
        ${label}
      </button>
    `;
  }

  function getVisiblePages(currentPage, totalPages) {
    const pages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
    return Array.from(pages)
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((left, right) => left - right);
  }

  function render({
    containerId,
    items,
    currentPage = 1,
    pageSize = 10,
    onPageChange
  }) {
    const container = document.getElementById(containerId);
    const meta = paginate(items, currentPage, pageSize);

    if (!container) {
      return meta;
    }

    if (meta.totalItems === 0) {
      container.innerHTML = '';
      return meta;
    }

    if (meta.totalPages <= 1) {
      container.innerHTML = `
        <div class="flex items-center justify-end px-1 text-sm text-slate-500 dark:text-slate-400">
          Hiển thị ${meta.totalItems} bản ghi
        </div>
      `;
      return meta;
    }

    const pages = getVisiblePages(meta.page, meta.totalPages);
    let pageButtons = '';

    pages.forEach((page, index) => {
      const previous = pages[index - 1];
      if (previous && page - previous > 1) {
        pageButtons += '<span class="px-1 text-slate-400">...</span>';
      }

      pageButtons += buildButton(page, page, page === meta.page, false);
    });

    container.innerHTML = `
      <div class="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-sm text-slate-500 dark:text-slate-400">
          Hiển thị ${meta.startIndex + 1}-${meta.endIndex} / ${meta.totalItems} bản ghi
        </p>
        <div class="flex flex-wrap items-center gap-2">
          ${buildButton('Trước', meta.page - 1, false, meta.page === 1)}
          ${pageButtons}
          ${buildButton('Tiếp', meta.page + 1, false, meta.page === meta.totalPages)}
        </div>
      </div>
    `;

    container.querySelectorAll('button[data-page]').forEach((button) => {
      if (button.disabled) {
        return;
      }

      button.addEventListener('click', () => {
        if (typeof onPageChange === 'function') {
          onPageChange(Number(button.dataset.page));
        }
      });
    });

    return meta;
  }

  return {
    paginate,
    render
  };
})();

window.AdminPagination = AdminPagination;
