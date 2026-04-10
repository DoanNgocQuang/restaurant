import { renderNavbar, renderFooter } from '../components/index.js';

let activeTab = 'reservations';
let isEditing = false;

const navItems = [
  { id: 'reservations', label: 'Lịch sử đặt bàn', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>' },
  { id: 'orders', label: 'Lịch sử đơn hàng', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' },
  { id: 'offers', label: 'Ưu đãi của tôi', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>' },
  { id: 'edit', label: 'Chỉnh sửa thông tin', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>' },
];

function renderProfileNav() {
  const navContainer = document.getElementById('profile-nav');
  if (!navContainer) return;

  navContainer.innerHTML = `
    ${navItems.map(item => `
      <button 
        class="nav-btn w-full flex items-center justify-between p-4 transition-colors ${activeTab === item.id ? 'bg-primary text-white' : 'hover:bg-primary/5'}"
        data-id="${item.id}"
      >
        <div class="flex items-center gap-3">
          ${item.icon}
          <span class="font-medium">${item.label}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${activeTab === item.id ? 'text-white' : 'text-slate-400'}"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    `).join('')}
    <button 
      id="btn-logout"
      class="w-full flex items-center justify-between p-4 transition-colors hover:bg-primary/5 text-red-500"
    >
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        <span class="font-medium">Đăng xuất</span>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><path d="m9 18 6-6-6-6"/></svg>
    </button>
  `;

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      activeTab = e.currentTarget.getAttribute('data-id');
      isEditing = false;
      renderProfileNav();
      renderProfileContent();
    });
  });

  document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/pages/login.html';
  });
}

function renderProfileContent() {
  const contentContainer = document.getElementById('profile-content');
  if (!contentContainer) return;

  let html = '';

  if (activeTab === 'reservations') {
    const reservations = [
      { date: '15/05/2026', time: '19:00', guests: 4, status: 'Hoàn thành', code: '#RES-12345' },
      { date: '20/06/2026', time: '20:30', guests: 2, status: 'Sắp tới', active: true, code: '#RES-12346' }
    ];
    html = `
      <section class="bg-white dark:bg-primary/5 rounded-2xl p-8 border border-primary/10 shadow-xl animate-fade-in-up">
        <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> Lịch sử đặt bàn
        </h3>
        <div class="space-y-4">
          ${reservations.map(res => `
            <div class="p-4 rounded-xl border ${res.active ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-primary/10'} flex flex-col md:flex-row justify-between items-center gap-4">
              <div class="flex items-center gap-4">
                <div class="size-12 rounded-lg flex items-center justify-center ${res.active ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-primary/20 text-slate-500'}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                </div>
                <div>
                  <h4 class="font-bold">${res.date} - ${res.time}</h4>
                  <p class="text-sm text-slate-500">${res.guests} khách • ${res.code}</p>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase ${res.active ? 'bg-primary text-white' : 'bg-green-100 text-green-600'}">
                  ${res.status}
                </span>
                <button class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">Chi tiết</button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  } else if (activeTab === 'orders') {
    html = `
      <section class="bg-white dark:bg-primary/5 rounded-2xl p-8 border border-primary/10 shadow-xl animate-fade-in-up">
        <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="text-primary">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
            <path d="M3 6h18"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Lịch sử đơn hàng
        </h3>

        <div id="order-list" class="space-y-4">
          <p class="text-slate-400">Đang tải...</p>
        </div>
      </section>
    `;

    contentContainer.innerHTML = html;

    loadOrders();
  } else if (activeTab === 'offers') {
    const offers = [
      { title: 'Giảm 20% Tháng Sinh Nhật', desc: 'Áp dụng cho hóa đơn trên $100', expiry: '31/03/2026', code: 'BDAY2026' },
      { title: 'Tặng Tráng Miệng', desc: 'Khi đặt bàn trước 2 ngày', expiry: '15/04/2026', code: 'SWEET' }
    ];
    html = `
      <section class="bg-white dark:bg-primary/5 rounded-2xl p-8 border border-primary/10 shadow-xl animate-fade-in-up">
        <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Ưu đãi của tôi
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${offers.map(offer => `
            <div class="p-5 rounded-xl border border-primary/20 bg-primary/5 relative overflow-hidden">
              <div class="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase">
                Mới
              </div>
              <div class="flex items-start gap-3 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary shrink-0"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
                <div>
                  <h4 class="font-bold text-lg leading-tight">${offer.title}</h4>
                  <p class="text-sm text-slate-500 mt-1">${offer.desc}</p>
                </div>
              </div>
              <div class="flex items-center justify-between mt-4 pt-4 border-t border-primary/10">
                <span class="text-xs text-slate-500">HSD: ${offer.expiry}</span>
                <span class="font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">${offer.code}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  } else if (activeTab === 'edit') {
    html = `
      <section class="bg-white dark:bg-primary/5 rounded-2xl p-8 border border-primary/10 shadow-xl animate-fade-in-up">
        <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg> Chỉnh sửa thông tin
        </h3>
        
        ${!isEditing ? `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Họ và tên</label>
              <div class="flex items-center gap-2 text-lg font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> Nguyễn Văn A
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Số điện thoại</label>
              <div class="flex items-center gap-2 text-lg font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> +84 901 234 567
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
              <div class="flex items-center gap-2 text-lg font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> example@gmail.com
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Ngày sinh</label>
              <div class="flex items-center gap-2 text-lg font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> 01/01/1990
              </div>
            </div>
          </div>
          <div class="mt-8">
            <button id="btn-start-edit" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2 text-white">Chỉnh sửa thông tin</button>
          </div>
        ` : `
          <form class="space-y-4" id="edit-profile-form">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-medium">Họ và tên</label>
                <div class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input type="text" value="Nguyễn Văn A" class="w-full bg-bg-dark/50 border border-primary/30 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Số điện thoại</label>
                <div class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <input type="tel" value="+84 901 234 567" class="w-full bg-bg-dark/50 border border-primary/30 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Email</label>
                <div class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <input type="email" value="example@gmail.com" class="w-full bg-bg-dark/50 border border-primary/30 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Ngày sinh</label>
                <div class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  <input type="date" value="1990-01-01" class="w-full bg-bg-dark/50 border border-primary/30 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
              </div>
            </div>
            <div class="flex gap-4 mt-8 pt-4 border-t border-primary/10">
              <button type="button" id="btn-cancel-edit" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">Hủy</button>
              <button type="submit" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2 gap-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg> Lưu thay đổi
              </button>
            </div>
          </form>
        `}
      </section>
    `;
  }

  contentContainer.innerHTML = html;

  if (activeTab === 'edit') {
    if (!isEditing) {
      document.getElementById('btn-start-edit').addEventListener('click', () => {
        isEditing = true;
        renderProfileContent();
      });
    } else {
      document.getElementById('btn-cancel-edit').addEventListener('click', () => {
        isEditing = false;
        renderProfileContent();
      });
      document.getElementById('edit-profile-form').addEventListener('submit', (e) => {
        e.preventDefault();
        isEditing = false;
        renderProfileContent();
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    window.location.href = '/pages/login.html';
    return;
  }

  renderNavbar();
  renderFooter();
  renderProfileNav();
  renderProfileContent();

  document.getElementById('btn-edit-profile-avatar').addEventListener('click', () => {
    activeTab = 'edit';
    isEditing = true;
    renderProfileNav();
    renderProfileContent();
  });
});

async function loadOrders() {
  const container = document.getElementById('order-list');
  const token = localStorage.getItem('token');

  try {
    const res = await fetch('http://localhost:8080/api/orders/my-orders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.message);

    const orders = json.data;

    if (!orders.length) {
      container.innerHTML = `<p class="text-slate-400">Bạn chưa có đơn hàng nào</p>`;
      return;
    }

    container.innerHTML = orders.map(order => {

      const d = new Date(order.createdAt);
      const date = d.toLocaleDateString('vi-VN') + ' ' +
                   d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

      const items = order.orderDetails.map(i =>
        i.foodId ? `Food x${i.quantity}` : `Combo x${i.quantity}`
      ).join(', ');

      let statusClass = 'bg-gray-100 text-gray-600';
      if (order.status === 'PENDING') statusClass = 'bg-yellow-100 text-yellow-600';
      if (order.status === 'CONFIRMED') statusClass = 'bg-green-100 text-green-600';
      if (order.status === 'CANCELLED') statusClass = 'bg-red-100 text-red-600';

      return `
        <div class="p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition flex flex-col md:flex-row justify-between gap-4">

          <div class="flex items-center gap-4">
            <div class="size-12 rounded-lg flex items-center justify-center bg-primary/20 text-primary">
              🧾
            </div>

            <div>
              <h4 class="font-bold text-white">
                #ORD-${order.id} • ${date}
              </h4>

              <p class="text-sm text-slate-400 max-w-xs truncate">
                ${items}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4 justify-between md:justify-end">
            <span class="font-bold text-primary text-lg">
              $${order.totalAmount}
            </span>

            <span class="px-3 py-1 rounded-full text-xs font-bold uppercase ${statusClass}">
              ${order.status}
            </span>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    container.innerHTML = `<p class="text-red-500">Lỗi load đơn hàng</p>`;
  }
}