import { renderNavbar, renderFooter } from '../components/index.js';

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const fullname = document.getElementById('fullname').value;
      const phone = document.getElementById('phone').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullname, phone, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          alert(data.message || 'Đăng ký thành công!');
          window.location.href = '/pages/index.html';
        } else {
          alert(data.message || 'Đăng ký thất bại. Email có thể đã tồn tại.');
        }
      } catch (error) {
        console.error('Register error:', error);
        alert('Có lỗi xảy ra khi kết nối đến server.');
      }
    });
  }
});
