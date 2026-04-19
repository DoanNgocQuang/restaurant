function openGlobalModal(title, contentHTML, footerHTML, panelClassName = 'max-w-md') {
  const modal = document.getElementById('global-modal');
  const panelEl = document.getElementById('global-modal-panel');
  const titleEl = document.getElementById('global-modal-title');
  const contentEl = document.getElementById('global-modal-content');
  const footerEl = document.getElementById('global-modal-footer');

  if (!modal || !panelEl || !titleEl || !contentEl || !footerEl) return;

  titleEl.innerText = title;
  contentEl.innerHTML = contentHTML;
  footerEl.innerHTML = footerHTML;
  panelEl.className = `bg-white dark:bg-slate-800 w-full rounded-2xl shadow-xl overflow-hidden ${panelClassName}`;

  modal.classList.remove('hidden');
}

function closeGlobalModal() {
  const modal = document.getElementById('global-modal');
  const panelEl = document.getElementById('global-modal-panel');
  if (modal) {
    modal.classList.add('hidden');
  }
  if (panelEl) {
    panelEl.className = 'bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-xl overflow-hidden';
  }
}
