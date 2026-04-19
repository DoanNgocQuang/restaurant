import { renderNavbar, renderFooter } from '../components/index.js';

const API = 'http://localhost:8080/api';

/* ================= TOKEN ================= */
const getToken = () => localStorage.getItem('token');

/* ================= STATE ================= */
let currentOrderId = null;
let currentOrderDetails = null;
let appliedVoucher = null;

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    window.location.href = '/pages/login.html';
    return;
  }

  renderNavbar();
  renderFooter();

  // Get order ID from query params
  const urlParams = new URLSearchParams(window.location.search);
  currentOrderId = urlParams.get('orderId');

  if (!currentOrderId) {
    alert("Không tìm thấy mã đơn hàng");
    window.location.href = '/pages/menu.html';
    return;
  }

  document.getElementById('order-id-display').textContent = currentOrderId;

  fetchOrderDetails();
  attachEvents();
});

/* ================= FETCH DATA ================= */
async function fetchOrderDetails() {
  try {
    const res = await fetch(`${API}/orders/${currentOrderId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    if (!res.ok) {
      throw new Error("Không thể tải thông tin đơn hàng");
    }

    const json = await res.json();
    currentOrderDetails = json.data;
    
    renderOrder();
    
    // Checkout is only available while the order is waiting for restaurant confirmation.
    if (currentOrderDetails.status === 'PENDING') {
        document.getElementById('pay-btn').disabled = false;
    } else {
        document.getElementById('pay-btn').textContent = "ĐƠN HÀNG ĐÃ ĐƯỢC XỬ LÝ";
    }

  } catch (err) {
    console.error(err);
    alert(err.message);
    window.location.href = '/pages/profile.html';
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

/* ================= RENDER ================= */
function renderOrder() {
  if (!currentOrderDetails) return;

  const itemsContainer = document.getElementById('order-items-container');
  
  itemsContainer.innerHTML = currentOrderDetails.orderDetails.map(item => `
    <div class="flex justify-between items-center bg-black/20 p-3 rounded-lg border border-white/5">
      <div>
        <p class="font-bold text-white">${item.itemName || (item.foodId ? 'Món ăn #' + item.foodId : 'Combo #' + item.comboId)}</p>
        <p class="text-sm text-slate-400">Số lượng: ${item.quantity}</p>
      </div>
      <div class="font-bold">${formatCurrency(item.price * item.quantity)}</div>
    </div>
  `).join('');

  let total = currentOrderDetails.totalAmount;
  let discountAmt = 0;

  if (appliedVoucher) {
      if (appliedVoucher.discountType === 'PERCENT') {
          discountAmt = (total * appliedVoucher.discountValue) / 100;
      } else {
          discountAmt = appliedVoucher.discountValue;
      }
      total -= discountAmt;
      if (total < 0) total = 0;
      
      document.getElementById('discount-row').classList.remove('hidden');
      document.getElementById('order-discount-display').textContent = '-' + formatCurrency(discountAmt);
  } else {
      document.getElementById('discount-row').classList.add('hidden');
  }

  document.getElementById('order-status-display').textContent = currentOrderDetails.status;
  document.getElementById('order-total-display').textContent = formatCurrency(total);
  
  // Update VietQR dynamic image with Amount and Order ID
  const qrImg = document.getElementById('vnpay-qr-img');
  if (qrImg) {
    const amount = Math.round(total);
    const addInfo = encodeURIComponent(`Thanh toan don hang ${currentOrderId}`);
    qrImg.src = `https://img.vietqr.io/image/vietinbank-0812629922-compact.png?amount=${amount}&addInfo=${addInfo}`;
  }
}

/* ================= EVENTS ================= */
function attachEvents() {
  const form = document.getElementById('checkout-form');
  const vnpayDetails = document.getElementById('vnpay-details');
  const radioInputs = form.querySelectorAll('input[name="paymentMethod"]');

  // Toggle VNPay details visibility based on payment method
  radioInputs.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'VNPAY') {
        vnpayDetails.classList.remove('opacity-50', 'pointer-events-none');
      } else {
        vnpayDetails.classList.add('opacity-50', 'pointer-events-none');
      }
    });
  });

  const applyBtn = document.getElementById('apply-voucher-btn');
  const voucherInput = document.getElementById('voucher-code-input');
  const msgEl = document.getElementById('voucher-message');

  if (applyBtn) {
    applyBtn.addEventListener('click', async () => {
      const code = voucherInput.value.trim();
      if (!code) return;
      
      msgEl.textContent = 'Đang kiểm tra...';
      msgEl.className = 'text-xs text-yellow-500 block';

      try {
        const res = await fetch(`${API}/vouchers/code/${encodeURIComponent(code)}`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        const json = await res.json();

        if (!res.ok || json.status === 'error') {
          throw new Error(json.message || 'Mã không tồn tại hoặc không hợp lệ');
        }

        appliedVoucher = json.data;
        msgEl.textContent = `Áp dụng thành công mã giảm ${appliedVoucher.discountType === 'PERCENT' ? appliedVoucher.discountValue + '%' : formatCurrency(appliedVoucher.discountValue)}!`;
        msgEl.className = 'text-xs text-green-400 block';
        
        renderOrder();

      } catch (err) {
        let msg = err.message;
        if (msg.includes('Failed to fetch')) {
            msg = "Mã không tồn tại hoặc lỗi kết nối mạng";
        }
        msgEl.textContent = msg;
        msgEl.className = 'text-xs text-red-500 block';
        appliedVoucher = null;
        renderOrder();
      }
    });
  }

  // Submit checkout
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const paymentMethod = formData.get('paymentMethod');
    
    const btn = document.getElementById('pay-btn');
    const originalText = btn.textContent;
    btn.textContent = "ĐANG XỬ LÝ...";
    btn.disabled = true;

    try {
      const res = await fetch(`${API}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          orderId: parseInt(currentOrderId),
          paymentMethod: paymentMethod,
          voucherCode: appliedVoucher ? appliedVoucher.code : null
        })
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message);

      // Clear the cart on successful payment
      localStorage.removeItem('cart');

      // Show success modal
      document.getElementById('success-modal').classList.remove('hidden');

    } catch (err) {
      console.error(err);
      alert("Thanh toán thất bại: " + err.message);
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}
