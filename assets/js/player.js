// assets/js/player.js
// Video player with Google Drive integration for movie.html
// Handles embedding Google Drive video preview iframe
// Supports basic fullscreen (via iframe allowFullscreen)
// Auto-resume, keyboard shortcuts are planned but not implemented yet (as per README: null)

document.addEventListener('DOMContentLoaded', function() {
    // Get movie ID from URL query parameter (e.g., movie.html?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');

    if (!movieId) {
        console.error('No movie ID provided in URL');
        showError('Không tìm thấy ID phim. Vui lòng quay lại trang chủ.');
        return;
    }

    // Load movies.json to get movie details
    fetch('../data/movies.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load movies.json');
            }
            return response.json();
        })
        .then(movies => {
            const movie = movies.find(m => m.id === movieId);
            if (!movie) {
                console.error('Movie not found');
                showError('Không tìm thấy phim với ID này.');
                return;
            }

            // Embed Google Drive iframe
            const playerContainer = document.getElementById('player-container'); // Assume movie.html has <div id="player-container"></div>
            if (!playerContainer) {
                console.error('Player container not found in HTML');
                return;
            }

            const iframe = document.createElement('iframe');
            iframe.src = `https://drive.google.com/file/d/${movie.driveId}/preview`;
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.frameBorder = '0';
            iframe.allow = 'autoplay; fullscreen; encrypted-media; picture-in-picture';
            iframe.allowFullscreen = true;

            playerContainer.appendChild(iframe);

            // Display movie info (title, desc, etc.) if needed
            updateMovieInfo(movie);

            // Setup loading state
            showLoading(false);

            // Future: Auto-resume using localStorage (challenging with iframe)
            // const savedTime = localStorage.getItem(`movie-progress-${movieId}`);
            // if (savedTime) {
            //     // Not easily possible with Google Drive iframe without advanced integration
            // }

            // Future: Keyboard shortcuts
            // document.addEventListener('keydown', handleKeyboard);
        })
        .catch(error => {
            console.error('Error loading movie:', error);
            showError('Lỗi khi tải thông tin phim. Vui lòng thử lại sau.');
        });
});

// Function to update movie info on the page
function updateMovieInfo(movie) {
    const titleElement = document.querySelector('#movie-title');
    const descElement = document.querySelector('#movie-desc');
    const genreElement = document.querySelector('#movie-genre');
    const ratingElement = document.querySelector('#movie-rating');
    const durationElement = document.querySelector('#movie-duration');

    if (titleElement) titleElement.textContent = movie.title;
    if (descElement) descElement.textContent = movie.desc;
    if (genreElement) genreElement.textContent = movie.genre.join(', ');
    if (ratingElement) ratingElement.textContent = `${movie.rating}/5`;
    if (durationElement) durationElement.textContent = movie.duration;
}

// Function to show error message
function showError(message) {
    const playerContainer = document.getElementById('player-container');
    if (playerContainer) {
        playerContainer.innerHTML = `<div class="error-message">${message}</div>`;
    }
    showLoading(false);
}

// Function to toggle loading state
function showLoading(isLoading) {
    const loadingElement = document.querySelector('.loading-spinner'); // Assume HTML has loading spinner
    if (loadingElement) {
        loadingElement.style.display = isLoading ? 'block' : 'none';
    }
}

// Future keyboard handler
// function handleKeyboard(event) {
//     // Example: Space for play/pause, arrows for seek
//     // Would require communication with iframe content (postMessage if possible)
// }

// Additional utilities if needed (e.g., for fullscreen toggle)
function toggleFullscreen() {
    const player = document.querySelector('iframe');
    if (player) {
        if (!document.fullscreenElement) {
            player.requestFullscreen().catch(err => console.error('Fullscreen error:', err));
        } else {
            document.exitFullscreen();
        }
    }
}

// Export if using modules (but since static, likely concatenated or separate scripts)
// If using ES modules, add export default { init: () => {...} } but keeping simple for static site