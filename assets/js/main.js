(async function() {
  const { $, $$, fetchJSON, html, createElementFromHTML, saveToStorage, readFromStorage, toast } = window.$u;

  const MOVIES_PATH = 'https://raw.githubusercontent.com/crytals-sc/json-link/refs/heads/main/movies.json';
  const PAGE_SIZE = 12;
  let allMovies = [];
  let filtered = [];
  let page = 1;
  let isList = false;

  function movieCard(movie) {
    const genres = (movie.genre || []).slice(0, 3).map(g => `<span class="tag">${g}</span>`).join('');
    return html`
      <article class="movie-card">
        <a href="movie.html?id=${encodeURIComponent(movie.id)}" aria-label="${movie.title}">
          <img class="poster" src="${movie.poster}" alt="Poster ${movie.title}" loading="lazy" />
        </a>
        <div class="movie-body">
          <h3 class="movie-title">${movie.title}</h3>
          <div class="movie-meta">
            <span>${movie.year ?? ''}</span>
            <span>• ${movie.duration ?? ''}</span>
            <span>• ⭐ ${movie.rating ?? ''}</span>
          </div>
          <div class="tags">${genres}</div>
          <div class="actions">
            <a class="btn primary" href="movie.html?id=${encodeURIComponent(movie.id)}">Xem ngay</a>
            <a class="btn secondary" href="categories.html?category=${encodeURIComponent(movie.category || '')}">Thể loại</a>
          </div>
        </div>
      </article>
    `;
  }

  function render(reset = false) {
    const host = $('#movies');
    host.className = isList ? 'movie-list' : 'movie-grid';
    if (reset) host.innerHTML = '';
    const start = 0;
    const end = page * PAGE_SIZE;
    const slice = filtered.slice(start, end);
    const frag = document.createDocumentFragment();
    slice.forEach(m => {
      const el = createElementFromHTML(movieCard(m));
      frag.appendChild(el);
    });
    host.innerHTML = '';
    host.appendChild(frag);
    $('#loadMoreBtn').style.display = filtered.length > end ? 'inline-flex' : 'none';
  }

  function applySearch(term) {
    const q = (term || '').toLowerCase().trim();
    if (!q) { filtered = [...allMovies]; return; }
    filtered = allMovies.filter(m => {
      const hay = `${m.title} ${m.desc} ${(m.genre||[]).join(' ')}`.toLowerCase();
      return hay.includes(q);
    });
  }

  function bindUI() {
    $('#gridBtn').addEventListener('click', () => {
      isList = false; $('#gridBtn').classList.add('active'); $('#listBtn').classList.remove('active'); render(true);
    });
    $('#listBtn').addEventListener('click', () => {
      isList = true; $('#listBtn').classList.add('active'); $('#gridBtn').classList.remove('active'); render(true);
    });
    $('#searchInput').addEventListener('input', (e) => {
      page = 1; applySearch(e.target.value); render(true);
    });
    $('#loadMoreBtn').addEventListener('click', () => {
      page += 1; render();
    });
  }

  try {
    bindUI();
    allMovies = await fetchJSON(MOVIES_PATH);
    filtered = [...allMovies];
    render(true);
  } catch (err) {
    console.error(err);
    toast('Không thể tải danh sách phim. Kiểm tra data-movies', 'error');
  }
})();


