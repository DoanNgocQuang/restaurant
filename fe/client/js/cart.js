import { renderNavbar, renderFooter } from '../components/index.js';

let cartItems = [
  { id: 1, name: "Thăn lưng Wagyu A5", price: 120, qty: 1, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXcK1KVcOgzP0t2YiRvgJ8c6uOS0FqgsdMJQbEqGFpsjurWQj54zBsZP5VZTjQMzKb0BoqOSJALXSigfQAgdo266IhiFEhUTN6Kuh-hqRRRlhpnYpfeJ2KHxYkEJ_PXBD49E2JVwvLMj_NF4Tdvfqu0FPZ1thIJI2f1yKiNU-MluZn7SmmkyNHyvgcTw5cEde60_m2qaT07KnujkbTvxmHS2jWKimFYLf68JxxI44vm-LPHKDVUIvEnzUF5TM1Mpasu6S_yRe5zSd3" },
  { id: 2, name: "Risotto Nấm Truffle", price: 45, qty: 2, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOKAbFwjhdeYGa_zfUZssFuxNvLKazIRPHJuLrs3y70909v-5IlHpYCmkmT_m4fCSnklrrJLLR94O7npEjoEfcKD5JXOgrtFxv-1jwU7qK1bg94Hj9MY1lo2gpmdUKgl5U26tTTAgIfqQhqXZLN4Wrl7hCpFSHIO5cbrrFNxKPiNA130tmQeB0UswQg2cyQMHEbC4Gyx9PyG_RyDKyVidFL0vPjnALGh71GBgvTT7KzPOo4-SmEuXkdJtbh-BQYOU86BL-uBVbH0hO" }
];

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const countEl = document.getElementById('cart-count');
  const summaryEl = document.getElementById('cart-summary');

  if (!container || !countEl || !summaryEl) return;

  countEl.textContent = `Bạn đang có ${cartItems.length} món trong giỏ hàng`;

  container.innerHTML = cartItems.map((item, i) => `
    <div class="bg-white dark:bg-primary/5 rounded-2xl p-4 border border-primary/10 shadow-lg flex flex-col md:flex-row items-center gap-6 animate-fade-in-up" style="animation-delay: ${i * 100}ms">
      <div class="size-32 rounded-xl overflow-hidden shrink-0">
        <img src="${item.img}" alt="${item.name}" class="w-full h-full object-cover" referrerpolicy="no-referrer" />
      </div>
      <div class="flex-1 space-y-1 text-center md:text-left">
        <h3 class="text-xl font-bold">${item.name}</h3>
        <p class="text-primary font-black text-lg">$${item.price.toFixed(2)}</p>
      </div>
      <div class="flex items-center gap-4 bg-slate-100 dark:bg-primary/20 rounded-lg p-1">
        <button class="btn-minus p-2 hover:bg-white dark:hover:bg-primary/30 rounded-md transition-colors" data-id="${item.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>
        </button>
        <span class="font-bold w-8 text-center">${item.qty}</span>
        <button class="btn-plus p-2 hover:bg-white dark:hover:bg-primary/30 rounded-md transition-colors" data-id="${item.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
        </button>
      </div>
      <div class="text-right min-w-[100px]">
        <p class="text-xl font-black text-primary">$${(item.price * item.qty).toFixed(2)}</p>
      </div>
      <button class="btn-remove p-3 text-slate-400 hover:text-red-500 transition-colors" data-id="${item.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
      </button>
    </div>
  `).join('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  summaryEl.innerHTML = `
    <div class="flex justify-between text-slate-400">
      <span>Tạm tính</span>
      <span class="text-white font-bold">$${subtotal.toFixed(2)}</span>
    </div>
    <div class="flex justify-between text-slate-400">
      <span>Thuế (10%)</span>
      <span class="text-white font-bold">$${tax.toFixed(2)}</span>
    </div>
    <div class="flex justify-between text-slate-400">
      <span>Phí vận chuyển</span>
      <span class="text-green-500 font-bold">Miễn phí</span>
    </div>
    <div class="pt-4 border-t border-white/10 flex justify-between items-end">
      <span class="text-lg">Tổng thanh toán</span>
      <span class="text-3xl font-black text-primary">$${total.toFixed(2)}</span>
    </div>
  `;

  // Attach events
  document.querySelectorAll('.btn-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.getAttribute('data-id'));
      const item = cartItems.find(i => i.id === id);
      if (item && item.qty > 1) {
        item.qty--;
        renderCart();
      }
    });
  });

  document.querySelectorAll('.btn-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.getAttribute('data-id'));
      const item = cartItems.find(i => i.id === id);
      if (item) {
        item.qty++;
        renderCart();
      }
    });
  });

  document.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.getAttribute('data-id'));
      cartItems = cartItems.filter(i => i.id !== id);
      renderCart();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (!isLoggedIn) {
    window.location.href = '/pages/login.html';
    return;
  }

  renderNavbar();
  renderFooter();
  renderCart();
});
