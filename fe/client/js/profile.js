import { renderNavbar, renderFooter } from "../components/index.js";

const API = "http://localhost:8080/api";

let activeTab = "reservations";
let isEditing = false;
let currentUser = null;
let currentUserBookings = [];
let currentUserOrders = [];

const navItems = [
  {
    id: "reservations",
    label: "Lịch sử đặt bàn",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>',
  },
  {
    id: "orders",
    label: "Lịch sử đơn hàng",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  },
  {
    id: "edit",
    label: "Chỉnh sửa thông tin",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  },
];

function getToken() {
  return localStorage.getItem("token");
}

function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch (error) {
    return {};
  }
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatDateTime(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getBookingStatusBadge(status) {
  if (status === "PENDING") {
    return { label: "Chờ xác nhận", class: "bg-yellow-100 text-yellow-600" };
  } else if (status === "CONFIRMED") {
    return { label: "Đã xác nhận", class: "bg-green-100 text-green-600" };
  } else if (status === "CANCELLED") {
    return { label: "Đã hủy", class: "bg-red-100 text-red-600" };
  }
  return { label: status, class: "bg-slate-100 text-slate-600" };
}

function getOrderStatusBadge(status) {
  const statuses = {
    PENDING: { label: "Chờ xác nhận", class: "bg-yellow-100 text-yellow-600" },
    CONFIRMED: { label: "Đã xác nhận", class: "bg-blue-100 text-blue-600" },
    COMPLETED: { label: "Hoàn thành", class: "bg-green-100 text-green-600" },
    CANCELLED: { label: "Đã hủy", class: "bg-red-100 text-red-600" },
  };
  return (
    statuses[status] || { label: status, class: "bg-slate-100 text-slate-600" }
  );
}

function renderProfileNav() {
  const navContainer = document.getElementById("profile-nav");
  if (!navContainer) return;

  navContainer.innerHTML = `
    ${navItems
      .map(
        (item) => `
      <button 
        class="nav-btn w-full flex items-center justify-between p-4 transition-colors ${activeTab === item.id ? "bg-primary text-white" : "hover:bg-primary/5"}"
        data-id="${item.id}"
      >
        <div class="flex items-center gap-3">
          ${item.icon}
          <span class="font-medium">${item.label}</span>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${activeTab === item.id ? "text-white" : "text-slate-400"}"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    `,
      )
      .join("")}
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

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      activeTab = e.currentTarget.getAttribute("data-id");
      isEditing = false;
      renderProfileNav();
      renderProfileContent();
    });
  });

  document.getElementById("btn-logout").addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/pages/login.html";
  });
}

async function updateProfileHeader() {
  if (!currentUser) return;

  // Update header with user info
  const nameEl = document.querySelector("aside h2");
  if (nameEl) {
    nameEl.textContent = currentUser.fullname || "Người dùng";
  }

  // Calculate booking and spending stats
  const bookingCount = currentUserBookings.length;
  const totalSpent = currentUserOrders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0,
  );

  const statsEls = document.querySelectorAll("aside .grid span");
  if (statsEls.length >= 2) {
    statsEls[0].textContent = totalSpent.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
    statsEls[2].textContent = bookingCount;
  }
}

