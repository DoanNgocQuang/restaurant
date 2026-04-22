const reservationsState = {
  bookings: [],
  tables: [],
  users: [],
  query: "",
  page: 1,
  pageSize: 10,
};

async function initReservations() {
  reservationsState.page = 1;
  window.AdminApp.configureGlobalSearch({
    placeholder: "Tìm booking theo khách, số điện thoại, ghi chú...",
    handler: (value) => {
      reservationsState.query = value.toLowerCase();
      reservationsState.page = 1;
      renderReservations();
    },
  });
  await loadReservationsData();
}

async function loadReservationsData() {
  const tbody = document.getElementById("reservations-tbody");
  if (tbody) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(
      7,
      "Đang tải booking...",
    );
  }

  try {
    const [bookings, tables, users] = await Promise.all([
      window.AdminApp.request("/bookings"),
      window.AdminApp.request("/tables"),
      window.AdminApp.request("/users"),
    ]);

    reservationsState.bookings = Array.isArray(bookings) ? bookings : [];
    reservationsState.tables = Array.isArray(tables) ? tables : [];
    reservationsState.users = Array.isArray(users) ? users : [];

    renderReservationStats();
    renderReservations();
  } catch (error) {
    console.error(error);
    if (tbody) {
      tbody.innerHTML = window.AdminApp.renderTableMessage(
        7,
        error.message || "Không thể tải booking.",
        "error",
      );
    }
  }
}

function renderReservationStats() {
  const bookings = reservationsState.bookings;
  document.getElementById("reservations-pending-count").textContent =
    window.AdminApp.formatNumber(
      bookings.filter((item) => item.status === "PENDING").length,
    );
  document.getElementById("reservations-confirmed-count").textContent =
    window.AdminApp.formatNumber(
      bookings.filter((item) => item.status === "CONFIRMED").length,
    );
  document.getElementById("reservations-cancelled-count").textContent =
    window.AdminApp.formatNumber(
      bookings.filter((item) => item.status === "CANCELLED").length,
    );
}

function getTableLabel(tableInfo) {
  const table = reservationsState.tables.find(
    (item) => item.id === tableInfo.id,
  );
  if (table) {
    return `${table.name} (${table.capacity} chỗ)`;
  }
  return `Bàn #${tableInfo.id}`;
}

function getFilteredBookings() {
  return reservationsState.bookings.filter((booking) => {
    const tableLabel = (booking.tables || [])
      .map((table) => getTableLabel(table))
      .join(" ");
    const haystack = [
      booking.contactName,
      booking.contactPhone,
      booking.note,
      booking.status,
      booking.userFullname,
      tableLabel,
    ]
      .join(" ")
      .toLowerCase();

    return (
      !reservationsState.query || haystack.includes(reservationsState.query)
    );
  });
}

function renderReservations() {
  const tbody = document.getElementById("reservations-tbody");
  const pagination = document.getElementById("reservations-pagination");
  if (!tbody) return;

  const bookings = getFilteredBookings();
  if (bookings.length === 0) {
    tbody.innerHTML = window.AdminApp.renderTableMessage(
      7,
      "Không có booking phù hợp.",
    );
    if (pagination) {
      pagination.innerHTML = "";
    }
    return;
  }

  const statusClassMap = {
    PENDING:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    CONFIRMED:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    CANCELLED:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };

  const paginationMeta = window.AdminPagination.render({
    containerId: "reservations-pagination",
    items: bookings,
    currentPage: reservationsState.page,
    pageSize: reservationsState.pageSize,
    onPageChange: (page) => {
      reservationsState.page = page;
      renderReservations();
    },
  });
  reservationsState.page = paginationMeta.page;

  tbody.innerHTML = paginationMeta.items
    .map(
      (booking) => `
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <td class="px-6 py-4">
        <div class="font-bold text-sm text-slate-900 dark:text-white">${window.AdminApp.escapeHtml(booking.contactName)}</div>
        <div class="text-xs text-slate-500">${window.AdminApp.escapeHtml(booking.contactPhone)}</div>
        <div class="text-xs text-slate-400 mt-1">${window.AdminApp.escapeHtml(booking.userFullname || "Khách lẻ")}</div>
      </td>
      <td class="px-6 py-4 text-sm text-slate-500">${(booking.tables || []).map((table) => `<div>${window.AdminApp.escapeHtml(getTableLabel(table))}</div>`).join("") || "--"}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.formatDateTime(booking.bookingTime)}</td>
      <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">${window.AdminApp.formatNumber(booking.guestCount)} khách</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <span class="rounded-full px-2.5 py-1 text-xs font-bold ${statusClassMap[booking.status] || statusClassMap.PENDING}">
          ${window.AdminApp.escapeHtml(booking.status)}
        </span>
      </td>
      <td class="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title="${window.AdminApp.escapeHtml(booking.note || "")}">${window.AdminApp.escapeHtml(booking.note || "--")}</td>
      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button class="mr-3 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300" onclick="openReservationModal(${booking.id})">Sửa</button>
        <button class="mr-3 text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300" onclick="quickUpdateReservationStatus(${booking.id}, 'CONFIRMED')">Xác nhận</button>
        <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" onclick="deleteReservation(${booking.id})">Xóa</button>
      </td>
    </tr>
  `,
    )
    .join("");
}

