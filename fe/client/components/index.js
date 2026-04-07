export function renderNavbar() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const currentPath = window.location.pathname;
  const isDarkPage = ['/pages/login.html', '/pages/register.html', '/pages/reservations.html'].includes(currentPath);
  
  const navClass = isDarkPage ? "bg-bg-dark/80 text-white" : "bg-bg-light/80 text-slate-900";

  const navbarHTML = `
    <header class="sticky top-0 z-50 w-full border-b border-primary/20 backdrop-blur-md transition-colors ${navClass}">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-20 items-center justify-between">
          <a href="/pages/index.html" class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
            <h1 class="text-xl font-black uppercase tracking-widest text-primary">L'Elite</h1>
          </a>
          
          <nav class="hidden md:flex items-center gap-8">
            <a href="/pages/index.html" class="text-sm font-medium transition-colors hover:text-primary ${currentPath === '/pages/index.html' || currentPath === '/pages/index.html' ? 'text-primary border-b-2 border-primary' : ''}">Trang chủ</a>
            <a href="/pages/menu.html" class="text-sm font-medium transition-colors hover:text-primary ${currentPath === '/pages/menu.html' ? 'text-primary border-b-2 border-primary' : ''}">Thực đơn</a>
            <a href="/pages/reservations.html" class="text-sm font-medium transition-colors hover:text-primary ${currentPath === '/pages/reservations.html' ? 'text-primary border-b-2 border-primary' : ''}">Đặt bàn</a>
          </nav>

          <div class="flex items-center gap-4">
            ${isLoggedIn ? `
              <a href="/pages/cart.html" class="p-2 hover:bg-black/5 rounded-md transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </a>
              <a href="/pages/profile.html" class="p-2 hover:bg-black/5 rounded-md transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </a>
              <a href="/pages/reservations.html" class="hidden sm:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 text-white">Đặt bàn ngay</a>
            ` : `
              <a href="/pages/login.html" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 border-primary text-primary">Đăng nhập</a>
            `}
            <button class="md:hidden p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
  const container = document.getElementById('navbar-container');
  if (container) container.innerHTML = navbarHTML;
}

export function renderFooter() {
  const footerHTML = `
    <footer class="bg-bg-dark text-slate-300 py-12 border-t border-white/10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
            <h2 class="text-xl font-black uppercase tracking-widest text-primary">L'Elite</h2>
          </div>
          <p class="text-sm">Trải nghiệm tinh hoa ẩm thực thượng lưu với không gian sang trọng và dịch vụ đẳng cấp.</p>
        </div>
        <div>
          <h3 class="font-bold text-white mb-4 uppercase tracking-wider text-sm">Liên kết</h3>
          <ul class="space-y-2 text-sm">
            <li><a href="/pages/index.html" class="hover:text-primary transition-colors">Trang chủ</a></li>
            <li><a href="/pages/menu.html" class="hover:text-primary transition-colors">Thực đơn</a></li>
            <li><a href="/pages/reservations.html" class="hover:text-primary transition-colors">Đặt bàn</a></li>
          </ul>
        </div>
        <div>
          <h3 class="font-bold text-white mb-4 uppercase tracking-wider text-sm">Liên hệ</h3>
          <ul class="space-y-2 text-sm">
            <li>123 Đường Ẩm Thực, Quận 1, TP.HCM</li>
            <li>+84 123 456 789</li>
            <li>contact@lelite.com</li>
          </ul>
        </div>
        <div>
          <h3 class="font-bold text-white mb-4 uppercase tracking-wider text-sm">Giờ mở cửa</h3>
          <ul class="space-y-2 text-sm">
            <li>Thứ 2 - Thứ 6: 10:00 - 22:00</li>
            <li>Thứ 7 - Chủ Nhật: 09:00 - 23:00</li>
          </ul>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-white/10 text-center text-sm">
        <p>&copy; 2026 L'Elite Gourmet. All rights reserved.</p>
      </div>
    </footer>
  `;
  const container = document.getElementById('footer-container');
  if (container) container.innerHTML = footerHTML;
}
