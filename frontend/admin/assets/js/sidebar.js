function initSidebar() {
  const statsMenuBtn = document.getElementById('stats-menu-btn');
  const statsSubMenu = document.getElementById('stats-sub-menu');
  const statsMenuIcon = document.getElementById('stats-menu-icon');

  if (statsMenuBtn && statsSubMenu && statsMenuIcon) {
    statsMenuBtn.addEventListener('click', () => {
      statsSubMenu.classList.toggle('hidden');
      if (statsSubMenu.classList.contains('hidden')) {
        statsMenuIcon.style.transform = 'rotate(0deg)';
      } else {
        statsMenuIcon.style.transform = 'rotate(180deg)';
      }
    });
  }

  // Profile dropdown
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!profileBtn.contains(e.target) && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.add('hidden');
      }
    });
  }
}
