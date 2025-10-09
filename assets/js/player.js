(async function() {
  const { $, fetchJSON, toast } = window.$u;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) { toast('Thiếu id phim', 'error'); location.href = 'index.html'; return; }

  try {
    const movies = await fetchJSON('https://raw.githubusercontent.com/crytals-sc/json-link/refs/heads/main/movies.json');
    const movie = movies.find(m => String(m.id) === String(id));
    if (!movie) { toast('Không tìm thấy phim', 'error'); location.href = 'index.html'; return; }

    document.title = `${movie.title} - Xem phim`;
    $('#title').textContent = movie.title;
    $('#meta').textContent = `${movie.year || ''} • ${movie.duration || ''} • ⭐ ${movie.rating || ''}`;
    $('#desc').textContent = movie.desc || '';

    const iframe = $('#gdPlayer');
    const setSrc = (driveId) => { iframe.src = `https://drive.google.com/file/d/${driveId}/preview`; };
    if (Array.isArray(movie.episodes) && movie.episodes.length > 0) {
      const epContainer = $('#episodes');
      movie.episodes.forEach((ep, i) => {
        const btn = document.createElement('button');
        btn.textContent = ep.name || ('Tập ' + (i + 1));
        btn.addEventListener('click', () => {
          Array.from(epContainer.querySelectorAll('button')).forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          setSrc(ep.driveId);
        });
        if (i === 0) btn.classList.add('active');
        epContainer.appendChild(btn);
      });
      setSrc(movie.episodes[0].driveId);
    } else if (movie.driveId) {
      setSrc(movie.driveId);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'f') {
        if (iframe.requestFullscreen) iframe.requestFullscreen();
      }
    });
  } catch (e) {
    console.error(e);
    toast('Không tải được thông tin phim', 'error');
  }
})();


