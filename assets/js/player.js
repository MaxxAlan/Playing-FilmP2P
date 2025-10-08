// Google Drive Video Player
class VideoPlayer {
    constructor() {
        this.currentMovie = null;
        this.movies = [];
        this.isFullscreen = false;
        this.controlsVisible = true;
        this.hideControlsTimeout = null;
        this.iframe = null;
        
        this.init();
    }

    async init() {
        try {
            await this.loadMovies();
            this.setupPlayer();
            this.bindEvents();
            this.loadMovie();
        } catch (error) {
            console.error('Lỗi khi khởi tạo player:', error);
            this.showError('Không thể tải video player');
        }
    }

    async loadMovies() {
        try {
            const response = await fetch('./data/movies.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.movies = await response.json();
        } catch (error) {
            console.error('Lỗi khi tải danh sách phim:', error);
            throw error;
        }
    }

    setupPlayer() {
        // Tạo iframe container
        const videoContainer = document.querySelector('.video-container');
        this.iframe = document.createElement('iframe');
        this.iframe.setAttribute('allow', 'autoplay; fullscreen');
        this.iframe.setAttribute('allowfullscreen', 'true');
        this.iframe.style.width = '100%';
        this.iframe.style.height = '500px';
        this.iframe.style.border = 'none';
        this.iframe.style.borderRadius = '10px';
        
        // Thêm loading state
        this.iframe.addEventListener('load', () => {
            this.hideLoading();
            Utils.showToast('Video đã sẵn sàng', 'success', 2000);
        });

        this.iframe.addEventListener('error', () => {
            this.showError('Không thể tải video từ Google Drive');
        });
    }

    bindEvents() {
        // Fullscreen button
        const fullscreenBtn = document.getElementById('fullscreen');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // Mouse movement để hiện/ẩn controls
        const videoContainer = document.querySelector('.video-container');
        videoContainer.addEventListener('mousemove', () => {
            this.showControls();
        });

        videoContainer.addEventListener('mouseleave', () => {
            this.hideControlsAfterDelay();
        });

        // Fullscreen change events
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
            this.updateFullscreenButton();
        });