async function loadUserProfile() {
  const token = getToken();
  const user = getUser();

  if (!token || !user.id) {
    window.location.href = "/pages/login.html";
    return;
  }

  try {
    const response = await fetch(`${API}/users/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Lỗi khi tải thông tin người dùng");

    const json = await response.json();
    currentUser = json.data;
    await updateProfileHeader();
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

async function loadUserBookings() {
  const token = getToken();
  const user = getUser();

  if (!token || !user.id) return;

  try {
    const response = await fetch(`${API}/bookings?userId=${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Lỗi khi tải lịch sử đặt bàn");

    const json = await response.json();
    currentUserBookings = Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Error loading bookings:", error);
    currentUserBookings = [];
  }
}

async function loadUserOrders() {
  const token = getToken();

  if (!token) return;

  try {
    const response = await fetch(`${API}/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Lỗi khi tải lịch sử đơn hàng");

    const json = await response.json();
    currentUserOrders = Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error("Error loading orders:", error);
    currentUserOrders = [];
  }
}

function renderProfileContent() {
  const contentContainer = document.getElementById("profile-content");
  if (!contentContainer) return;

  let html = "";

  if (activeTab === "reservations") {
    if (currentUserBookings.length === 0) {
      html = `
        <section class="bg-white dark:bg-primary/5 rounded-2xl p-8 border border-primary/10 shadow-xl animate-fade-in-up">
          <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> Lịch sử đặt bàn
          </h3>
          <p class="text-slate-400 text-center py-8">Bạn chưa có lịch sử đặt bàn nào. <a href="/pages/reservations.html" class="text-primary font-semibold hover:underline">Đặt bàn ngay</a></p>
        </section>
      `;
    } else {
      html = `
        <section class="bg-white dark:bg-primary/5 rounded-2xl p-8 border border-primary/10 shadow-xl animate-fade-in-up">
          <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg> Lịch sử đặt bàn
          </h3>
          <div class="space-y-4">
            ${currentUserBookings
              .map((booking) => {
                const statusBadge = getBookingStatusBadge(booking.status);
                return `
                <div class="p-4 rounded-xl border border-slate-200 dark:border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div class="flex items-center gap-4 w-full md:flex-1">
                    <div class="size-12 rounded-lg flex items-center justify-center bg-primary/20 text-primary shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    </div>
                    <div>
                      <h4 class="font-bold">${formatDate(booking.bookingTime)} - ${new Date(booking.bookingTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</h4>
                      <p class="text-sm text-slate-500">${booking.guestCount} khách • ${booking.contactName}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4 w-full md:w-auto md:justify-end">
                    <span class="px-3 py-1 rounded-full text-xs font-bold uppercase ${statusBadge.class}">
                      ${statusBadge.label}
                    </span>
                  </div>
                </div>
              `;
              })
              .join("")}
          </div>
        </section>
      `;
    }
  } else if (activeTab === "orders") {
    if (currentUserOrders.length === 0) {
      html = `
        <section class="bg-white dark:bg-primary/5 rounded-2xl p-8 border border-primary/10 shadow-xl animate-fade-in-up">
          <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> Lịch sử đơn hàng
          </h3>
          <p class="text-slate-400 text-center py-8">Bạn chưa có đơn hàng nào. <a href="/pages/menu.html" class="text-primary font-semibold hover:underline">Gọi món ngay</a></p>
        </section>
      `;
    } else {
      html = `
        <section class="bg-white dark:bg-primary/5 rounded-2xl p-8 border border-primary/10 shadow-xl animate-fade-in-up">
          <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> Lịch sử đơn hàng
          </h3>
          <div class="space-y-4">
            ${currentUserOrders
              .map((order) => {
                const statusBadge = getOrderStatusBadge(order.status);
                return `
                <div class="p-4 rounded-xl border border-slate-200 dark:border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div class="flex items-center gap-4 w-full md:flex-1">
                    <div class="size-12 rounded-lg flex items-center justify-center bg-primary/20 text-primary shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    </div>
                    <div>
                      <h4 class="font-bold">Đơn hàng #${order.id}</h4>
                      <p class="text-sm text-slate-500">${formatDateTime(order.createdAt)}</p>
                      <p class="text-sm text-primary font-semibold">${(order.totalAmount || 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4 w-full md:w-auto md:justify-end">
                    <span class="px-3 py-1 rounded-full text-xs font-bold uppercase ${statusBadge.class}">
                      ${statusBadge.label}
                    </span>
                  </div>
                </div>
              `;
              })
              .join("")}
          </div>
        </section>
      `;
    }
  } else if (activeTab === "edit") {
    if (!isEditing) {
      html = `
        <section class="bg-white dark:bg-primary/5 rounded-2xl p-8 border border-primary/10 shadow-xl animate-fade-in-up">
          <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg> Chỉnh sửa thông tin
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Họ và tên</label>
              <div class="flex items-center gap-2 text-lg font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> ${currentUser?.fullname || "N/A"}
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Số điện thoại</label>
              <div class="flex items-center gap-2 text-lg font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> ${currentUser?.phone || "N/A"}
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
              <div class="flex items-center gap-2 text-lg font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> ${currentUser?.email || "N/A"}
              </div>
            </div>
          </div>
          <div class="mt-8">
            <button id="btn-start-edit" class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2 text-white">Chỉnh sửa thông tin</button>
          </div>
        </section>
      `;
    } else {
      html = `
        <section class="bg-white dark:bg-primary/5 rounded-2xl p-8 border border-primary/10 shadow-xl animate-fade-in-up">
          <h3 class="text-xl font-bold mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg> Chỉnh sửa thông tin
          </h3>
          
          <form class="space-y-4" id="edit-profile-form">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-medium">Họ và tên</label>
                <div class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <input type="text" id="fullname" value="${currentUser?.fullname || ""}" class="w-full bg-white dark:bg-primary/5 border border-primary/30 rounded-lg py-3 pl-10 pr-4 text-black dark:text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Số điện thoại</label>
                <div class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <input type="tel" id="phone" value="${currentUser?.phone || ""}" class="w-full bg-white dark:bg-primary/5 border border-primary/30 rounded-lg py-3 pl-10 pr-4 text-black dark:text-white placeholder:text-slate-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Email</label>
                <div class="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <input type="email" id="email" value="${currentUser?.email || ""}" disabled class="w-full bg-slate-100 dark:bg-slate-700 border border-primary/30 rounded-lg py-3 pl-10 pr-4 text-black dark:text-white placeholder:text-slate-600 cursor-not-allowed opacity-50" />
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
        </section>
      `;
    }
  }

  contentContainer.innerHTML = html;

  if (activeTab === "edit") {
    if (!isEditing) {
      document
        .getElementById("btn-start-edit")
        .addEventListener("click", () => {
          isEditing = true;
          renderProfileContent();
        });
    } else {
      document
        .getElementById("btn-cancel-edit")
        .addEventListener("click", () => {
          isEditing = false;
          renderProfileContent();
        });
      document
        .getElementById("edit-profile-form")
        .addEventListener("submit", handleUpdateProfile);
    }
  }
}

async function handleUpdateProfile(e) {
  e.preventDefault();

  const token = getToken();
  const user = getUser();
  if (!token || !user.id) return;

  const fullname = document.getElementById("fullname").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!fullname || !phone) {
    alert("Vui lòng điền đầy đủ thông tin");
    return;
  }

  try {
    const response = await fetch(`${API}/users/${user.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullname,
        phone,
        email: currentUser.email,
      }),
    });

    if (!response.ok) throw new Error("Lỗi khi cập nhật thông tin");

    const json = await response.json();
    currentUser = json.data;

    // Update localStorage
    const updatedUser = { ...user, fullname, phone };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    isEditing = false;
    alert("Cập nhật thông tin thành công!");
    renderProfileNav();
    await updateProfileHeader();
    renderProfileContent();
  } catch (error) {
    console.error("Error updating profile:", error);
    alert(error.message || "Không thể cập nhật thông tin");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  if (!isLoggedIn) {
    window.location.href = "/pages/login.html";
    return;
  }

  renderNavbar();
  renderFooter();
  renderProfileNav();

  // Load data
  await loadUserProfile();
  await loadUserBookings();
  await loadUserOrders();

  await updateProfileHeader();
  renderProfileContent();

  document
    .getElementById("btn-edit-profile-avatar")
    ?.addEventListener("click", () => {
      activeTab = "edit";
      isEditing = true;
      renderProfileNav();
      renderProfileContent();
    });
});
