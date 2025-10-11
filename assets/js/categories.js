// Categories Page Handler
class CategoriesPage {
    constructor() {
        this.movies = [];
        this.init();
    }
    async init() {
        try {
            await this.loadMovies();
            this.updateCategoryCounts();
            this.bindEvents();
        } catch (error) {
            console.error('Lỗi khi khởi tạo trang categories:', error);
            this.showError('Không thể tải dữ liệu');
        }
    }

    async loadMovies() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/crytals-sc/json-link/refs/heads/main/movies.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.movies = await response.json();
            console.log('Đã tải', this.movies.length, 'phim cho trang categories');
        } catch (error) {
            console.error('Lỗi khi tải danh sách phim:', error);
            throw error;
        }
    }

    updateCategoryCounts() {
        // Đếm phim theo category
        const categoryCounts = {};
        const genreCounts = {};

        this.movies.forEach(movie => {
            // Đếm theo category
            if (movie.category) {
                categoryCounts[movie.category] = (categoryCounts[movie.category] || 0) + 1;
            }

            // Đếm theo genre
            if (movie.genre && Array.isArray(movie.genre)) {
                movie.genre.forEach(genre => {
                    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
                });
            }
        });

        // Cập nhật số lượng phim cho category cards
        Object.keys(categoryCounts).forEach(category => {
            const card = document.querySelector(`[data-category="${category}"]`);
            if (card) {
                const countElement = card.querySelector('.movie-count');
                if (countElement) {
                    countElement.textContent = `${categoryCounts[category]} phim`;
                }
            }
        });

        // Cập nhật số lượng phim cho genre cards
        Object.keys(genreCounts).forEach(genre => {
            const card = document.querySelector(`[data-genre="${genre}"]`);
            if (card) {
                const countElement = card.querySelector('.movie-count');
                if (countElement) {
                    countElement.textContent = `${genreCounts[genre]} phim`;
                }
            }
        });

        // Cập nhật genre tags
        const genreTags = document.querySelectorAll('.genre-tag');
        genreTags.forEach(tag => {
            const genre = tag.dataset.genre;
            const count = genreCounts[genre] || 0;
            tag.title = `${count} phim`;
        });
    }

    bindEvents() {
        // Category cards click events
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                const genre = card.dataset.genre;
                
                if (category) {
                    this.navigateToCategory(category);
                } else if (genre) {
                    this.navigateToGenre(genre);
                }
            });
        });

        // Genre tags click events
        const genreTags = document.querySelectorAll('.genre-tag');
        genreTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const genre = tag.dataset.genre;
                this.navigateToGenre(genre);
            });
        });

        // Add hover effects
        categoryCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            });
        });
    }

    navigateToCategory(category) {
        // Chuyển đến trang chủ với filter category
        const categoryNames = {
            'phim-le': 'Phim Lẻ',
            'phim-bo': 'Phim Bộ',
            'phim-hoat-hinh': 'Phim Hoạt Hình',
            'phim-tai-lieu': 'Phim Tài Liệu'
        };

        const categoryName = categoryNames[category] || category;
        Utils.showToast(`Đang chuyển đến ${categoryName}...`, 'info', 1500);
        
        setTimeout(() => {
            window.location.href = `index.html?category=${category}`;
        }, 1500);
    }

    navigateToGenre(genre) {
        // Chuyển đến trang chủ với filter genre
        Utils.showToast(`Đang tìm phim thể loại ${genre}...`, 'info', 1500);
        
        setTimeout(() => {
            window.location.href = `index.html?genre=${genre}`;
        }, 1500);
    }

    showError(message) {
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `
                <div class="error-container">
                    <h2>Lỗi</h2>
                    <p>${message}</p>
                    <div class="error-actions">
                        <a href="index.html" class="back-to-home">Quay về trang chủ</a>
                        <br>
                        <button onclick="location.reload()" class="retry-btn">Thử lại</button>
                    </div>
                </div>
            `;
        }
    }
}

// Khởi tạo trang categories khi DOM đã load
document.addEventListener('DOMContentLoaded', () => {
    new CategoriesPage();
});
