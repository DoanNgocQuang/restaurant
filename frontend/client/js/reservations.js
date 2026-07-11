import { renderNavbar, renderFooter } from "../components/index.js";

const API = "http://localhost:8080/api";

let step = 1;
let searchParams = { date: "", time: "", guests: 2 };
let availableTables = [];
let selectedTable = null;

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

function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await response.json().catch(() => null);
  if (!response.ok || json?.status === "error") {
    throw new Error(json?.message || `Yêu cầu thất bại (${response.status})`);
  }

  return json?.data;
}

function toApiDateTime(date, time) {
  return `${date}T${time}:00`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function getMinDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function renderReservationFlow() {
  const container = document.getElementById("reservation-container");
  if (!container) return;

  if (!isLoggedIn()) {
    window.location.href = "/pages/login.html";
    return;
  }

  const user = getUser();
  let html = '<div class="text-white">';

  if (step < 4) {
    html += `
      <div class="mb-8 flex items-center justify-center">
        <div class="flex items-center ${step >= 1 ? "text-primary" : "text-slate-500"}">
          <div class="size-8 rounded-full border-2 border-current flex items-center justify-center font-bold">1</div>
          <span class="ml-2 hidden font-medium sm:block">Tìm bàn</span>
        </div>
        <div class="mx-2 h-0.5 w-12 ${step >= 2 ? "bg-primary" : "bg-slate-700"}"></div>
        <div class="flex items-center ${step >= 2 ? "text-primary" : "text-slate-500"}">
          <div class="size-8 rounded-full border-2 border-current flex items-center justify-center font-bold">2</div>
          <span class="ml-2 hidden font-medium sm:block">Chọn bàn</span>
        </div>
        <div class="mx-2 h-0.5 w-12 ${step >= 3 ? "bg-primary" : "bg-slate-700"}"></div>
        <div class="flex items-center ${step >= 3 ? "text-primary" : "text-slate-500"}">
          <div class="size-8 rounded-full border-2 border-current flex items-center justify-center font-bold">3</div>
          <span class="ml-2 hidden font-medium sm:block">Xác nhận</span>
        </div>
      </div>
    `;
  }

  if (step === 1) {
    const minDate = getMinDate();
    html += `
      <form id="search-form" class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold uppercase tracking-widest text-primary">Ngày đặt</label>
          <input type="date" id="date-input" required min="${minDate}" value="${searchParams.date}" class="w-full rounded-lg border border-primary/30 bg-bg-dark/50 py-3 px-4 text-white outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold uppercase tracking-widest text-primary">Giờ đặt</label>
          <input type="time" id="time-input" required value="${searchParams.time}" class="w-full rounded-lg border border-primary/30 bg-bg-dark/50 py-3 px-4 text-white outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold uppercase tracking-widest text-primary">Số lượng khách</label>
          <input type="number" id="guests-input" required min="1" value="${searchParams.guests}" class="w-full rounded-lg border border-primary/30 bg-bg-dark/50 py-3 px-4 text-white outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary" />
        </div>
        <div class="md:col-span-3 pt-4">
          <button type="submit" id="btn-search" class="w-full rounded-md bg-primary py-4 text-lg font-medium uppercase tracking-widest text-white shadow transition-colors hover:bg-primary/90">
            Tìm bàn trống
          </button>
        </div>
      </form>
      <p id="reservation-search-error" class="mt-4 hidden text-center font-medium text-red-400"></p>
    `;
  } else if (step === 2) {
    html += `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold">Danh sách bàn trống phù hợp</h3>
            <p class="mt-1 text-sm text-slate-400">${formatDate(searchParams.date)} lúc ${searchParams.time} cho ${searchParams.guests} khách</p>
          </div>
          <button id="btn-back-step1" class="rounded-md border border-white/10 bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-white/5">Đổi thời gian</button>
        </div>
        ${
          availableTables.length > 0
            ? `
          <div class="grid gap-4">
            ${availableTables
              .map(
                (table) => `
              <div class="flex flex-col items-start justify-between gap-4 rounded-xl border border-primary/30 bg-bg-dark/50 p-5 transition-colors hover:border-primary sm:flex-row sm:items-center">
                <div>
                  <div class="mb-2 flex items-center gap-3">
                    <span class="rounded bg-primary/20 px-2 py-1 text-xs font-bold text-primary">#${table.id}</span>
                    <h4 class="text-lg font-bold">${table.name}</h4>
                  </div>
                  <div class="mb-2 text-sm text-slate-400">Tối đa ${table.capacity} khách</div>
                  <p class="text-sm text-slate-300">${table.description || "Không có mô tả"}</p>
                </div>
                <button class="btn-select-table w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 sm:w-auto" data-id="${table.id}">
                  Chọn bàn này
                </button>
              </div>
            `,
              )
              .join("")}
          </div>
        `
            : `
          <div class="rounded-xl border border-dashed border-slate-600 bg-bg-dark/50 py-12 text-center">
            <p class="mb-4 text-slate-400">Không có bàn trống phù hợp với thời gian này.</p>
            <button id="btn-back-step1-empty" class="rounded-md border border-white/10 bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-white/5">Tìm lại</button>
          </div>
        `
        }
      </div>
    `;
  } else if (step === 3 && selectedTable) {
    html += `
      <div class="space-y-6">
        <h3 class="mb-6 text-center text-xl font-bold">Xác nhận thông tin đặt bàn</h3>
        <div class="space-y-4 rounded-xl border border-primary/30 bg-bg-dark/50 p-6">
          <div class="grid grid-cols-2 gap-4 border-b border-slate-700 pb-4">
            <div>
              <span class="mb-1 block text-sm text-slate-400">Ngày đặt</span>
              <span class="text-lg font-medium">${formatDate(searchParams.date)}</span>
            </div>
            <div>
              <span class="mb-1 block text-sm text-slate-400">Giờ đặt</span>
              <span class="text-lg font-medium">${searchParams.time}</span>
            </div>
            <div>
              <span class="mb-1 block text-sm text-slate-400">Số lượng khách</span>
              <span class="text-lg font-medium">${searchParams.guests} người</span>
            </div>
          </div>
          <div class="border-b border-slate-700 pb-4 pt-2">
            <span class="mb-2 block text-sm text-slate-400">Thông tin bàn</span>
            <div class="flex items-center gap-3">
              <span class="rounded bg-primary/20 px-2 py-1 text-sm font-bold text-primary">#${selectedTable.id}</span>
              <span class="text-lg font-bold">${selectedTable.name}</span>
            </div>
            <p class="mt-2 text-sm text-slate-400">${selectedTable.description || "Không có mô tả"}</p>
          </div>
          <div class="grid grid-cols-1 gap-4 border-b border-slate-700 pb-4 pt-2 sm:grid-cols-2">
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold uppercase tracking-widest text-primary">Tên người đặt (*)</label>
              <input type="text" id="contact-name" required value="${user.fullname || ""}" class="w-full rounded-lg border border-primary/30 bg-bg-dark/50 px-4 py-3 text-white outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-xs font-bold uppercase tracking-widest text-primary">Số điện thoại (*)</label>
              <input type="tel" id="contact-phone" required value="${user.phone || ""}" class="w-full rounded-lg border border-primary/30 bg-bg-dark/50 px-4 py-3 text-white outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div class="flex flex-col gap-2 pt-2">
            <label class="text-xs font-bold uppercase tracking-widest text-primary">Ghi chú thêm</label>
            <textarea id="booking-note" rows="3" class="w-full resize-none rounded-lg border border-primary/30 bg-bg-dark/50 px-4 py-3 text-white outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary" placeholder="Dị ứng, vị trí ngồi mong muốn..."></textarea>
          </div>
        </div>
        <div id="booking-error" class="hidden text-center font-medium text-red-400"></div>
        <div class="flex gap-4 pt-4">
          <button id="btn-back-step2" class="flex-1 rounded-md border border-white/10 bg-transparent py-4 text-sm font-medium shadow-sm transition-colors hover:bg-white/5">Quay lại</button>
          <button id="btn-confirm" class="flex-1 rounded-md bg-primary py-4 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90">
            Xác nhận đặt bàn
          </button>
        </div>
      </div>
    `;
  } else if (step === 4) {
    html += `
      <div class="animate-fade-in-up space-y-6 py-8 text-center">
        <div class="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-green-500/20 text-green-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
        <h3 class="text-3xl font-bold text-white">Đặt bàn thành công!</h3>
        <p class="mx-auto max-w-md text-slate-300">
          Chúng tôi đã lưu booking của bạn vào hệ thống. Bây giờ bạn có thể sang trang thực đơn để chọn món và gọi món cho booking này.
        </p>
        <div class="flex justify-center gap-4 pt-8">
          <button id="btn-reset" class="rounded-md border border-white/10 bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-white/5">Đặt thêm bàn khác</button>
          <a href="/pages/menu.html" class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90">Đi gọi món</a>
        </div>
      </div>
    `;
  }

  html += "</div>";
  container.innerHTML = html;
  attachStepEvents();
}

function attachStepEvents() {
  if (step === 1) {
    const form = document.getElementById("search-form");
    const submitButton = document.getElementById("btn-search");
    const errorBox = document.getElementById("reservation-search-error");
    const dateInput = document.getElementById("date-input");
    const timeInput = document.getElementById("time-input");

    // Update time input min when date changes
    dateInput?.addEventListener("change", () => {
      const selectedDate = dateInput.value;
      const today = getMinDate();

      if (selectedDate === today) {
        // If today is selected, set minimum time to current time
        const now = new Date();
        const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
        timeInput.min = currentTime;
      } else {
        // For future dates, remove min time restriction
        timeInput.min = "00:00";
      }
    });

    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const selectedDate = document.getElementById("date-input").value;
      const selectedTime = document.getElementById("time-input").value;
      searchParams.guests =
        Number(document.getElementById("guests-input").value) || 1;

      // Validate that booking time is not in the past
      const today = getMinDate();
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);

      if (selectedDate === today && selectedTime < currentTime) {
        if (errorBox) {
          errorBox.textContent = "Vui lòng chọn giờ đặt trong tương lai.";
          errorBox.classList.remove("hidden");
        }
        return;
      }

      searchParams.date = selectedDate;
      searchParams.time = selectedTime;

      submitButton.disabled = true;
      submitButton.textContent = "Đang tìm kiếm...";
      errorBox?.classList.add("hidden");

      try {
        availableTables = await apiRequest(
          `/tables/available?datetime=${encodeURIComponent(toApiDateTime(searchParams.date, searchParams.time))}&guests=${encodeURIComponent(searchParams.guests)}`,
        );
        step = 2;
        renderReservationFlow();
      } catch (error) {
        if (errorBox) {
          errorBox.textContent = error.message || "Không thể tìm bàn trống.";
          errorBox.classList.remove("hidden");
        }
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Tìm bàn trống";
      }
    });
  }

  if (step === 2) {
    document.getElementById("btn-back-step1")?.addEventListener("click", () => {
      step = 1;
      renderReservationFlow();
    });

    document
      .getElementById("btn-back-step1-empty")
      ?.addEventListener("click", () => {
        step = 1;
        renderReservationFlow();
      });

    document.querySelectorAll(".btn-select-table").forEach((button) => {
      button.addEventListener("click", (event) => {
        const id = Number(event.currentTarget.getAttribute("data-id"));
        selectedTable =
          availableTables.find((table) => table.id === id) || null;
        step = 3;
        renderReservationFlow();
      });
    });
  }

  if (step === 3) {
    const errorBox = document.getElementById("booking-error");
    const confirmButton = document.getElementById("btn-confirm");

    document.getElementById("btn-back-step2")?.addEventListener("click", () => {
      step = 2;
      renderReservationFlow();
    });

    confirmButton?.addEventListener("click", async () => {
      const user = getUser();
      const payload = {
        contactName: document.getElementById("contact-name").value.trim(),
        contactPhone: document.getElementById("contact-phone").value.trim(),
        bookingTime: toApiDateTime(searchParams.date, searchParams.time),
        guestCount: searchParams.guests,
        note:
          document.getElementById("booking-note").value.trim() ||
          "Khách đặt từ trang web",
        status: "PENDING",
        userId: user.id || null,
        tableIds: [selectedTable.id],
      };

      if (!payload.contactName || !payload.contactPhone) {
        if (errorBox) {
          errorBox.textContent =
            "Vui lòng nhập tên người đặt và số điện thoại.";
          errorBox.classList.remove("hidden");
        }
        return;
      }

      confirmButton.disabled = true;
      confirmButton.textContent = "Đang xử lý...";
      errorBox?.classList.add("hidden");

      try {
        await apiRequest("/bookings", { method: "POST", body: payload });
        step = 4;
        renderReservationFlow();
      } catch (error) {
        if (errorBox) {
          errorBox.textContent = error.message || "Không thể tạo booking.";
          errorBox.classList.remove("hidden");
        }
        confirmButton.disabled = false;
        confirmButton.textContent = "Xác nhận đặt bàn";
      }
    });
  }

  if (step === 4) {
    document.getElementById("btn-reset")?.addEventListener("click", () => {
      step = 1;
      searchParams = { date: "", time: "", guests: 2 };
      availableTables = [];
      selectedTable = null;
      renderReservationFlow();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderNavbar();
  renderFooter();
  renderReservationFlow();
});
