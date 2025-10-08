// 404 Page Handler
class Error404Page {
    constructor() {
        this.movies = [];
        this.init();
    }

    async init() {
        try {
            await this.loadMovies();
            this.loadPopularMovies();
            this.bindEvents();
        } catch (error) {
            console.error('Lỗi khi khởi tạo trang 404:', error);
        }
    }

    async loadMovies() {
        try {
            const response = await fetch('./data/movies.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.movies = await response.json();
            console.log('Đã tải', this.movies.length, 'phim cho trang 404');
        } catch (error) {
            console.error('Lỗi khi tải danh sách phim:', error);
            // Fallback to empty array if movies can't be loaded
            this.movies = [];
        }
    }

    loadPopularMovies() {
        const popularMoviesContainer = document.getElementById('popular-movies');
        if (!popularMoviesContainer) return;

        // Get top 6 movies by rating
        const popularMovies = this.movies
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 6);

        if (popularMovies.length === 0) {
            popularMoviesContainer.innerHTML = '<p>Không có phim nào để hiển thị</p>';
            return;
        }

        popularMoviesContainer.innerHTML = popularMovies.map(movie => {
            const posterUrl = ImageUtils.getPosterUrl(movie, 'small');
            return `
                <div class="movie-suggestion" onclick="window.location.href='movie.html?id=${movie.id}'">
                    <img data-src="${posterUrl}" alt="${movie.title}" class="lazy-image">
                    <div class="movie-info">
                        <h4>${movie.title}</h4>
                        <div class="rating">
                            ${Utils.generateStars(movie.rating)}
                            <span class="rating-value">${movie.rating}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Setup lazy loading for suggestion images
        const suggestionImages = popularMoviesContainer.querySelectorAll('img[data-src]');
        suggestionImages.forEach(img => {
            if (window.imageManager) {
                window.imageManager.observeImage(img);
            }
        });
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.searchMovie();
                }
            });
        }
    }

    searchMovie() {
        const searchInput = document.getElementById('search-input');
        const query = searchInput.value.trim();
        
        if (query) {
            window.location.href = `search.html?q=${encodeURIComponent(query)}`;
        } else {
            Utils.showToast('Vui lòng nhập tên phim để tìm kiếm', 'info');
        }
    }
}

// Global function for search button
function searchMovie() {
    const errorPage = new Error404Page();
    errorPage.searchMovie();
}

// Initialize 404 page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Error404Page();
});
