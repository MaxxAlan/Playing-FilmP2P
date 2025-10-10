(async function() {
  const { $, $$, fetchJSON, html, createElementFromHTML } = window.$u;
  const params = new URLSearchParams(location.search);
  const initialCategory = params.get('category') || '';

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

  function applyFilters(movies, category, genreTerm) {
    return movies.filter(m => {
      const okCategory =
  	!category ||
  	(Array.isArray(m.category) && m.category.includes(category));


      const okGenre = !genreTerm || (m.genre||[]).join(' ').toLowerCase().includes(genreTerm);
      return okCategory && okGenre;
    });
  }

  try {
    const data = await fetchJSON('https://raw.githubusercontent.com/crytals-sc/json-link/refs/heads/main/movies.json');
    $('#categorySelect').value = initialCategory;
    let current = applyFilters(data, initialCategory, '');
    render(current);

    $('#categorySelect').addEventListener('change', (e) => {
      const g = $('#genreInput').value.trim().toLowerCase();
      current = applyFilters(data, e.target.value, g);
      render(current);
    });
    $('#genreInput').addEventListener('input', (e) => {
      const c = $('#categorySelect').value;
      current = applyFilters(data, c, e.target.value.trim().toLowerCase());
      render(current);
    });
  } catch (e) {
    console.error(e);
  }
})();


