// Movie App - Static Frontend với Google Drive Integration
class MovieApp {
    constructor() {
        this.movies = [];
        this.filteredMovies = [];
        this.currentFilter = 'all';
        this.currentSort = 'title';
        this.currentView = 'grid';
        this.currentPage = 1;
        this.moviesPerPage = 12;
        this.watchHistory = this.loadWatchHistory();
        
        this.init();
    }

    async init() {
        try {
            await this.loadMovies();
            this.setupUI();
            this.handleUrlParameters();
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
            const response = await fetch('data/movies.json');
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

    handleUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const genre = urlParams.get('genre');
        const search = urlParams.get('search');

        if (category) {
            this.currentFilter = category;
            this.setActiveFilterByCategory(category);
        }

        if (genre) {
            this.currentFilter = 'all';
            this.filterMoviesByGenre(genre);
            return; // Don't apply other filters if genre is specified
        }

        if (search) {
            const searchInput = document.querySelector('#search-input');
            if (searchInput) {
                searchInput.value = search;
                this.filterMovies(search);
            }
        }
    }

    setActiveFilterByCategory(category) {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.filter === category) {
                btn.classList.add('active');
            }
        });
    }

    filterMoviesByGenre(genre) {
        this.filteredMovies = this.movies.filter(movie => 
            movie.genre.includes(genre)
        );
        this.sortMovies();
    }

    renderMovies() {
        const moviesContainer = document.querySelector('#movies-container');
        if (!moviesContainer) {
            console.error('Không tìm thấy container #movies-container');
            return;
        }

        // Reset page khi filter mới
        if (this.currentPage === 1) {
            moviesContainer.innerHTML = '';
        }

        if (this.filteredMovies.length === 0) {
            moviesContainer.innerHTML = '<p class="no-results">Không tìm thấy phim nào</p>';
            this.hideLoadMoreButton();
            return;
        }

        // Tính toán phim hiển thị cho trang hiện tại
        const startIndex = (this.currentPage - 1) * this.moviesPerPage;
        const endIndex = startIndex + this.moviesPerPage;
        const moviesToShow = this.filteredMovies.slice(startIndex, endIndex);

        moviesToShow.forEach(movie => {
            const movieCard = this.createMovieCard(movie);
            moviesContainer.appendChild(movieCard);
        });

        // Hiển thị/ẩn nút load more
        this.updateLoadMoreButton();
    }

    createMovieCard(movie) {
        const article = document.createElement('article');
        article.className = `movie-card ${this.currentView === 'list' ? 'list-view' : ''}`;
        article.dataset.movieId = movie.id;

        // Kiểm tra xem phim đã xem chưa
        const isWatched = this.watchHistory.includes(movie.id);
        const watchedBadge = isWatched ? '<span class="watched-badge">Đã xem</span>' : '';

        // Tạo poster image với ImageManager
        const posterUrl = ImageUtils.getPosterUrl(movie, this.getOptimalImageSize());
        
        article.innerHTML = `
            <div class="movie-poster">
                <img data-src="${posterUrl}" alt="${movie.title}" class="lazy-image">
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

        // Setup lazy loading for the image
        const img = article.querySelector('img');
        if (window.imageManager) {
            window.imageManager.observeImage(img);
        }

        return article;
    }

    /**
     * Xác định kích thước hình ảnh tối ưu dựa trên view
     * @returns {string} - Kích thước hình ảnh
     */
    getOptimalImageSize() {
        if (this.currentView === 'list') {
            return 'medium';
        }
        
        const width = window.innerWidth;
        if (width <= 480) {
            return 'small';
        } else if (width <= 768) {
            return 'medium';
        } else {
            return 'large';
        }
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

        // View switching
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreMovies();
            });
        }
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
        this.currentPage = 1; // Reset page khi filter
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
                ${recentMovies.map(movie => {
                    const thumbnailUrl = ImageUtils.getThumbnailUrl(movie, 'small');
                    return `
                        <div class="history-item" onclick="app.watchMovie('${movie.id}')">
                            <img data-src="${thumbnailUrl}" alt="${movie.title}" class="lazy-image">
                            <span>${movie.title}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;

        // Setup lazy loading for history images
        const historyImages = historyContainer.querySelectorAll('img[data-src]');
        historyImages.forEach(img => {
            if (window.imageManager) {
                window.imageManager.observeImage(img);
            }
        });
    }

    setupLazyLoading() {
        // Prefer centralized ImageManager if available to avoid duplicate observers
        const lazyImages = document.querySelectorAll('img[data-src]');
        if (window.imageManager && typeof window.imageManager.observeImage === 'function') {
            lazyImages.forEach(img => {
                window.imageManager.observeImage(img);
            });
            return;
        }

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        // remove the project's lazy-image class when loaded
                        img.classList.remove('lazy-image');
                        observer.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    switchView(view) {
        this.currentView = view;
        
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        // Update movies container class
        const moviesContainer = document.querySelector('.movies');
        if (moviesContainer) {
            moviesContainer.className = view === 'list' ? 'movies list-view' : 'movies';
        }
        
        // Re-render movies với view mới
        this.currentPage = 1;
        this.renderMovies();
    }

    loadMoreMovies() {
        const totalPages = Math.ceil(this.filteredMovies.length / this.moviesPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderMovies();
        }
    }

    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more');
        if (!loadMoreBtn) return;
        
        const totalPages = Math.ceil(this.filteredMovies.length / this.moviesPerPage);
        const hasMore = this.currentPage < totalPages;
        
        if (hasMore) {
            loadMoreBtn.style.display = 'block';
            loadMoreBtn.textContent = `Xem thêm (${this.filteredMovies.length - (this.currentPage * this.moviesPerPage)} phim còn lại)`;
        } else {
            this.hideLoadMoreButton();
        }
    }

    hideLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }

    showError(message) {
        const moviesContainer = document.querySelector('#movies-container');
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
