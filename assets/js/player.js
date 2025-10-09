// assets/js/player.js
// Video player with Google Drive integration for movie.html
// Handles embedding Google Drive video preview iframe
// Supports basic fullscreen (via iframe allowFullscreen)
// Auto-resume, keyboard shortcuts are planned but not implemented yet (as per README: null)

document.addEventListener('DOMContentLoaded', function() {
    showLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (!movieId) {
        showError('Không tìm thấy ID phim. Vui lòng quay lại trang chủ.');
        return;
    }

    fetch('data/movies.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load movies.json');
            }
            return response.json();
        })
        .then(movies => {
            const movie = movies.find(m => m.id === movieId);
            if (!movie) {
                showError('Không tìm thấy phim với ID này.');
                return;
            }

            const playerContainer = document.getElementById('player-container');
            if (!playerContainer) {
                showError('Không tìm thấy phần phát video.');
                return;
            }

            updateMovieInfo(movie);
            addToWatchHistory(movieId);
            wireActions(movie);
            showLoading(false);
        })
        .catch(() => {
            showError('Lỗi khi tải thông tin phim. Vui lòng thử lại sau.');
        });
});

// Function to update movie info on the page
function updateMovieInfo(movie) {
    const titleNav = document.querySelector('#movie-title');
    const titleDetail = document.querySelector('#movie-title-detail');
    if (titleNav) titleNav.textContent = movie.title;
    if (titleDetail) titleDetail.textContent = movie.title;

    const yearEl = document.querySelector('#movie-year');
    const durationEl = document.querySelector('#movie-duration');
    const ratingEl = document.querySelector('#movie-rating');
    if (yearEl) yearEl.textContent = movie.year;
    if (durationEl) durationEl.textContent = movie.duration;
    if (ratingEl) ratingEl.textContent = `⭐ ${movie.rating}`;

    const descEl = document.querySelector('#movie-desc');
    if (descEl) descEl.textContent = movie.desc;

    const genreWrap = document.querySelector('#movie-genre');
    if (genreWrap && Array.isArray(movie.genre)) {
        genreWrap.innerHTML = movie.genre.map(g => `<span class="genre-tag">${g}</span>`).join('');
    }

    const posterEl = document.querySelector('#movie-poster');
    if (posterEl) {
        const posterUrl = (window.ImageUtils && typeof ImageUtils.getPosterUrl === 'function')
            ? ImageUtils.getPosterUrl(movie, 'medium')
            : (movie.poster && (movie.poster.medium || movie.poster.large || movie.poster.small || movie.poster.original)) || '';
        if (posterUrl) {
            posterEl.src = posterUrl;
            posterEl.alt = movie.title;
            if (window.imageManager) window.imageManager.observeImage(posterEl);
        }
    }

    const galleryWrap = document.querySelector('#movie-gallery-images');
    if (galleryWrap && movie.images && Array.isArray(movie.images.gallery)) {
        galleryWrap.innerHTML = movie.images.gallery.map(src => {
            return `<img data-src="${src}" alt="${movie.title}" class="lazy-image">`;
        }).join('');
        if (window.imageManager) {
            galleryWrap.querySelectorAll('img[data-src]').forEach(img => window.imageManager.observeImage(img));
        }
    }
}

// Function to show error message
function showError(message) {
    const msg = typeof message === 'string' ? message : 'Đã xảy ra lỗi';
    const overlay = document.getElementById('error-overlay');
    const text = document.getElementById('error-message');
    if (text) text.textContent = msg;
    if (overlay) overlay.style.display = 'flex';
    showLoading(false);
}

// Function to toggle loading state
function showLoading(isLoading) {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = isLoading ? 'flex' : 'none';
    }
}

// Future keyboard handler
// function handleKeyboard(event) {
//     // Example: Space for play/pause, arrows for seek
//     // Would require communication with iframe content (postMessage if possible)
// }

// Additional utilities if needed (e.g., for fullscreen toggle)
function toggleFullscreen() {
    const player = document.querySelector('iframe');
    if (player) {
        if (!document.fullscreenElement) {
            player.requestFullscreen().catch(err => console.error('Fullscreen error:', err));
        } else {
            document.exitFullscreen();
        }
    }
}

function addToWatchHistory(movieId) {
    try {
        const key = 'watchHistory';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        if (!list.includes(movieId)) {
            list.unshift(movieId);
            localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
        }
    } catch (_) {}
}

function wireActions(movie) {
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            createPlayer(movie);
            const container = document.getElementById('player-container');
            if (container) container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    const addBtn = document.getElementById('add-to-list-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            try {
                const key = 'myList';
                const list = JSON.parse(localStorage.getItem(key) || '[]');
                const idx = list.indexOf(movie.id);
                if (idx === -1) {
                    list.unshift(movie.id);
                    localStorage.setItem(key, JSON.stringify(list));
                    if (window.Utils && Utils.showToast) Utils.showToast('Đã thêm vào danh sách', 'success');
                } else {
                    list.splice(idx, 1);
                    localStorage.setItem(key, JSON.stringify(list));
                    if (window.Utils && Utils.showToast) Utils.showToast('Đã xóa khỏi danh sách', 'info');
                }
            } catch (_) {}
        });
    }

    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            let baseUrl;
            if (window.location.origin && window.location.origin !== 'null') {
                const origin = window.location.origin;
                const basePath = window.location.pathname.replace(/index\.html$/i, '');
                baseUrl = origin + basePath;
            } else {
                baseUrl = './';
            }
            const url = `${baseUrl}movie.html?id=${movie.id}`;
            if (navigator.share) {
                navigator.share({ title: movie.title, text: movie.title, url })
                    .catch(() => navigator.clipboard && navigator.clipboard.writeText(url));
            } else if (navigator.clipboard) {
                navigator.clipboard.writeText(url)
                    .then(() => window.Utils && Utils.showToast && Utils.showToast('Đã sao chép link', 'success'))
                    .catch(() => {});
            }
        });
    }
}

function createPlayer(movie) {
    const playerContainer = document.getElementById('player-container');
    if (!playerContainer) return;

    // Avoid duplicating the iframe
    if (playerContainer.querySelector('iframe')) return;

    if (!movie || !movie.driveId) {
        showError('Thiếu mã video.');
        return;
    }

    showLoading(true);
    const iframe = document.createElement('iframe');
    iframe.src = `https://drive.google.com/file/d/${movie.driveId}/preview`;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; fullscreen; encrypted-media; picture-in-picture';
    iframe.allowFullscreen = true;

    iframe.onload = function() { showLoading(false); };
    iframe.onerror = function() { showError('Không thể tải video.'); };

    playerContainer.appendChild(iframe);
}

// Export if using modules (but since static, likely concatenated or separate scripts)
// If using ES modules, add export default { init: () => {...} } but keeping simple for static site