        // Lưu tiến độ xem khi rời khỏi trang
        window.addEventListener('beforeunload', () => {
            this.saveWatchProgress();
        });
    }

    loadMovie() {
        const movieId = Utils.getUrlParameter('id');
        if (!movieId) {
            this.showError('Không tìm thấy ID phim');
            return;
        }

        this.currentMovie = this.movies.find(movie => movie.id == movieId);
        if (!this.currentMovie) {
            this.showError('Không tìm thấy phim');
            return;
        }

        this.displayMovieInfo();
        this.loadVideo();
        this.loadWatchProgress();
    }

    displayMovieInfo() {
        // Cập nhật title trang
        document.title = `${this.currentMovie.title} - Xem Phim Online`;
        
        // Cập nhật header
        const titleElement = document.getElementById('movie-title');
        if (titleElement) {
            titleElement.textContent = this.currentMovie.title;
        }

        // Cập nhật thông tin phim
        const descElement = document.getElementById('movie-description');
        if (descElement) {
            descElement.textContent = this.currentMovie.desc;
        }

        const yearElement = document.getElementById('movie-year');
        if (yearElement) {
            yearElement.textContent = this.currentMovie.year;
        }

        const durationElement = document.getElementById('movie-duration');
        if (durationElement) {
            durationElement.textContent = this.currentMovie.duration;
        }
        
        // Rating
        const ratingStars = document.getElementById('movie-rating');
        if (ratingStars) {
            ratingStars.innerHTML = Utils.generateStars(this.currentMovie.rating);
        }
        
        // Genres
        const genresContainer = document.getElementById('movie-genres');
        if (genresContainer) {
            genresContainer.innerHTML = this.currentMovie.genre
                .map(g => `<span class="genre-tag">${g}</span>`)
                .join('');
        }

        // Cập nhật meta tags cho SEO
        this.updateMetaTags();
    }

    updateMetaTags() {
        // Cập nhật meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = this.currentMovie.desc;
            document.head.appendChild(meta);
        } else {
            metaDesc.content = this.currentMovie.desc;
        }

        // Cập nhật Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
            const meta = document.createElement('meta');
            meta.setAttribute('property', 'og:title');
            meta.content = this.currentMovie.title;
            document.head.appendChild(meta);
        } else {
            ogTitle.content = this.currentMovie.title;
        }
    }

    loadVideo() {
        if (!this.currentMovie || !this.currentMovie.driveId) {
            this.showError('Không có video để phát');
            return;
        }

        this.showLoading();

        // Tạo Google Drive iframe URL
        const driveUrl = `https://drive.google.com/file/d/${this.currentMovie.driveId}/preview`;
        this.iframe.src = driveUrl;

        // Thêm iframe vào container
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            videoContainer.innerHTML = '';
            videoContainer.appendChild(this.iframe);
        }

        // Lưu vào lịch sử xem
        this.saveToWatchHistory();
    }

    toggleFullscreen() {
        const videoContainer = document.querySelector('.video-container');
        
        if (!this.isFullscreen) {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.webkitRequestFullscreen) {
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    updateFullscreenButton() {
        const fullscreenBtn = document.getElementById('fullscreen');
        if (fullscreenBtn) {
            fullscreenBtn.textContent = this.isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình';
        }
    }

    handleKeyboard(e) {
        switch (e.code) {
            case 'KeyF':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'Escape':
                if (this.isFullscreen) {
                    this.toggleFullscreen();
                }
                break;
            case 'KeyB':
                // Quay lại trang chủ
                window.location.href = 'index.html';
                break;
        }
    }

    showControls() {
        const controlsPanel = document.querySelector('.player-controls');
        if (controlsPanel) {
            controlsPanel.style.opacity = '1';
            this.controlsVisible = true;
            this.hideControlsAfterDelay();
        }
    }

    hideControlsAfterDelay() {
        clearTimeout(this.hideControlsTimeout);
        this.hideControlsTimeout = setTimeout(() => {
            this.hideControls();
        }, 3000);
    }

    hideControls() {
        if (this.isPlaying && this.isFullscreen) {
            const controlsPanel = document.querySelector('.player-controls');
            if (controlsPanel) {
                controlsPanel.style.opacity = '0.7';
                this.controlsVisible = false;
            }
        }
    }

    saveToWatchHistory() {
        if (this.currentMovie) {
            const watchHistory = Utils.getFromStorage('watchHistory', []);
            const movieId = this.currentMovie.id;
            
            // Xóa movie khỏi lịch sử nếu đã có
            const index = watchHistory.indexOf(movieId);
            if (index > -1) {
                watchHistory.splice(index, 1);
            }
            
            // Thêm vào đầu danh sách
            watchHistory.unshift(movieId);
            
            // Giới hạn 50 phim gần nhất
            watchHistory.splice(50);
            
            Utils.saveToStorage('watchHistory', watchHistory);
        }
    }

    saveWatchProgress() {
        // Lưu thời gian xem hiện tại (nếu có thể)
        if (this.currentMovie) {
            const progress = {
                movieId: this.currentMovie.id,
                timestamp: Date.now()
            };
            Utils.saveToStorage(`progress_${this.currentMovie.id}`, progress);
        }
    }

    loadWatchProgress() {
        if (this.currentMovie) {
            const progress = Utils.getFromStorage(`progress_${this.currentMovie.id}`);
            if (progress) {
                const timeAgo = Date.now() - progress.timestamp;
                const hoursAgo = timeAgo / (1000 * 60 * 60);
                
                if (hoursAgo < 24) {
                    Utils.showToast('Có tiến độ xem trước đó', 'info', 3000);
                }
            }
        }
    }

    showLoading() {
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading-container';
            loadingDiv.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Đang tải video...</p>
            `;
            videoContainer.appendChild(loadingDiv);
        }
    }

    hideLoading() {
        const loadingDiv = document.querySelector('.loading-container');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    showError(message) {
        const playerMain = document.querySelector('.player-main');
        if (playerMain) {
            playerMain.innerHTML = `
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

// Khởi tạo player khi DOM đã load
document.addEventListener('DOMContentLoaded', () => {
    new VideoPlayer();
});
