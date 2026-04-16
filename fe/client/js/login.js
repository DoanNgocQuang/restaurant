import { renderNavbar } from '../components/index.js';

function resolvePageUrl(relativePath) {
  return new URL(relativePath, window.location.href).href;
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        const response = await fetch('http://localhost:8080/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          alert(data.message || 'Đăng nhập thành công!');
          
          if (data.data.user.role === 'ADMIN') {
            window.location.href = resolvePageUrl('../admin/');
          } else {
            window.location.href = resolvePageUrl('./index.html');
          }
        } else {
          alert(data.message || 'Đăng nhập thất bại. Kiểm tra lại thông tin.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Có lỗi xảy ra khi kết nối đến server.');
      }
    });
  }
});
