// Minimal player injector: injects native <video controls> when possible, falls back to Google Drive preview iframe
(async function(){
    // Utility: get URL param
    function getParam(name){
        const params = new URLSearchParams(window.location.search);
        return params.get(name);
    }

    function showError(msg){
        const err = document.getElementById('error-overlay');
        const errMsg = document.getElementById('error-message');
        if(err){ err.style.display = 'flex'; }
        if(errMsg){ errMsg.textContent = msg; }
        console.warn('Player fallback error:', msg);
    }

    const id = getParam('id');
    if(!id){ showError('Không có ID phim'); return; }

    try{
        const res = await fetch('data/movies.json');
        if(!res.ok) throw new Error('Không thể tải metadata');
        const movies = await res.json();
        const movie = movies.find(m => m.id == id);
        if(!movie){ showError('Phim không tồn tại'); return; }

        const container = document.getElementById('video-container');
        const loading = document.getElementById('loading-overlay');
        if(loading) loading.style.display = 'flex';

        // Prefer direct download URL pattern for Google Drive which sometimes streams better
        const driveId = movie.driveId;
        // Construct direct download URL (may be blocked by Drive for large files or require cookies)
        const directUrl = driveId ? `https://docs.google.com/uc?export=download&id=${driveId}` : null;

        // Create native video element
        if(directUrl){
            const video = document.createElement('video');
            video.setAttribute('controls', '');
            video.setAttribute('playsinline', '');
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            video.style.filter = 'contrast(1.05) saturate(1.02)';
            video.style.imageRendering = 'auto';

            const source = document.createElement('source');
            source.src = directUrl;
            // We don't know container format; leave type blank so browser probes it
            video.appendChild(source);

            // On error, fallback to Drive preview iframe
            video.addEventListener('error', () => {
                console.warn('Native video failed to load, falling back to iframe preview');
                injectIframe(container, driveId, loading);
            });

            // On loadedmetadata hide loading overlay
            video.addEventListener('loadedmetadata', () => {
                if(loading) loading.style.display = 'none';
            });

            // Insert video
            if(container){
                container.innerHTML = '';
                container.appendChild(video);
                // Try to autoplay muted to warm up playback
                video.muted = false;
                // Do not force autoplay; user will click play
            } else {
                showError('Không tìm thấy vùng chứa video');
            }
        } else {
            injectIframe(container, driveId, loading);
        }
    }catch(err){
        console.error('simple-player error', err);
        showError('Lỗi khi tải video');
    }

    function injectIframe(container, driveId, loading){
        if(loading) loading.style.display = 'none';
        if(!driveId){
            showError('Không có nguồn video');
            return;
        }
        const iframe = document.createElement('iframe');
        iframe.setAttribute('allow', 'autoplay; fullscreen');
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.src = `https://drive.google.com/file/d/${driveId}/preview`;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        if(container){ container.innerHTML = ''; container.appendChild(iframe); }
    }
})();
