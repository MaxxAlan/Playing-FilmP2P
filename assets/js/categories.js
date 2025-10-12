// assets/js/categories.js - PHIÊN BẢN MỚI

class MovieListPage {
    constructor() {
        // DOM elements
        this.listContainer = document.getElementById('list');
        this.categorySelect = document.getElementById('categorySelect');
        this.genreInput = document.getElementById('genreInput');

        // Data
        this.allMovies = []; // Lưu trữ toàn bộ phim
        this.filteredMovies = []; // Lưu trữ phim đã được lọc

        this.init();
    }

    async init() {
        try {
            await this.loadMovies();
            this.renderMovies(this.allMovies); // Hiển thị tất cả lúc đầu
            this.bindEvents();
        } catch (error) {
            console.error('Lỗi khi khởi tạo trang:', error);
            this.showError('Không thể tải danh sách phim. Vui lòng thử lại sau.');
        }
    }

    async loadMovies() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/crytals-sc/json-link/refs/heads/main/movies.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.allMovies = await response.json();
            console.log('Tải thành công', this.allMovies.length, 'phim.');
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu phim:', error);
            throw error;
        }
    }

    bindEvents() {
        // Lắng nghe sự kiện trên cả 2 bộ lọc
        this.categorySelect.addEventListener('change', () => this.applyFilters());
        this.genreInput.addEventListener('input', () => this.applyFilters());
    }

    applyFilters() {
        const selectedCategory = this.categorySelect.value;
        const searchGenre = this.genreInput.value.toLowerCase().trim();

        this.filteredMovies = this.allMovies.filter(movie => {
            // Lọc theo category
            const categoryMatch = !selectedCategory || movie.category === selectedCategory;

            // Lọc theo genre
            const genreMatch = !searchGenre || 
                (Array.isArray(movie.genre) && movie.genre.some(g => g.toLowerCase().includes(searchGenre)));
            
            return categoryMatch && genreMatch;
        });

        this.renderMovies(this.filteredMovies);
    }

// Thay thế hàm renderMovies trong file categories.js
renderMovies(moviesToRender) {
    // Xóa danh sách cũ
    this.listContainer.innerHTML = '';

    if (moviesToRender.length === 0) {
        this.listContainer.innerHTML = '<p class="no-results">Không tìm thấy phim nào phù hợp.</p>';
        return;
    }

    moviesToRender.forEach(movie => {
        const movieLink = `movie.html?id=${movie.id}`;
        let tagsHTML = '';
        if (Array.isArray(movie.genre) && movie.genre.length > 0) {
            tagsHTML = movie.genre.map(g => `<span class="tag">${g}</span>`).join('');
        }
        
        const movieCard = document.createElement('article');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <div class="card-image">
                <img class="poster" src="${movie.poster}" alt="${movie.title}" loading="lazy" />
                <div class="card-overlay">
                    <div class="overlay-content">
                        <div class="overlay-meta">
                            <span>${movie.year || ''}</span> •
                            <span>${movie.duration || ''}</span> •
                            <span class="rating">⭐ ${movie.rating || ''}</span>
                        </div>
                        <div class="overlay-tags">${tagsHTML}</div>
                        <div class="overlay-actions">
                            <a class="btn primary" href="${movieLink}">Xem ngay</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-base-info">
                <h3 class="movie-title"><a href="${movieLink}">${movie.title}</a></h3>
                <p class="movie-year">${movie.year || ''}</p>
            </div>
        `;
        this.listContainer.appendChild(movieCard);
    });
}

    showError(message) {
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `<div class="error-container"><p>${message}</p></div>`;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MovieListPage();
});