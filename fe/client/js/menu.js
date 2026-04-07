import { renderNavbar, renderFooter } from '../components/index.js';

const menuData = [
  {
    category: "Món Chính",
    items: [
      { name: "Risotto Nấm Truffle", price: "$45.00", desc: "Gạo arborio kem, nấm rừng tự nhiên, nấm truffle đen bào tươi và phô mai Parmigiano-Reggiano 24 tháng tuổi.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOKAbFwjhdeYGa_zfUZssFuxNvLKazIRPHJuLrs3y70909v-5IlHpYCmkmT_m4fCSnklrrJLLR94O7npEjoEfcKD5JXOgrtFxv-1jwU7qK1bg94Hj9MY1lo2gpmdUKgl5U26tTTAgIfqQhqXZLN4Wrl7hCpFSHIO5cbrrFNxKPiNA130tmQeB0UswQg2cyQMHEbC4Gyx9PyG_RyDKyVidFL0vPjnALGh71GBgvTT7KzPOo4-SmEuXkdJtbh-BQYOU86BL-uBVbH0hO" },
      { name: "Sườn Cừu Nướng Thảo Mộc", price: "$58.00", desc: "Cừu ăn cỏ, lớp vỏ hạt dẻ cười và thảo mộc, đậu nghiền bạc hà và sốt balsamic giảm.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOKAbFwjhdeYGa_zfUZssFuxNvLKazIRPHJuLrs3y70909v-5IlHpYCmkmT_m4fCSnklrrJLLR94O7npEjoEfcKD5JXOgrtFxv-1jwU7qK1bg94Hj9MY1lo2gpmdUKgl5U26tTTAgIfqQhqXZLN4Wrl7hCpFSHIO5cbrrFNxKPiNA130tmQeB0UswQg2cyQMHEbC4Gyx9PyG_RyDKyVidFL0vPjnALGh71GBgvTT7KzPOo4-SmEuXkdJtbh-BQYOU86BL-uBVbH0hO" },
      { name: "Bò Wagyu Rossini", price: "$85.00", desc: "Thịt bò Wagyu hạng A5, gan ngỗng áp chảo, bánh mì brioche nướng và sốt rượu Madeira.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBOKAbFwjhdeYGa_zfUZssFuxNvLKazIRPHJuLrs3y70909v-5IlHpYCmkmT_m4fCSnklrrJLLR94O7npEjoEfcKD5JXOgrtFxv-1jwU7qK1bg94Hj9MY1lo2gpmdUKgl5U26tTTAgIfqQhqXZLN4Wrl7hCpFSHIO5cbrrFNxKPiNA130tmQeB0UswQg2cyQMHEbC4Gyx9PyG_RyDKyVidFL0vPjnALGh71GBgvTT7KzPOo4-SmEuXkdJtbh-BQYOU86BL-uBVbH0hO" }
    ]
  },
  {
    category: "Hải Sản",
    items: [
      { name: "Sò Điệp Áp Chảo", price: "$52.00", desc: "Sò điệp Hokkaido, kem súp lơ, thịt ba chỉ giòn và sốt nhũ tương cam quýt.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPbPwEoVecZ_rYNU_2sgKm1P_uysVPkpRYp6vLxGV_nX4T9Mgs7q9e-OQ2NviFlm9dMOS76RexHzPdU-Hl0t_bz9k7luVHkPkbtJtah6D7SrFV2w73qT4dmIzQOuQr5q1yP2x8-tpVkSz8GXodl7ydevcdXJVQausWxoMS3NOaiMSsGE5x--s9PXNGTWkIq3tUandhDyrSw6ZmUBjuISow1zOU19NUK9ZZjtjzsKh2E_AOUyxayaWIHRPneE3V5b7Xyr8zkkIfjloM" },
      { name: "Cá Chẽm Chile Hoang Dã", price: "$64.00", desc: "Cá chẽm sốt miso, cải thìa, nước dùng dashi gừng và dầu mè.", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPbPwEoVecZ_rYNU_2sgKm1P_uysVPkpRYp6vLxGV_nX4T9Mgs7q9e-OQ2NviFlm9dMOS76RexHzPdU-Hl0t_bz9k7luVHkPkbtJtah6D7SrFV2w73qT4dmIzQOuQr5q1yP2x8-tpVkSz8GXodl7ydevcdXJVQausWxoMS3NOaiMSsGE5x--s9PXNGTWkIq3tUandhDyrSw6ZmUBjuISow1zOU19NUK9ZZjtjzsKh2E_AOUyxayaWIHRPneE3V5b7Xyr8zkkIfjloM" }
    ]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  const menuContainer = document.getElementById('menu-container');
  if (menuContainer) {
    menuContainer.innerHTML = menuData.map((section, idx) => `
      <section class="scroll-mt-32">
        <div class="flex items-center gap-4 mb-10">
          <h3 class="text-3xl font-bold text-primary">${section.category}</h3>
          <div class="h-[1px] flex-1 bg-primary/20"></div>
        </div>
        <div class="grid lg:grid-cols-2 gap-12">
          <div class="space-y-8">
            ${section.items.map((item, i) => `
              <div class="group flex justify-between items-start gap-4 border-b border-primary/10 pb-6 animate-fade-in-up" style="animation-delay: ${i * 100}ms">
                <div class="space-y-1">
                  <h4 class="text-lg font-bold group-hover:text-primary transition-colors">${item.name}</h4>
                  <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">${item.desc}</p>
                  <button class="add-to-cart-btn mt-3 gap-2 uppercase tracking-wider text-xs inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground h-8 px-3 py-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    Thêm vào giỏ
                  </button>
                </div>
                <span class="text-lg font-medium text-primary">${item.price}</span>
              </div>
            `).join('')}
          </div>
          <div class="rounded-xl overflow-hidden h-[400px]">
            <img 
              src="${section.items[0].img}" 
              alt="${section.category}" 
              class="h-full w-full object-cover"
              referrerpolicy="no-referrer"
            />
          </div>
        </div>
      </section>
    `).join('');

    // Add event listeners for Add to Cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
          window.location.href = '/pages/login.html';
          return;
        }
        alert('Đã thêm vào giỏ hàng!');
      });
    });
  }
});
