// Các hàm utility hỗ trợ cho ứng dụng xem phim

class Utils {
    /**
     * Chuyển đổi thời gian từ giây sang định dạng mm:ss hoặc hh:mm:ss
     * @param {number} seconds - Thời gian tính bằng giây
     * @returns {string} - Chuỗi thời gian đã định dạng
     */
    static formatTime(seconds) {
        if (isNaN(seconds) || seconds < 0) {
            return '00:00';
        }

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        } else {
            return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }

    /**
     * Lấy tham số từ URL
     * @param {string} paramName - Tên tham số cần lấy
     * @returns {string|null} - Giá trị tham số hoặc null nếu không tìm thấy
     */
    static getUrlParameter(paramName) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(paramName);
    }

    /**
     * Tạo HTML cho đánh giá sao
     * @param {number} rating - Điểm đánh giá (0-5)
     * @returns {string} - HTML của các sao
     */
    static generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<span class="star filled">★</span>';
        }

        if (hasHalfStar) {
            stars += '<span class="star half">★</span>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<span class="star">☆</span>';
        }

        return stars;
    }

    /**
     * Làm mờ/mờ dần phần tử
     * @param {HTMLElement} element - Phần tử cần làm mờ
     * @param {number} duration - Thời gian làm mờ (ms)
     * @param {boolean} fadeIn - true để làm mờ dần, false để làm mờ
     */
    static fadeElement(element, duration = 300, fadeIn = true) {
        if (!element) return;

        const startOpacity = fadeIn ? 0 : 1;
        const endOpacity = fadeIn ? 1 : 0;
        
        element.style.opacity = startOpacity;
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            element.style.opacity = endOpacity;
        }, 10);
    }

    /**
     * Hiển thị thông báo toast
     * @param {string} message - Nội dung thông báo
     * @param {string} type - Loại thông báo (success, error, info)
     * @param {number} duration - Thời gian hiển thị (ms)
     */
    static showToast(message, type = 'info', duration = 3000) {
        // Tạo toast container nếu chưa có
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        // Tạo toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        // Thêm vào container
        toastContainer.appendChild(toast);

        // Hiển thị với hiệu ứng
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Tự động ẩn sau thời gian quy định
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    /**
     * Kiểm tra xem phần tử có trong viewport không
     * @param {HTMLElement} element - Phần tử cần kiểm tra
     * @returns {boolean} - true nếu trong viewport
     */
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Debounce function - trì hoãn việc thực thi function
     * @param {Function} func - Function cần debounce
     * @param {number} wait - Thời gian chờ (ms)
     * @returns {Function} - Function đã được debounce
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function - giới hạn tần suất thực thi function
     * @param {Function} func - Function cần throttle
     * @param {number} limit - Thời gian giới hạn (ms)
     * @returns {Function} - Function đã được throttle
     */
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Lưu dữ liệu vào localStorage
     * @param {string} key - Khóa lưu trữ
     * @param {any} data - Dữ liệu cần lưu
     */
    static saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Lỗi khi lưu dữ liệu:', error);
        }
    }

    /**
     * Lấy dữ liệu từ localStorage
     * @param {string} key - Khóa cần lấy
     * @param {any} defaultValue - Giá trị mặc định nếu không tìm thấy
     * @returns {any} - Dữ liệu đã lưu hoặc giá trị mặc định
     */
    static getFromStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Lỗi khi đọc dữ liệu:', error);
            return defaultValue;
        }
    }

    /**
     * Kiểm tra xem có phải thiết bị di động không
     * @returns {boolean} - true nếu là thiết bị di động
     */
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Tạo ID ngẫu nhiên
     * @param {number} length - Độ dài ID
     * @returns {string} - ID ngẫu nhiên
     */
    static generateId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}

// Export cho sử dụng trong các module khác
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
