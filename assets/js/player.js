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
            this.setupTouchGestures();
            this.detectOrientation();
            this.loadMovie();
            this.showTouchHint();
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
            this.startProgressTracking();
        });

        this.iframe.addEventListener('error', () => {
            this.showError('Không thể tải video từ Google Drive');
        });

        // Setup progress tracking simulation
        this.setupProgressSimulation();
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

        // Orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.detectOrientation();
                this.updateUIForOrientation();
            }, 100);
        });

        // Resize events
        window.addEventListener('resize', () => {
            this.detectOrientation();
            this.updateUIForOrientation();
        });

        // Lưu tiến độ xem khi rời khỏi trang
        window.addEventListener('beforeunload', () => {
            this.saveWatchProgress();
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

        // Progress bar
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.addEventListener('click', (e) => this.seekTo(e));
            progressBar.addEventListener('mousedown', () => this.isDragging = true);
            progressBar.addEventListener('mouseup', () => this.isDragging = false);
        }

        // Rewind/Forward buttons
        const rewindBtn = document.getElementById('rewind-btn');
        const forwardBtn = document.getElementById('forward-btn');
        if (rewindBtn) {
            rewindBtn.addEventListener('click', () => this.rewind(10));
        }
        if (forwardBtn) {
            forwardBtn.addEventListener('click', () => this.forward(10));
        }

        // Subtitle button
        const subtitleBtn = document.getElementById('subtitle-btn');
        if (subtitleBtn) {
            subtitleBtn.addEventListener('click', () => this.toggleSubtitles());
        }

        // Quality button
        const qualityBtn = document.getElementById('quality-btn');
        if (qualityBtn) {
            qualityBtn.addEventListener('click', () => this.toggleQuality());
        }

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
        this.loadWatchProgress();
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
        const errorOverlay = document.getElementById('error-overlay');
        const errorMessage = document.getElementById('error-message');
        if (errorOverlay) {
            errorOverlay.style.display = 'flex';
            if (errorMessage) {
                errorMessage.textContent = message;
            }
        }
    }

    // Touch Gestures
    setupTouchGestures() {
        const videoWrapper = document.getElementById('video-container');
        if (!videoWrapper) return;

        videoWrapper.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.touchStartTime = Date.now();
        }, { passive: true });

        videoWrapper.addEventListener('touchend', (e) => {
            if (Date.now() - this.touchStartTime < 300) {
                // Single tap - toggle controls
                this.toggleControls();
            }
        }, { passive: true });

        videoWrapper.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1) {
                const deltaX = e.touches[0].clientX - this.touchStartX;
                const deltaY = e.touches[0].clientY - this.touchStartY;
                
                // Horizontal swipe for seeking
                if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                    e.preventDefault();
                    if (deltaX > 0) {
                        this.forward(Math.abs(deltaX) / 10);
                    } else {
                        this.rewind(Math.abs(deltaX) / 10);
                    }
                }
                
                // Vertical swipe for volume
                if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
                    e.preventDefault();
                    const volumeChange = deltaY > 0 ? -5 : 5;
                    this.adjustVolume(volumeChange);
                }
            }
        }, { passive: false });
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

    seekTo(e) {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            this.currentTime = this.duration * percentage;
            this.updateProgress();
            this.showToast(`Chuyển đến ${this.formatTime(this.currentTime)}`, 'info', 1000);
        }
    }

    rewind(seconds) {
        this.currentTime = Math.max(0, this.currentTime - seconds);
        this.updateProgress();
        this.showToast(`Tua lại ${seconds}s`, 'info', 1000);
    }

    forward(seconds) {
        this.currentTime = Math.min(this.duration, this.currentTime + seconds);
        this.updateProgress();
        this.showToast(`Tua nhanh ${seconds}s`, 'info', 1000);
    }

    toggleSubtitles() {
        this.subtitles = !this.subtitles;
        const subtitleBtn = document.getElementById('subtitle-btn');
        if (subtitleBtn) {
            subtitleBtn.classList.toggle('active', this.subtitles);
        }
        
        if (this.subtitles) {
            this.showToast('Đã bật phụ đề', 'info', 1000);
        } else {
            this.showToast('Đã tắt phụ đề', 'info', 1000);
        }
    }

    toggleQuality() {
        const qualities = ['SD', 'HD', 'Full HD'];
        const currentIndex = qualities.indexOf(this.quality);
        const nextIndex = (currentIndex + 1) % qualities.length;
        this.quality = qualities[nextIndex];
        
        const qualityBtn = document.getElementById('quality-btn');
        if (qualityBtn) {
            qualityBtn.textContent = this.quality;
        }
        
        this.showToast(`Chất lượng: ${this.quality}`, 'info', 1000);
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

    // Progress and Time Management
    setupProgressSimulation() {
        this.duration = 7200; // 2 hours in seconds (simulated)
        this.currentTime = 0;
        
        setInterval(() => {
            if (this.isPlaying && !this.isDragging) {
                this.currentTime += 1;
                this.updateProgress();
            }
        }, 1000);
    }

    startProgressTracking() {
        this.currentTime = 0;
        this.updateProgress();
    }

    updateProgress() {
        const progressFilled = document.getElementById('progress-filled');
        const currentTimeEl = document.getElementById('current-time');
        const totalTimeEl = document.getElementById('total-time');
        
        if (progressFilled) {
            const percentage = (this.currentTime / this.duration) * 100;
            progressFilled.style.width = `${percentage}%`;
        }
        
        if (currentTimeEl) {
            currentTimeEl.textContent = this.formatTime(this.currentTime);
        }
        
        if (totalTimeEl) {
            totalTimeEl.textContent = this.formatTime(this.duration);
        }
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${secs.toString().padStart(2, '0')}`;
        }
    }

    // Orientation and UI Management
    detectOrientation() {
        this.isLandscape = window.innerWidth > window.innerHeight;
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

    updateUIForOrientation() {
        const detailsPanel = document.querySelector('.movie-details-panel');
        
        if (this.isLandscape && window.innerWidth <= 768) {
            if (detailsPanel) detailsPanel.style.display = 'none';
        } else {
            if (detailsPanel) detailsPanel.style.display = 'block';
        }
    }

    showTouchHint() {
        if (window.innerWidth <= 480) {
            const videoWrapper = document.getElementById('video-container');
            if (videoWrapper) {
                videoWrapper.classList.add('show-hint');
                this.showHintTimeout = setTimeout(() => {
                    videoWrapper.classList.remove('show-hint');
                }, 3000);
            }
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

    // Keyboard Controls
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
            case 'ArrowLeft':
                e.preventDefault();
                this.rewind(10);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.forward(10);
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.adjustVolume(5);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.adjustVolume(-5);
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