function openReservationModal(bookingId = null) {
  const booking = bookingId
    ? reservationsState.bookings.find((item) => item.id === bookingId)
    : null;
  const selectedTableIds = new Set(
    (booking?.tables || []).map((table) => table.id),
  );

  const userOptions = reservationsState.users
    .filter((user) => user.role === "CUSTOMER")
    .map(
      (user) =>
        `<option value="${user.id}" ${user.id === booking?.userId ? "selected" : ""}>${window.AdminApp.escapeHtml(user.fullname)} - ${window.AdminApp.escapeHtml(user.email)}</option>`,
    )
    .join("");

  const tableOptions = reservationsState.tables
    .map(
      (table) => `
    <label class="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
      <input type="checkbox" class="reservation-table-checkbox rounded border-slate-300 text-primary focus:ring-primary" value="${table.id}" ${selectedTableIds.has(table.id) ? "checked" : ""}>
      <div>
        <p class="font-semibold text-slate-700 dark:text-slate-200">${window.AdminApp.escapeHtml(table.name)}</p>
        <p class="text-xs text-slate-500">${table.capacity} chỗ • ${window.AdminApp.escapeHtml(table.status)}</p>
      </div>
    </label>
  `,
    )
    .join("");

  const content = `
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Tên liên hệ</label>
        <input type="text" id="reservation-contact-name" value="${window.AdminApp.escapeHtml(booking?.contactName || "")}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Số điện thoại</label>
        <input type="text" id="reservation-contact-phone" value="${window.AdminApp.escapeHtml(booking?.contactPhone || "")}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" />
      </div>
    </div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Thời gian</label>
        <input type="datetime-local" id="reservation-booking-time" value="${window.AdminApp.formatDateTimeLocal(booking?.bookingTime)}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Số khách</label>
        <input type="number" min="1" id="reservation-guest-count" value="${booking?.guestCount || ""}" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Trạng thái</label>
        <select id="reservation-status" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900">
          ${["PENDING", "CONFIRMED", "CANCELLED"]
            .map(
              (status) => `
            <option value="${status}" ${status === (booking?.status || "PENDING") ? "selected" : ""}>${status}</option>
          `,
            )
            .join("")}
        </select>
      </div>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Khách hàng hệ thống</label>
      <select id="reservation-user-id" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900">
        <option value="">Không gắn tài khoản</option>
        ${userOptions}
      </select>
    </div>
    <div>
      <div class="mb-2 flex items-center justify-between gap-4">
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">Danh sách bàn</label>
        <button type="button" id="reservation-suggest-btn" class="text-sm font-semibold text-primary">Gợi ý bàn trống</button>
      </div>
      <div id="reservation-suggestions" class="mb-3 text-xs text-slate-500"></div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        ${tableOptions}
      </div>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Ghi chú</label>
      <textarea id="reservation-note" rows="4" class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900">${window.AdminApp.escapeHtml(booking?.note || "")}</textarea>
    </div>
  `;

  const footer = `
    <button class="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700" onclick="closeGlobalModal()">Hủy</button>
    <button class="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-600" onclick="saveReservationForm(${booking?.id || "null"})">
      ${booking ? "Lưu booking" : "Tạo booking"}
    </button>
  `;

  openGlobalModal(
    booking ? "Cập nhật đặt bàn" : "Thêm đặt bàn",
    content,
    footer,
  );

  const suggestButton = document.getElementById("reservation-suggest-btn");
  if (suggestButton) {
    suggestButton.addEventListener("click", loadAvailableTableSuggestions);
  }
}

