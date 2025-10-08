// Search Page Handler
class SearchPage {
    constructor() {
        this.movies = [];
        this.filteredMovies = [];
        this.currentFilters = {
            genre: '',
            year: '',
            rating: '',
            sort: 'relevance'
        };
        this.searchHistory = this.loadSearchHistory();
        
        this.init();
    }

    async init() {
        try {
            await this.loadMovies();
            this.setupSearchSuggestions();
            this.bindEvents();
            this.loadUrlParams();
        } catch (error) {
            console.error('Lỗi khi khởi tạo trang search:', error);
            this.showError('Không thể tải dữ liệu');
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
            console.log('Đã tải', this.movies.length, 'phim cho trang search');
        } catch (error) {
            console.error('Lỗi khi tải danh sách phim:', error);
            throw error;
        }
    }

    loadUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        const genre = urlParams.get('genre');
        const year = urlParams.get('year');
        const rating = urlParams.get('rating');

        if (query) {
            document.getElementById('search-input').value = query;
            this.performSearch(query);
        }

        if (genre) {
            document.getElementById('genre-filter').value = genre;
            this.currentFilters.genre = genre;
        }

        if (year) {
            document.getElementById('year-filter').value = year;
            this.currentFilters.year = year;
        }

        if (rating) {
            document.getElementById('rating-filter').value = rating;
            this.currentFilters.rating = rating;
        }
    }

    setupSearchSuggestions() {
        // Lấy danh sách từ khóa gợi ý từ tên phim
        const suggestions = [...new Set(this.movies.map(movie => movie.title))].slice(0, 10);
        
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = suggestions.map(title => 
                `<div class="suggestion-item" data-title="${title}">${title}</div>`
            ).join('');
        }
    }

    bindEvents() {
        // Search input events
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.handleSearchInput(e.target.value);
            }, 300));

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput.value.trim();
                this.performSearch(query);
            });
        }

        // Filter events
        const filterSelects = document.querySelectorAll('select[id$="-filter"]');
        filterSelects.forEach(select => {
            select.addEventListener('change', (e) => {
                const filterType = e.target.id.replace('-filter', '');
                this.currentFilters[filterType] = e.target.value;
            });
        });

        // Filter buttons
        const applyBtn = document.getElementById('apply-filters');
        const clearBtn = document.getElementById('clear-filters');
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Suggestion clicks
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('suggestion-item')) {
                    const title = e.target.dataset.title;
                    searchInput.value = title;
                    this.performSearch(title);
                }
            });
        }

        // Reset search button
        const resetBtn = document.getElementById('reset-search');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.clearFilters();
                document.getElementById('search-input').value = '';
                this.filteredMovies = [...this.movies];
                this.renderResults();
            });
        }

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideSuggestions();
            }
        });
    }

    handleSearchInput(query) {
        if (query.length < 2) {
            this.hideSuggestions();
            return;
        }

        // Filter suggestions based on input
        const filteredSuggestions = this.movies
            .filter(movie => movie.title.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 5)
            .map(movie => movie.title);

        this.showSuggestions(filteredSuggestions);
    }

    showSuggestions(suggestions) {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer && suggestions.length > 0) {
            suggestionsContainer.innerHTML = suggestions.map(title => 
                `<div class="suggestion-item" data-title="${title}">${title}</div>`
            ).join('');
            suggestionsContainer.style.display = 'block';
        }
    }

    hideSuggestions() {
        const suggestionsContainer = document.getElementById('search-suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'none';
        }
    }

    performSearch(query) {
        if (!query.trim()) {
            this.filteredMovies = [...this.movies];
            this.renderResults();
            return;
        }

        // Add to search history
        this.addToSearchHistory(query);

        // Perform search
        const searchTerm = query.toLowerCase().trim();
        this.filteredMovies = this.movies.filter(movie => {
            const titleMatch = movie.title.toLowerCase().includes(searchTerm);
            const descMatch = movie.desc.toLowerCase().includes(searchTerm);
            const genreMatch = movie.genre.some(g => g.toLowerCase().includes(searchTerm));
            
            return titleMatch || descMatch || genreMatch;
        });

        // Apply current filters
        this.applyFilters();
        
        // Hide suggestions
        this.hideSuggestions();
    }

    applyFilters() {
        let filtered = [...this.filteredMovies];

        // Apply genre filter
        if (this.currentFilters.genre) {
            filtered = filtered.filter(movie => 
                movie.genre.includes(this.currentFilters.genre)
            );
        }

        // Apply year filter
        if (this.currentFilters.year) {
            if (this.currentFilters.year === 'older') {
                filtered = filtered.filter(movie => movie.year < 2015);
            } else {
                const year = parseInt(this.currentFilters.year);
                filtered = filtered.filter(movie => movie.year === year);
            }
        }

        // Apply rating filter
        if (this.currentFilters.rating) {
            const minRating = parseFloat(this.currentFilters.rating);
            filtered = filtered.filter(movie => movie.rating >= minRating);
        }

        // Sort results
        this.sortResults(filtered);

        this.filteredMovies = filtered;
        this.renderResults();
    }

    sortResults(movies) {
        const sortBy = this.currentFilters.sort;
        
        movies.sort((a, b) => {
            switch (sortBy) {
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'year':
                    return b.year - a.year;
                case 'rating':
                    return b.rating - a.rating;
                case 'relevance':
                default:
                    // For relevance, keep original order (already filtered by search)
                    return 0;
            }
        });
    }

    clearFilters() {
        // Reset filter values
        document.getElementById('genre-filter').value = '';
        document.getElementById('year-filter').value = '';
        document.getElementById('rating-filter').value = '';
        document.getElementById('sort-filter').value = 'relevance';

        // Reset current filters
        this.currentFilters = {
            genre: '',
            year: '',
            rating: '',
            sort: 'relevance'
        };

        // Reset results
        const query = document.getElementById('search-input').value.trim();
        if (query) {
            this.performSearch(query);
        } else {
            this.filteredMovies = [...this.movies];
            this.renderResults();
        }
    }

    renderResults() {
        const resultsContainer = document.getElementById('search-results');
        const noResultsContainer = document.getElementById('no-results');
        const resultsTitle = document.getElementById('results-title');
        const resultsCount = document.getElementById('results-count');

        if (!resultsContainer) return;

        // Update results info
        const count = this.filteredMovies.length;
        resultsCount.textContent = `${count} phim`;

        if (count === 0) {
            resultsContainer.style.display = 'none';
            noResultsContainer.style.display = 'block';
            resultsTitle.textContent = 'Không tìm thấy kết quả';
            return;
        }

        resultsContainer.style.display = 'grid';
        noResultsContainer.style.display = 'none';
        resultsTitle.textContent = 'Kết quả tìm kiếm';

        // Clear previous results
        resultsContainer.innerHTML = '';

        // Render movie cards
        this.filteredMovies.forEach(movie => {
            const movieCard = this.createMovieCard(movie);
            resultsContainer.appendChild(movieCard);
        });
    }

    createMovieCard(movie) {
        const article = document.createElement('article');
        article.className = 'movie-card';
        article.dataset.movieId = movie.id;

        // Check if movie is watched
        const watchHistory = Utils.getFromStorage('watchHistory', []);
        const isWatched = watchHistory.includes(movie.id);
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

        // Add click event to watch button
        const watchBtn = article.querySelector('.watch-btn');
        watchBtn.addEventListener('click', () => {
            this.watchMovie(movie.id);
        });

        return article;
    }

    /**
     * Xác định kích thước hình ảnh tối ưu dựa trên viewport
     * @returns {string} - Kích thước hình ảnh
     */
    getOptimalImageSize() {
        const width = window.innerWidth;
        if (width <= 480) {
            return 'small';
        } else if (width <= 768) {
            return 'medium';
        } else {
            return 'large';
        }
    }

    watchMovie(movieId) {
        const movie = this.movies.find(m => m.id === movieId);
        if (movie) {
            // Save to watch history
            this.addToWatchHistory(movieId);
            
            // Navigate to movie page
            window.location.href = `movie.html?id=${movieId}`;
        }
    }

    addToWatchHistory(movieId) {
        const watchHistory = Utils.getFromStorage('watchHistory', []);
        if (!watchHistory.includes(movieId)) {
            watchHistory.unshift(movieId);
            watchHistory.splice(50); // Limit to 50 movies
            Utils.saveToStorage('watchHistory', watchHistory);
        }
    }

    loadSearchHistory() {
        return Utils.getFromStorage('searchHistory', []);
    }

    addToSearchHistory(query) {
        if (!this.searchHistory.includes(query)) {
            this.searchHistory.unshift(query);
            this.searchHistory.splice(10); // Limit to 10 searches
            Utils.saveToStorage('searchHistory', this.searchHistory);
        }
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
                        <button onclick="location.reload()" class="retry-btn">Thử lại</button>
                    </div>
                </div>
            `;
        }
    }
}

// Initialize search page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SearchPage();
});
