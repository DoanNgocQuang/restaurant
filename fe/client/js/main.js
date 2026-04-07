import { renderNavbar, renderFooter } from '../components/index.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // Hero Actions
  const heroActions = document.getElementById('hero-actions');
  if (heroActions) {
    if (isLoggedIn) {
      heroActions.innerHTML = `
        <a href="/pages/reservations.html" class="w-full sm:w-auto">
          <button class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-8 text-white">Đặt chỗ ngay</button>
        </a>
        <a href="/pages/menu.html" class="w-full sm:w-auto">
          <button class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 h-11 px-8">Xem thực đơn</button>
        </a>
      `;
    } else {
      heroActions.innerHTML = `
        <a href="/pages/login.html" class="w-full sm:w-auto">
          <button class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-8 text-white">Đăng nhập để đặt bàn</button>
        </a>
        <a href="/pages/menu.html" class="w-full sm:w-auto">
          <button class="w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 h-11 px-8">Xem thực đơn</button>
        </a>
      `;
    }
  }

  // CTA Actions
  const ctaActions = document.getElementById('cta-actions');
  if (ctaActions) {
    if (isLoggedIn) {
      ctaActions.innerHTML = `
        <a href="/pages/reservations.html" class="w-full sm:w-auto">
          <button class="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-white text-primary shadow-xl hover:bg-white/90 h-11 px-8">Đặt bàn của bạn</button>
        </a>
        <button class="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-white/30 bg-white/10 text-white hover:bg-white/20 h-11 px-8">Gọi +1 (555) 0123</button>
      `;
    } else {
      ctaActions.innerHTML = `
        <a href="/pages/login.html" class="w-full sm:w-auto">
          <button class="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-white text-primary shadow-xl hover:bg-white/90 h-11 px-8">Đăng nhập để đặt bàn</button>
        </a>
        <button class="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-white/30 bg-white/10 text-white hover:bg-white/20 h-11 px-8">Gọi +1 (555) 0123</button>
      `;
    }
  }

  // Dishes
  const dishesContainer = document.getElementById('dishes-container');
  if (dishesContainer) {
    const dishes = [
      {
        name: "Thăn lưng Wagyu A5",
        price: "$120",
        desc: "Khoai tây nghiền nấm Truffle, bông cải xanh nướng và sốt rượu Cabernet đậm đà.",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXcK1KVcOgzP0t2YiRvgJ8c6uOS0FqgsdMJQbEqGFpsjurWQj54zBsZP5VZTjQMzKb0BoqOSJALXSigfQAgdo266IhiFEhUTN6Kuh-hqRRRlhpnYpfeJ2KHxYkEJ_PXBD49E2JVwvLMj_NF4Tdvfqu0FPZ1thIJI2f1yKiNU-MluZn7SmmkyNHyvgcTw5cEde60_m2qaT07KnujkbTvxmHS2jWKimFYLf68JxxI44vm-LPHKDVUIvEnzUF5TM1Mpasu6S_yRe5zSd3",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15.47 9.3 4.69-4.69a2 2 0 0 0-2.83-2.83l-4.69 4.69a2 2 0 0 0-.5.86l-1.04 3.12a2 2 0 0 0 2.53 2.53l3.12-1.04a2 2 0 0 0 .86-.5Z"/><path d="m10.5 13.5-8.1 8.1a2 2 0 0 0 2.83 2.83l8.1-8.1"/></svg>'
      },
      {
        name: "Sò điệp Đại Tây Dương",
        price: "$48",
        desc: "Sò điệp Hokkaido với đậu hà lan nghiền, dầu bạc hà và giăm bông Serrano giòn.",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAj15H7V-QLxF7ftmHz5mQD0Ef-Wi7-8SUgKAGVGcJsd0q6Ux22edDaIYwZ5BLjm8D_eM6zfeOPonpdHfsYIvZovwVXnj2j7PSTP4dCsXyxGH094UdyXQc4AdD6ljAaLZ9yzqtIYE_sPILwun806XCOXHB-tj2_a-JJYUNI_dj7s04kANgqAAPu_KZlgWLtrqOhIAyVBhmHkGWW5tkHTswxk3WudF5-ZwMKAd9DCndXthfOihhjM2GpVEwwly496DxfCdyU8LViKLBC",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>'
      },
      {
        name: "Tôm hùm Saffron",
        price: "$65",
        desc: "Đuôi tôm hùm Maine chần bơ dùng kèm cơm Risotto nghệ tây béo ngậy.",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuABO9jWLxf-LdLbfry7_aDgUpNel7NjaEt4Hgj5Ol57GeHxZ7bhPOMixKhaOP4_9EtWRgsK4UbvPkUv74-CQAqumw8OeAUo5TLdcrulepDNHstXoTNDd4rBwIYbypuWflGe9sq2NpkOBlNStMl0s5yezuV0Nwb5Q3U85s4DalHGLaIDiu5KdKPsOf0sLmOX4w6iHVHufBde4juKfdjCShluUpLr3NYtNwveG7vooIQUY03QT2BNgEWwfFbvPZUGbEHGhHn7QUNdHcbP",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m8 8 7 7"/></svg>'
      }
    ];

    dishesContainer.innerHTML = dishes.map(dish => `
      <div class="group relative overflow-hidden rounded-xl bg-white dark:bg-bg-dark border border-primary/10 transition-transform duration-300 hover:-translate-y-2">
        <div class="h-64 overflow-hidden">
          <img 
            src="${dish.img}" 
            alt="${dish.name}" 
            class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerpolicy="no-referrer"
          />
        </div>
        <div class="p-6">
          <div class="flex justify-between items-start mb-2">
            <h4 class="text-xl font-bold">${dish.name}</h4>
            <span class="text-primary font-black">${dish.price}</span>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">${dish.desc}</p>
          <div class="text-primary">
            ${dish.icon}
          </div>
        </div>
      </div>
    `).join('');
  }
});
