// Image Manager - Quản lý hình ảnh cho website xem phim
class ImageManager {
    constructor() {
        this.imageCache = new Map();
        this.loadingImages = new Set();
        this.failedImages = new Set();
        this.defaultFallbacks = {
            poster: 'https://raw.githubusercontent.com/crytals-sc/json-link/refs/heads/img/lib/imgFallback.jpg?text=No+Poster',
            thumbnail: 'https://raw.githubusercontent.com/crytals-sc/json-link/refs/heads/img/lib/imgFallback.jpg?text=No+Thumb',
            backdrop: 'https://raw.githubusercontent.com/crytals-sc/json-link/refs/heads/img/lib/imgFallback.jpg?text=No+Backdrop'
        };
        this.screenSizes = {
            mobile: 'small',
            tablet: 'medium',
            desktop: 'large'
        };
        
        this.init();
    }

    init() {
        // Setup intersection observer for lazy loading
        this.setupIntersectionObserver();
        
        // Preload critical images
        this.preloadCriticalImages();
        
        // Setup error handlers
        this.setupErrorHandlers();
    }

    /**
     * Lấy URL hình ảnh phù hợp với kích thước màn hình
     * @param {Object} imageObj - Object chứa các kích thước hình ảnh
     * @param {string} type - Loại hình ảnh (poster, thumbnail, backdrop)
     * @param {string} size - Kích thước mong muốn (small, medium, large, original)
     * @returns {string} - URL hình ảnh
     */
    getImageUrl(imageObj, type = 'poster', size = null) {
        if (!imageObj) {
            return this.getFallbackUrl(type);
        }

        // Nếu imageObj là string (backward compatibility)
        if (typeof imageObj === 'string') {
            return imageObj;
        }

        // Xác định kích thước phù hợp
        const targetSize = size || this.getOptimalSize();
        
        // Lấy URL theo thứ tự ưu tiên
        const sizeOrder = ['original', 'large', 'medium', 'small'];
        let imageUrl = null;

        if (sizeOrder.includes(targetSize) && imageObj[targetSize]) {
            imageUrl = imageObj[targetSize];
        } else {
            // Fallback theo thứ tự ưu tiên
            for (const fallbackSize of sizeOrder) {
                if (imageObj[fallbackSize]) {
                    imageUrl = imageObj[fallbackSize];
                    break;
                }
            }
        }

        return imageUrl || this.getFallbackUrl(type);
    }

    /**
     * Xác định kích thước tối ưu dựa trên viewport
     * @returns {string} - Kích thước phù hợp
     */
    getOptimalSize() {
        const width = window.innerWidth;
        
        if (width <= 480) {
            return 'small';
        } else if (width <= 768) {
            return 'medium';
        } else {
            return 'large';
        }
    }

    /**
     * Lấy URL fallback cho loại hình ảnh
     * @param {string} type - Loại hình ảnh
     * @returns {string} - URL fallback
     */
    getFallbackUrl(type) {
        return this.defaultFallbacks[type] || this.defaultFallbacks.poster;
    }

    /**
     * Tạo thẻ img với lazy loading và fallback
     * @param {string} src - URL hình ảnh
     * @param {string} alt - Alt text
     * @param {Object} options - Tùy chọn
     * @returns {HTMLImageElement} - Thẻ img
     */
    createImageElement(src, alt, options = {}) {
        const img = document.createElement('img');
        
        // Set attributes
        img.alt = alt || 'Movie image';
        img.loading = options.lazy !== false ? 'lazy' : 'eager';
        img.className = options.className || '';
        
        // Set dimensions if provided
        if (options.width) img.width = options.width;
        if (options.height) img.height = options.height;

        // Set src or data-src for lazy loading
        if (img.loading === 'lazy' && options.lazy !== false) {
            img.dataset.src = src;
            img.src = this.getPlaceholderUrl(options.width, options.height);
            img.classList.add('lazy-image');
        } else {
            img.src = src;
        }

        // Error handling
        img.addEventListener('error', (e) => {
            this.handleImageError(e.target, src);
        });

        // Success handling
        img.addEventListener('load', (e) => {
            this.handleImageLoad(e.target);
        });

        return img;
    }

