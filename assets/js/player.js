// Netflix-style Video Player
class NetflixVideoPlayer {
    constructor() {
        this.currentMovie = null;
        this.movies = [];
        this.isFullscreen = false;
        this.controlsVisible = false;
        this.hideControlsTimeout = null;
        this.iframe = null;
        this.isPlaying = true;
        this.currentTime = 0;
        this.duration = 0;
        this.volume = 100;
        this.isMuted = false;
        this.playbackRate = 1;
        this.quality = 'HD';
        this.subtitles = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.isLandscape = false;
        this.showHintTimeout = null;
        
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
            const response = await fetch('data/movies.json');
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
        const videoContainer = document.getElementById('video-container');
        this.iframe = document.createElement('iframe');
        this.iframe.setAttribute('allow', 'autoplay; fullscreen');
        this.iframe.setAttribute('allowfullscreen', 'true');
        this.iframe.style.width = '100%';
        this.iframe.style.height = '100%';
        this.iframe.style.border = 'none';
        this.iframe.style.borderRadius = '0';
        
        // Thêm loading state
        this.iframe.addEventListener('load', () => {
            this.hideLoading();
            this.showToast('Video đã sẵn sàng', 'success', 2000);
        });

        this.iframe.addEventListener('error', () => {
            this.showError('Không thể tải video từ Google Drive');
        });

        // No simulated progress; iframe playback managed by provider
    }

