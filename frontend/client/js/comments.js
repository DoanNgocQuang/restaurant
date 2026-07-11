// Comments Module for Client
const API = 'http://localhost:8080/api';

const getToken = () => localStorage.getItem('token');
const getUserId = () => JSON.parse(localStorage.getItem('user')).id;

async function fetchAPI(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
            ...options.headers
        },
        ...options
    });

    const json = await response.json();
    if (!response.ok || json?.status === 'error') {
        throw new Error(json?.message || 'API error');
    }

    return json.data;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function renderStars(rating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(i <= rating ? '⭐' : '☆');
    }
    return stars.join('');
}

export async function renderCommentSection(itemId, itemType = 'food') {
    const commentContainer = document.getElementById('comments-section');
    if (!commentContainer) return;

    try {
        const endpoint = itemType === 'combo'
            ? `${API}/comments/combo/${itemId}`
            : `${API}/comments/food/${itemId}`;

        const comments = await fetchAPI(endpoint);
        const currentUserId = getUserId();

        let html = `
      <div class="mt-8 border-t border-white/10 pt-8">
        <h3 class="mb-6 text-2xl font-bold text-white">Đánh giá từ khách hàng</h3>
    `;

        // Average rating
        if (comments.length > 0) {
            const avgRating = comments.reduce((sum, c) => sum + c.rating, 0) / comments.length;
            html += `
        <div class="mb-6 rounded-xl bg-white/5 p-4 backdrop-blur-md">
          <div class="flex items-center gap-3">
            <div class="text-3xl font-bold text-primary">${avgRating.toFixed(1)}</div>
            <div>
              <div class="text-lg font-semibold text-white">${renderStars(Math.round(avgRating))}</div>
              <p class="text-sm text-slate-400">Trung bình từ ${comments.length} đánh giá</p>
            </div>
          </div>
        </div>
      `;
        }

        // Add comment form for logged-in users
        if (getToken() && currentUserId) {
            html += `
        <div class="mb-8 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
          <h4 class="mb-4 text-lg font-semibold text-white">Thêm đánh giá của bạn</h4>
          <form id="comment-form" class="space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-300">Đánh giá</label>
              <div class="flex gap-2">
                ${[1, 2, 3, 4, 5].map(i => `
                  <input type="radio" id="star-${i}" name="rating" value="${i}" class="hidden" />
                  <label for="star-${i}" class="cursor-pointer text-3xl transition hover:scale-110">☆</label>
                `).join('')}
              </div>
              <input type="hidden" id="rating-value" value="0" />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-slate-300">Bình luận</label>
              <textarea id="comment-content" placeholder="Chia sẻ trải nghiệm của bạn về ${itemType === 'combo' ? 'combo' : 'món ăn'} này..." 
                class="w-full rounded-lg border border-white/20 bg-black/50 px-4 py-2 text-white placeholder-slate-500 focus:border-primary focus:outline-none"
                rows="3" required></textarea>
            </div>
            <button type="submit" class="rounded-lg bg-primary px-4 py-2 font-semibold text-black transition hover:scale-105">
              Gửi đánh giá
            </button>
          </form>
        </div>
      `;
        } else if (!getToken()) {
            html += `
        <div class="mb-8 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm text-slate-300">
          <a href="/pages/login.html" class="underline hover:text-primary">Đăng nhập</a> để viết bình luận
        </div>
      `;
        }

        // Comments list
        if (comments.length > 0) {
            html += `
        <div class="space-y-4">
          ${comments.map(comment => `
            <div class="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur-md">
              <div class="flex items-start justify-between">
                <div>
                  <div class="flex items-center gap-2">
                    <p class="font-semibold text-white">${comment.userName}</p>
                    <span class="text-sm text-primary">${renderStars(comment.rating)}</span>
                  </div>
                  <p class="text-xs text-slate-400">${formatDate(comment.created_at)}</p>
                </div>
                ${currentUserId && currentUserId == comment.userId ? `
                  <div class="flex gap-2">
                    <button class="edit-comment text-xs text-slate-400 hover:text-primary" data-id="${comment.id}">Sửa</button>
                    <button class="delete-comment text-xs text-slate-400 hover:text-red-500" data-id="${comment.id}">Xoá</button>
                  </div>
                ` : ''}
              </div>
              <p class="mt-3 rounded-xl bg-black/20 px-4 py-3 text-slate-300 whitespace-pre-wrap break-words leading-7">${comment.content.trim()}</p>
            </div>
          `).join('')}
        </div>
      `;
        } else {
            html += `<p class="text-center text-slate-400">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>`;
        }

        html += `</div>`;
        commentContainer.innerHTML = html;

        // Setup event listeners
        if (getToken() && currentUserId) {
            setupCommentForm(itemId, currentUserId, itemType);
        }

        setupEditDeleteButtons(itemId, itemType);
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

function setupCommentForm(itemId, userId, itemType = 'food') {
    const form = document.getElementById('comment-form');
    const starInputs = document.querySelectorAll('input[name="rating"]');
    const stars = document.querySelectorAll('[for^="star-"]');
    const ratingValue = document.getElementById('rating-value');

    starInputs.forEach((input, index) => {
        input.addEventListener('change', () => {
            ratingValue.value = input.value;
            stars.forEach((star, i) => {
                star.textContent = i < input.value ? '⭐' : '☆';
            });
        });

        stars[index].addEventListener('click', () => {
            input.click();
        });

        stars[index].addEventListener('mouseover', () => {
            stars.forEach((s, i) => {
                s.textContent = i <= index ? '⭐' : '☆';
            });
        });
    });

    const starsContainer = document.querySelector('.flex.gap-2');
    starsContainer?.addEventListener('mouseleave', () => {
        const currentRating = parseInt(ratingValue.value) || 0;
        stars.forEach((star, i) => {
            star.textContent = i < currentRating ? '⭐' : '☆';
        });
    });

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = document.getElementById('comment-content').value;
        const rating = parseInt(document.getElementById('rating-value').value);

        if (!content.trim() || !rating) {
            alert('Vui lòng nhập bình luận và chọn đánh giá');
            return;
        }

        try {
            const endpoint = itemType === 'combo'
                ? `${API}/comments/combo/${itemId}?userId=${userId}`
                : `${API}/comments/food/${itemId}?userId=${userId}`;

            await fetchAPI(endpoint, {
                method: 'POST',
                body: JSON.stringify({ content, rating })
            });

            alert('Bình luận đã được gửi thành công!');
            renderCommentSection(itemId, itemType);
        } catch (error) {
            alert(`Lỗi: ${error.message}`);
        }
    });
}