    /**
     * Tạo placeholder URL
     * @param {number} width - Chiều rộng
     * @param {number} height - Chiều cao
     * @returns {string} - URL placeholder
     */
    getPlaceholderUrl(width = 300, height = 450) {
        return `data:image/svg+xml;base64,${btoa(`
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f0f0f0"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-family="Arial, sans-serif" font-size="14">
                    Loading...
                </text>
            </svg>
        `)}`;
    }

    /**
     * Xử lý lỗi tải hình ảnh
     * @param {HTMLImageElement} img - Thẻ img
     * @param {string} originalSrc - URL gốc
     */
    handleImageError(img, originalSrc) {
        if (this.failedImages.has(originalSrc)) {
            return; // Đã xử lý lỗi này rồi
        }

        this.failedImages.add(originalSrc);
        
        // Thử fallback URL
        const fallbackUrl = this.getFallbackUrl('poster');
        
        if (img.src !== fallbackUrl) {
            img.src = fallbackUrl;
            img.classList.add('fallback-image');
        } else {
            // Nếu fallback cũng lỗi, hiển thị placeholder
            img.src = this.getPlaceholderUrl();
            img.classList.add('error-image');
        }

        console.warn(`Failed to load image: ${originalSrc}`);
    }

    /**
     * Xử lý thành công tải hình ảnh
     * @param {HTMLImageElement} img - Thẻ img
     */
    handleImageLoad(img) {
        img.classList.remove('lazy-image', 'loading');
        img.classList.add('loaded');
        
        // Fade in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in-out';
        requestAnimationFrame(() => {
            img.style.opacity = '1';
        });
    }

    /**
     * Setup Intersection Observer cho lazy loading
     */
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) {
            // Fallback for browsers without IntersectionObserver
            this.loadAllImages();
            return;
        }

        this.imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadLazyImage(img);
                    this.imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
    }

    /**
     * Load lazy image
     * @param {HTMLImageElement} img - Thẻ img
     */
    loadLazyImage(img) {
        if (!img.dataset.src) return;

        const src = img.dataset.src;
        
        // Check cache first
        if (this.imageCache.has(src)) {
            img.src = this.imageCache.get(src);
            return;
        }

        // Check if already loading
        if (this.loadingImages.has(src)) return;

        this.loadingImages.add(src);
        img.classList.add('loading');

        // Create new image to test loading
        const testImg = new Image();
        testImg.onload = () => {
            this.imageCache.set(src, src);
            img.src = src;
            this.loadingImages.delete(src);
            this.handleImageLoad(img);
        };
        testImg.onerror = () => {
            this.loadingImages.delete(src);
            this.handleImageError(img, src);
        };
        testImg.src = src;
    }

    /**
     * Observe image for lazy loading
     * @param {HTMLImageElement} img - Thẻ img
     */
    observeImage(img) {
        if (this.imageObserver && img.dataset.src) {
            this.imageObserver.observe(img);
        }
    }

    /**
     * Preload critical images
     */
    preloadCriticalImages() {
        // Preload first few movie posters
        const criticalImages = [];
        
        // Add to preload queue
        criticalImages.forEach(src => {
            this.preloadImage(src);
        });
    }

    /**
     * Preload single image
     * @param {string} src - URL hình ảnh
     */
    preloadImage(src) {
        if (this.imageCache.has(src)) return;

        const img = new Image();
        img.onload = () => {
            this.imageCache.set(src, src);
        };
        img.src = src;
    }

    /**
     * Load all images immediately (no lazy loading)
     */
    loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            this.loadLazyImage(img);
        });
    }

    /**
     * Setup global error handlers
     */
    setupErrorHandlers() {
        // Global error handler for unhandled image errors
        window.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target, e.target.src);
            }
        }, true);
    }

    /**
     * Get image dimensions from URL
     * @param {string} url - URL hình ảnh
     * @returns {Promise<Object>} - Dimensions {width, height}
     */
    async getImageDimensions(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                resolve({ width: img.naturalWidth, height: img.naturalHeight });
            };
            img.onerror = () => {
                resolve({ width: 0, height: 0 });
            };
            img.src = url;
        });
    }

    /**
     * Generate responsive image set
     * @param {string} baseUrl - Base URL
     * @param {Object} sizes - Sizes object
     * @returns {Object} - Responsive image set
     */
    generateResponsiveSet(baseUrl, sizes = {}) {
        const responsiveSet = {};
        
        Object.keys(sizes).forEach(size => {
            responsiveSet[size] = this.resizeImageUrl(baseUrl, sizes[size]);
        });

        return responsiveSet;
    }

    /**
     * Resize image URL (placeholder implementation)
     * @param {string} url - Original URL
     * @param {Object} dimensions - {width, height}
     * @returns {string} - Resized URL
     */
    resizeImageUrl(url, dimensions) {
        // This is a placeholder - in real implementation,
        // you might use an image service like Cloudinary, ImageKit, etc.
        if (url.includes('placeholder.com')) {
            return url.replace(/\d+x\d+/, `${dimensions.width}x${dimensions.height}`);
        }
        return url;
    }

    /**
     * Clear image cache
     */
    clearCache() {
        this.imageCache.clear();
        this.failedImages.clear();
        this.loadingImages.clear();
    }

    /**
     * Get cache statistics
     * @returns {Object} - Cache stats
     */
    getCacheStats() {
        return {
            cached: this.imageCache.size,
            failed: this.failedImages.size,
            loading: this.loadingImages.size
        };
    }
}

