function openGlobalModal(title, contentHTML, footerHTML) {
  const modal = document.getElementById('global-modal');
  const titleEl = document.getElementById('global-modal-title');
  const contentEl = document.getElementById('global-modal-content');
  const footerEl = document.getElementById('global-modal-footer');

  if (!modal || !titleEl || !contentEl || !footerEl) return;

  titleEl.innerText = title;
  contentEl.innerHTML = contentHTML;
  footerEl.innerHTML = footerHTML;

  modal.classList.remove('hidden');
}

function closeGlobalModal() {
  const modal = document.getElementById('global-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}
