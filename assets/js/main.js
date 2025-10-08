// Movie App - Static Frontend với Google Drive Integration
class MovieApp {
    constructor() {
        this.movies = [];
        this.filteredMovies = [];
        this.currentFilter = 'all';
        this.currentSort = 'title';
        this.watchHistory = this.loadWatchHistory();
        
        this.init();
    }

    async init() {
        try {
            await this.loadMovies();
            this.setupUI();
            this.renderMovies();
            this.bindEvents();
            this.renderWatchHistory();
        } catch (error) {
            console.error('Lỗi khi khởi tạo ứng dụng:', error);
            this.showError('Không thể tải danh sách phim');
        }
    }

    async loadMovies() {
        try {
            const response = await fetch('./data/movies.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.movies = await response.json();
            this.filteredMovies = [...this.movies];
            console.log('Đã tải', this.movies.length, 'phim');
        } catch (error) {
            console.error('Lỗi khi tải danh sách phim:', error);
            throw error;
        }
    }

    setupUI() {
        // Tạo filter buttons
        const categories = [...new Set(this.movies.map(m => m.category))];
        const filterContainer = document.querySelector('.filter-buttons');
        if (filterContainer) {
            filterContainer.innerHTML = `
                <button class="filter-btn active" data-filter="all">Tất cả</button>
                ${categories.map(cat => 
                    `<button class="filter-btn" data-filter="${cat}">${this.formatCategory(cat)}</button>`
                ).join('')}
            `;
        }

        // Tạo sort dropdown
        const sortContainer = document.querySelector('.sort-container');
        if (sortContainer) {
            sortContainer.innerHTML = `
                <select id="sort-select">
                    <option value="title">Sắp xếp theo tên</option>
                    <option value="year">Sắp xếp theo năm</option>
                    <option value="rating">Sắp xếp theo đánh giá</option>
                    <option value="duration">Sắp xếp theo thời lượng</option>
                </select>
            `;
        }
    }

    formatCategory(category) {
        const categoryNames = {
            'phim-le': 'Phim Lẻ',
            'phim-bo': 'Phim Bộ',
            'phim-hoat-hinh': 'Phim Hoạt Hình',
            'phim-tai-lieu': 'Phim Tài Liệu'
        };
        return categoryNames[category] || category;
    }

    renderMovies() {
        const moviesContainer = document.querySelector('.movies');
        if (!moviesContainer) {
            console.error('Không tìm thấy container .movies');
            return;
        }

        moviesContainer.innerHTML = '';

        if (this.filteredMovies.length === 0) {
            moviesContainer.innerHTML = '<p class="no-results">Không tìm thấy phim nào</p>';
            return;
        }

        this.filteredMovies.forEach(movie => {
            const movieCard = this.createMovieCard(movie);
            moviesContainer.appendChild(movieCard);
        });
    }

    createMovieCard(movie) {
        const article = document.createElement('article');
        article.className = 'movie-card';
        article.dataset.movieId = movie.id;

        // Kiểm tra xem phim đã xem chưa
        const isWatched = this.watchHistory.includes(movie.id);
        const watchedBadge = isWatched ? '<span class="watched-badge">Đã xem</span>' : '';

        article.innerHTML = `
            <div class="movie-poster">
                <img src="${movie.poster}" alt="${movie.title}" 
                     onerror="this.src='https://via.placeholder.com/300x450/333333/FFFFFF?text=No+Image'">
                ${watchedBadge}
                <div class="movie-overlay">
                    <button class="watch-btn" data-movie-id="${movie.id}">
                        <span class="play-icon">▶</span>
                        Xem ngay
                    </button>
                </div>
            </div>
            <div class="movie-info">
                <h2>${movie.title}</h2>
                <p class="description">${movie.desc}</p>
                <div class="movie-meta">
                    <span class="year">${movie.year}</span>
                    <span class="duration">${movie.duration}</span>
                    <div class="rating">
                        ${Utils.generateStars(movie.rating)}
                        <span class="rating-value">${movie.rating}</span>
                    </div>
                </div>
                <div class="genres">
                    ${movie.genre.map(g => `<span class="genre-tag">${g}</span>`).join('')}
                </div>
            </div>
        `;

        return article;
    }

    bindEvents() {
        // Xử lý sự kiện click nút "Xem ngay"
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('watch-btn') || e.target.closest('.watch-btn')) {
                const btn = e.target.closest('.watch-btn');
                const movieId = btn.dataset.movieId;
                this.watchMovie(movieId);
            }
        });

        // Xử lý tìm kiếm
        const searchInput = document.querySelector('#search-input');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.filterMovies(e.target.value);
            }, 300));
        }

        // Xử lý filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setActiveFilter(e.target);
                this.currentFilter = e.target.dataset.filter;
                this.applyFilters();
            });
        });

        // Xử lý sort
        const sortSelect = document.querySelector('#sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFilters();
            });
        }

        // Lazy load images
        this.setupLazyLoading();
    }

    setActiveFilter(activeBtn) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    filterMovies(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        
        this.filteredMovies = this.movies.filter(movie => {
            const matchesSearch = !term || 
                movie.title.toLowerCase().includes(term) ||
                movie.desc.toLowerCase().includes(term) ||
                movie.genre.some(g => g.toLowerCase().includes(term));
            
            const matchesCategory = this.currentFilter === 'all' || 
                movie.category === this.currentFilter;
            
            return matchesSearch && matchesCategory;
        });

        this.sortMovies();
        this.renderMovies();
    }

    applyFilters() {
        const searchInput = document.querySelector('#search-input');
        const searchTerm = searchInput ? searchInput.value : '';
        this.filterMovies(searchTerm);
    }

    sortMovies() {
        this.filteredMovies.sort((a, b) => {
            switch (this.currentSort) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'year':
                    return b.year - a.year;
                case 'rating':
                    return b.rating - a.rating;
                case 'duration':
                    const aDuration = parseInt(a.duration);
                    const bDuration = parseInt(b.duration);
                    return bDuration - aDuration;
                default:
                    return 0;
            }
        });
    }

    watchMovie(movieId) {
        const movie = this.movies.find(m => m.id === movieId);
        if (movie) {
            // Lưu vào lịch sử xem
            this.addToWatchHistory(movieId);
            
            // Chuyển đến trang xem phim với ID
            window.location.href = `movie.html?id=${movieId}`;
        }
    }

    // Watch History Management
    loadWatchHistory() {
        return Utils.getFromStorage('watchHistory', []);
    }

    addToWatchHistory(movieId) {
        if (!this.watchHistory.includes(movieId)) {
            this.watchHistory.unshift(movieId);
            // Giới hạn lịch sử 50 phim gần nhất
            this.watchHistory = this.watchHistory.slice(0, 50);
            Utils.saveToStorage('watchHistory', this.watchHistory);
            this.renderWatchHistory();
        }
    }

    renderWatchHistory() {
        const historyContainer = document.querySelector('.watch-history');
        if (!historyContainer) return;

        if (this.watchHistory.length === 0) {
            historyContainer.innerHTML = '<p class="no-history">Chưa có lịch sử xem</p>';
            return;
        }

        const recentMovies = this.watchHistory.slice(0, 5).map(id => 
            this.movies.find(m => m.id === id)
        ).filter(Boolean);

        historyContainer.innerHTML = `
            <h3>Đã xem gần đây</h3>
            <div class="history-grid">
                ${recentMovies.map(movie => `
                    <div class="history-item" onclick="app.watchMovie('${movie.id}')">
                        <img src="${movie.poster}" alt="${movie.title}">
                        <span>${movie.title}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    showError(message) {
        const moviesContainer = document.querySelector('.movies');
        if (moviesContainer) {
            moviesContainer.innerHTML = `
                <div class="error-message">
                    <h3>Lỗi</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()">Thử lại</button>
                </div>
            `;
        }
    }
}

// Khởi tạo ứng dụng khi DOM đã load
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MovieApp();
});