// Export for use in other modules
window.ImageManager = ImageManager;

// Initialize global image manager
if (!window.imageManager) {
    window.imageManager = new ImageManager();
}

// Utility functions for backward compatibility
window.ImageUtils = {
    /**
     * Get poster URL from movie object
     * @param {Object} movie - Movie object
     * @param {string} size - Size preference
     * @returns {string} - Poster URL
     */
    getPosterUrl(movie, size = null) {
        if (!movie || !movie.poster) {
            return window.imageManager.getFallbackUrl('poster');
        }
        return window.imageManager.getImageUrl(movie.poster, 'poster', size);
    },

    /**
     * Get thumbnail URL from movie object
     * @param {Object} movie - Movie object
     * @param {string} size - Size preference
     * @returns {string} - Thumbnail URL
     */
    getThumbnailUrl(movie, size = null) {
        if (!movie || !movie.thumbnail) {
            return window.imageManager.getFallbackUrl('thumbnail');
        }
        return window.imageManager.getImageUrl(movie.thumbnail, 'thumbnail', size);
    },

    /**
     * Get backdrop URL from movie object
     * @param {Object} movie - Movie object
     * @returns {string} - Backdrop URL
     */
    getBackdropUrl(movie) {
        if (!movie || !movie.images || !movie.images.backdrop) {
            return window.imageManager.getFallbackUrl('backdrop');
        }
        return movie.images.backdrop;
    },

    /**
     * Create responsive image element
     * @param {Object} movie - Movie object
     * @param {string} type - Image type (poster, thumbnail)
     * @param {Object} options - Options
     * @returns {HTMLImageElement} - Image element
     */
    createMovieImage(movie, type = 'poster', options = {}) {
        const url = type === 'poster' ? 
            ImageUtils.getPosterUrl(movie, options.size) : 
            ImageUtils.getThumbnailUrl(movie, options.size);
            
        return window.imageManager.createImageElement(url, movie.title, options);
    }
};