async function loadAvailableTableSuggestions() {
  const bookingTime = document.getElementById(
    "reservation-booking-time",
  )?.value;
  const guestCount = document.getElementById("reservation-guest-count")?.value;
  const suggestions = document.getElementById("reservation-suggestions");

  if (!bookingTime || !guestCount) {
    if (suggestions) {
      suggestions.textContent =
        "Hãy nhập thời gian và số khách trước khi gợi ý bàn.";
    }
    return;
  }

  try {
    const availableTables = await window.AdminApp.request(
      `/tables/available?datetime=${encodeURIComponent(window.AdminApp.toApiDateTime(bookingTime))}&guests=${encodeURIComponent(guestCount)}`,
    );
    const availableIds = new Set(
      (availableTables || []).map((table) => table.id),
    );

    document
      .querySelectorAll(".reservation-table-checkbox")
      .forEach((checkbox) => {
        checkbox.checked = availableIds.has(Number(checkbox.value));
      });

    if (suggestions) {
      suggestions.textContent =
        availableIds.size > 0
          ? `Đã chọn ${availableIds.size} bàn phù hợp từ backend.`
          : "Backend không tìm thấy bàn phù hợp trong khung giờ này.";
    }
  } catch (error) {
    if (suggestions) {
      suggestions.textContent =
        error.message || "Không thể lấy danh sách bàn trống.";
    }
  }
}

function buildReservationPayload(bookingOverride = null) {
  const bookingTime = document.getElementById("reservation-booking-time").value;
  return {
    contactName: document
      .getElementById("reservation-contact-name")
      .value.trim(),
    contactPhone: document
      .getElementById("reservation-contact-phone")
      .value.trim(),
    bookingTime: window.AdminApp.toApiDateTime(bookingTime),
    guestCount: Number(
      document.getElementById("reservation-guest-count").value,
    ),
    status: document.getElementById("reservation-status").value,
    note: document.getElementById("reservation-note").value.trim(),
    userId: document.getElementById("reservation-user-id").value
      ? Number(document.getElementById("reservation-user-id").value)
      : null,
    tableIds: Array.from(
      document.querySelectorAll(".reservation-table-checkbox:checked"),
    ).map((checkbox) => Number(checkbox.value)),
    ...(bookingOverride || {}),
  };
}

async function saveReservationForm(bookingId) {
  const payload = buildReservationPayload();

  try {
    if (bookingId) {
      await window.AdminApp.request(`/bookings/${bookingId}`, {
        method: "PUT",
        body: payload,
      });
      window.AdminApp.showToast("Đã cập nhật booking.");
    } else {
      await window.AdminApp.request("/bookings", {
        method: "POST",
        body: payload,
      });
      window.AdminApp.showToast("Đã tạo booking mới.");
    }

    closeGlobalModal();
    await loadReservationsData();
  } catch (error) {
    window.AdminApp.showToast(
      error.message || "Không thể lưu booking.",
      "error",
    );
  }
}

async function quickUpdateReservationStatus(bookingId, status) {
  const booking = reservationsState.bookings.find(
    (item) => item.id === bookingId,
  );
  if (!booking) return;

  try {
    if (status === "CONFIRMED") {
      // Use confirm endpoint to set table as RESERVED
      await window.AdminApp.request(`/bookings/${bookingId}/confirm`, {
        method: "PUT",
      });
    } else {
      // For other status updates
      const payload = {
        contactName: booking.contactName,
        contactPhone: booking.contactPhone,
        bookingTime: booking.bookingTime,
        guestCount: booking.guestCount,
        status,
        note: booking.note,
        userId: booking.userId,
        tableIds: (booking.tables || []).map((table) => table.id),
      };
      await window.AdminApp.request(`/bookings/${bookingId}`, {
        method: "PUT",
        body: payload,
      });
    }
    window.AdminApp.showToast(`Đã cập nhật trạng thái booking sang ${status}.`);
    await loadReservationsData();
  } catch (error) {
    window.AdminApp.showToast(
      error.message || "Không thể cập nhật trạng thái booking.",
      "error",
    );
  }
}

async function deleteReservation(bookingId) {
  if (!window.AdminApp.confirmAction("Bạn có chắc muốn xóa booking này?")) {
    return;
  }

  try {
    await window.AdminApp.request(`/bookings/${bookingId}`, {
      method: "DELETE",
    });
    window.AdminApp.showToast("Đã xóa booking.");
    await loadReservationsData();
  } catch (error) {
    window.AdminApp.showToast(
      error.message || "Không thể xóa booking.",
      "error",
    );
  }
}