    bindEvents() {
        // Control buttons
        this.bindControlButtons();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });

        // Mouse events để hiện/ẩn controls
        const videoWrapper = document.getElementById('video-container');
        if (videoWrapper) {
            videoWrapper.addEventListener('mousemove', () => {
                this.showControls();
            });

            videoWrapper.addEventListener('mouseleave', () => {
                this.hideControlsAfterDelay();
            });

            videoWrapper.addEventListener('click', (e) => {
                if (e.target === videoWrapper || e.target === this.iframe) {
                    this.togglePlayPause();
                }
            });
        }

        // Fullscreen change events
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
            this.updateFullscreenButton();
            this.updateUIForFullscreen();
        });

        // Visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.hideControls();
            }
        });
    }

    bindControlButtons() {
        // Play/Pause button
        const playPauseBtn = document.getElementById('play-pause-btn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        }

        // Fullscreen button
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        // Volume controls
        const volumeBtn = document.getElementById('volume-control-btn');
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeBtn) {
            volumeBtn.addEventListener('click', () => this.toggleMute());
        }
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        }

        // Ignore non-functional controls: progress/seek, rewind/forward, subtitle, quality

        // Action buttons
        const playBtn = document.getElementById('play-btn');
        const addToListBtn = document.getElementById('add-to-list-btn');
        const shareBtn = document.getElementById('share-btn');
        
        if (playBtn) {
            playBtn.addEventListener('click', () => this.togglePlayPause());
        }
        if (addToListBtn) {
            addToListBtn.addEventListener('click', () => this.addToList());
        }
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareMovie());
        }
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
    }

    displayMovieInfo() {
        // Cập nhật title trang
        document.title = `${this.currentMovie.title} - Xem Phim Online`;
        
        // Cập nhật navigation title
        const navTitleElement = document.getElementById('movie-title');
        if (navTitleElement) {
            navTitleElement.textContent = this.currentMovie.title;
        }

        // Cập nhật video title
        const videoTitleElement = document.getElementById('video-title');
        if (videoTitleElement) {
            videoTitleElement.textContent = this.currentMovie.title;
        }

        // Cập nhật movie detail title
        const movieTitleDetail = document.getElementById('movie-title-detail');
        if (movieTitleDetail) {
            movieTitleDetail.textContent = this.currentMovie.title;
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
        const ratingElement = document.getElementById('movie-rating');
        if (ratingElement) {
            ratingElement.textContent = `⭐ ${this.currentMovie.rating}`;
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

        // Thêm iframe vào container (đúng selector theo HTML: id="video-container")
        const videoContainer = document.getElementById('video-container');
        if (videoContainer) {
            videoContainer.innerHTML = '';
            videoContainer.appendChild(this.iframe);
        }

        // Lưu vào lịch sử xem
        this.saveToWatchHistory();
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

    

    showLoading() {
        // Dùng overlay có sẵn trong HTML (#loading-overlay)
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    hideLoading() {
        // Ẩn overlay khi iframe đã load
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    showError(message) {
        const errorOverlay = document.getElementById('error-overlay');
        const errorMessage = document.getElementById('error-message');
        if (errorOverlay) {
            errorOverlay.style.display = 'flex';
            if (errorMessage) {
                errorMessage.textContent = message;
            }
        }
    }

    

    // Control Methods
    toggleControls() {
        if (this.controlsVisible) {
            this.hideControls();
        } else {
            this.showControls();
        }
    }

    showControls() {
        const videoControls = document.getElementById('video-controls');
        if (videoControls) {
            videoControls.classList.add('visible');
            this.controlsVisible = true;
            this.hideControlsAfterDelay();
        }
    }

    hideControls() {
        const videoControls = document.getElementById('video-controls');
        if (videoControls) {
            videoControls.classList.remove('visible');
            this.controlsVisible = false;
        }
    }

    hideControlsAfterDelay() {
        clearTimeout(this.hideControlsTimeout);
        this.hideControlsTimeout = setTimeout(() => {
            this.hideControls();
        }, 3000);
    }

    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        this.updatePlayPauseButton();
        this.showControls();
        
        if (this.isPlaying) {
            this.showToast('Đang phát', 'info', 1000);
        } else {
            this.showToast('Đã tạm dừng', 'info', 1000);
        }
    }

    updatePlayPauseButton() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        if (playPauseBtn) {
            const svg = playPauseBtn.querySelector('svg path');
            if (svg) {
                if (this.isPlaying) {
                    svg.setAttribute('d', 'M8 5V19L19 12L8 5Z');
                } else {
                    svg.setAttribute('d', 'M6 4H10V20H6V4ZM14 4H18V20H14V4Z');
                }
            }
        }
    }

    toggleFullscreen() {
        const videoContainer = document.getElementById('video-container');
        
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
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            const svg = fullscreenBtn.querySelector('svg path');
            if (svg) {
                if (this.isFullscreen) {
                    svg.setAttribute('d', 'M9 9V3H5C3.89543 3 3 3.89543 3 5V9M15 3V9H21V5C21 3.89543 20.1046 3 19 3H15ZM21 15V21C21 22.1046 20.1046 23 19 23H15V17H9V23H5C3.89543 23 3 22.1046 3 21V15H9V9H15V15H21Z');
                } else {
                    svg.setAttribute('d', 'M8 3H5C3.89543 3 3 3.89543 3 5V8M21 8V5C21 3.89543 20.1046 3 19 3H16M16 21H19C20.1046 21 21 20.1046 21 19V16M3 16V19C3 20.1046 3.89543 21 5 21H8');
                }
            }
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.updateVolumeButton();
        
        if (this.isMuted) {
            this.showToast('Đã tắt tiếng', 'info', 1000);
        } else {
            this.showToast(`Âm lượng: ${this.volume}%`, 'info', 1000);
        }
    }

    setVolume(value) {
        this.volume = parseInt(value);
        this.isMuted = this.volume === 0;
        this.updateVolumeButton();
    }

    adjustVolume(delta) {
        this.volume = Math.max(0, Math.min(100, this.volume + delta));
        this.isMuted = this.volume === 0;
        
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeSlider) {
            volumeSlider.value = this.volume;
        }
        
        this.updateVolumeButton();
        this.showToast(`Âm lượng: ${this.volume}%`, 'info', 1000);
    }

    updateVolumeButton() {
        const volumeBtn = document.getElementById('volume-control-btn');
        if (volumeBtn) {
            const svg = volumeBtn.querySelector('svg');
            if (svg) {
                if (this.isMuted || this.volume === 0) {
                    svg.innerHTML = `
                        <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M23 9L17 15M17 9L23 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    `;
                } else if (this.volume < 50) {
                    svg.innerHTML = `
                        <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15.54 8.46C16.477 9.4 17 10.66 17 12C17 13.34 16.477 14.6 15.54 15.54" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    `;
                } else {
                    svg.innerHTML = `
                        <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M19.07 4.93C20.944 6.8 22 9.27 22 12C22 14.73 20.944 17.2 19.07 19.07M15.54 8.46C16.477 9.4 17 10.66 17 12C17 13.34 16.477 14.6 15.54 15.54" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    `;
                }
            }
        }
    }

    

    

    addToList() {
        this.showToast('Đã thêm vào danh sách', 'success', 2000);
    }

    shareMovie() {
        if (navigator.share) {
            navigator.share({
                title: this.currentMovie.title,
                text: `Xem phim ${this.currentMovie.title}`,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showToast('Đã sao chép link', 'success', 2000);
            });
        }
    }

    

    updateUIForFullscreen() {
        const nav = document.querySelector('.netflix-nav');
        const detailsPanel = document.querySelector('.movie-details-panel');
        
        if (this.isFullscreen) {
            if (nav) nav.classList.add('hidden');
            if (detailsPanel) detailsPanel.style.display = 'none';
        } else {
            if (nav) nav.classList.remove('hidden');
            if (detailsPanel) detailsPanel.style.display = 'block';
        }
    }
    

    // Toast Notifications
    showToast(message, type = 'info', duration = 3000) {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    handleKeyboard(e) {
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                this.togglePlayPause();
                break;
            case 'KeyF':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'KeyM':
                e.preventDefault();
                this.toggleMute();
                break;
            case 'Escape':
                if (this.isFullscreen) {
                    this.toggleFullscreen();
                }
                break;
            case 'KeyB':
                window.location.href = 'index.html';
                break;
        }
    }
}

// Khởi tạo Netflix-style player khi DOM đã load
document.addEventListener('DOMContentLoaded', () => {
    new NetflixVideoPlayer();
});