function setupEditDeleteButtons(itemId, itemType = 'food') {
    document.querySelectorAll('.delete-comment').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if (!confirm('Bạn chắc chắn muốn xoá bình luận này?')) return;

            try {
                const commentId = btn.dataset.id;
                const userId = getUserId();
                await fetchAPI(`${API}/comments/${commentId}?userId=${userId}`, {
                    method: 'DELETE'
                });
                alert('Bình luận đã được xoá');
                renderCommentSection(itemId, itemType);
            } catch (error) {
                alert(`Lỗi: ${error.message}`);
            }
        });
    });

    document.querySelectorAll('.edit-comment').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const commentId = btn.dataset.id;
            const userId = getUserId();

            try {
                const comment = await fetchAPI(`${API}/comments/${commentId}`);
                const newContent = prompt('Sửa bình luận:', comment.content);
                if (!newContent) return;

                const newRating = prompt('Sửa đánh giá (1-5):', comment.rating);
                if (!newRating || newRating < 1 || newRating > 5) return;

                await fetchAPI(`${API}/comments/${commentId}?userId=${userId}`, {
                    method: 'PUT',
                    body: JSON.stringify({ content: newContent, rating: parseInt(newRating) })
                });

                alert('Bình luận đã được cập nhật');
                renderCommentSection(itemId, itemType);
            } catch (error) {
                alert(`Lỗi: ${error.message}`);
            }
        });
    });
}
