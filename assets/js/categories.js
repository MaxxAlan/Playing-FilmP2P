(async function() {
  const { $, $$, fetchJSON, html, createElementFromHTML } = window.$u;

  // danh sách categories có sẵn, bạn có thể thêm/bớt
  const ALL_CATEGORIES = ['phim-le', 'phim-bo', 'hoat-hinh', 'tv-show', 'tai-lieu'];

  const params = new URLSearchParams(location.search);

  function item(movie) {
    return html`
      <article class="movie-card">
        <a href="movie.html?id=${encodeURIComponent(movie.id)}">
          <img class="poster" src="${movie.poster}" alt="Poster ${movie.title}" loading="lazy" />
        </a>
        <div class="movie-body">
          <h3 class="movie-title">${movie.title}</h3>
          <div class="movie-meta"><span>${movie.year||''}</span><span>• ${movie.duration||''}</span><span>• ⭐ ${movie.rating||''}</span></div>
        </div>
      </article>
    `;
  }

  function render(movies) {
    const host = $('#list');
    host.innerHTML = '';
    const frag = document.createDocumentFragment();
    movies.forEach(m => frag.appendChild(createElementFromHTML(item(m))));
    host.appendChild(frag);
  }

  // render checkbox categories
  function renderCategoryFilters() {
    const container = $('#categoryFilters');
    if (!container) return;
    container.innerHTML = '';
    ALL_CATEGORIES.forEach(cat => {
      const id = `cat-${cat}`;
      const div = document.createElement('div');
      div.innerHTML = `
        <label>
          <input type="checkbox" value="${cat}" id="${id}" />
          ${cat}
        </label>
      `;
      container.appendChild(div);
    });
  }

  function getSelectedCategories() {
    const checked = Array.from($('#categoryFilters input[type="checkbox"]:checked')).map(i => i.value);
    return checked;
  }

  function applyFilters(movies, selectedCategories, genreTerm) {
    return movies.filter(m => {
      const okCategory = !selectedCategories.length || 
        (Array.isArray(m.category) && selectedCategories.every(cat => m.category.includes(cat)));
      const okGenre = !genreTerm || (m.genre||[]).join(' ').toLowerCase().includes(genreTerm);
      return okCategory && okGenre;
    });
  }

  try {
    const data = await fetchJSON('https://raw.githubusercontent.com/crytals-sc/json-link/refs/heads/main/movies.json');
    renderCategoryFilters();
    let current = applyFilters(data, [], '');
    render(current);

    // lắng nghe thay đổi checkbox
    $('#categoryFilters').addEventListener('change', () => {
      const selected = getSelectedCategories();
      const g = $('#genreInput').value.trim().toLowerCase();
      current = applyFilters(data, selected, g);
      render(current);
    });

    // lắng nghe input genre
    $('#genreInput').addEventListener('input', (e) => {
      const selected = getSelectedCategories();
      current = applyFilters(data, selected, e.target.value.trim().toLowerCase());
      render(current);
    });

  } catch (e) {
    console.error(e);
  }
})();
