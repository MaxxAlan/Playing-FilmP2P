(async function() {
  const { $, fetchJSON, html, createElementFromHTML } = window.$u;

  function score(item, q) {
    if (!q) return 0;
    const hay = `${item.title} ${item.desc}`.toLowerCase();
    if (hay.startsWith(q)) return 3;
    if (hay.includes(q)) return 1;
    return 0;
  }

// Chuyển đổi hàm renderMovies từ file categories.js sang đây
function card(m) {
    const genres = (m.genre || []).map(g => `<span class="tag">${g}</span>`).join('');
    const movieLink = `movie.html?id=${encodeURIComponent(m.id)}`;

    return html`
      <article class="movie-card">
        <div class="card-image">
          <img class="poster" src="${m.poster}" alt="Poster ${m.title}" loading="lazy" />
          <div class="card-overlay">
            <div class="overlay-content">
              <div class="overlay-meta">
                <span>${m.year || ''}</span> •
                <span>${m.duration || ''}</span> •
                <span class="rating">⭐ ${m.rating || ''}</span>
              </div>
              <div class="overlay-tags">${genres}</div>
              <div class="overlay-actions">
                <a class="btn primary" href="${movieLink}">Xem ngay</a>
              </div>
            </div>
          </div>
        </div>
        <div class="card-base-info">
          <h3 class="movie-title"><a href="${movieLink}">${m.title}</a></h3>
          <p class="movie-year">${m.year || ''}</p>
        </div>
      </article>
    `;
}

  function render(list) {
    const host = $('#results');
    host.innerHTML = '';
    const frag = document.createDocumentFragment();
    list.forEach(m => frag.appendChild(createElementFromHTML(card(m))));
    host.appendChild(frag);
  }

function applyFilters(data) {
  //  Phần lọc cơ bản 
  const q = $('#q').value.trim().toLowerCase();
  const year = Number($('#year').value || 0);
  const genre = $('#genre').value.trim().toLowerCase();
  const sort = $('#sort').value;

  let list = data.filter(m => {
    const okQ = !q || `${m.title} ${m.desc}`.toLowerCase().includes(q);
    const okYear = !year || Number(m.year) === year;
    const okGenre = !genre || (m.genre || []).join(' ').toLowerCase().includes(genre);
    return okQ && okYear && okGenre;
  });

  // Phần sắp xếp được cập nhật để xử lý các giá trị khác nhau 
  switch (sort) {
    case 'title_asc':
      list.sort((a, b) => String(a.title).localeCompare(String(b.title)));
      break;
    case 'title_desc':
      list.sort((a, b) => String(b.title).localeCompare(String(a.title)));
      break;
    case 'year_desc':
      list.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
      break;
    case 'year_asc':
      list.sort((a, b) => Number(a.year || 0) - Number(b.year || 0));
      break;
    case 'rating_desc':
      list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
      break;
    case 'rating_asc':
      list.sort((a, b) => Number(a.rating || 0) - Number(b.rating || 0));
      break;
    case 'relevance':
      if (q) {
        list.sort((a, b) => score(b, q) - score(a, q));
      }
      break;
  }

  return list;
}

  try {
    const data = await fetchJSON('https://raw.githubusercontent.com/crytals-sc/json-link/refs/heads/main/movies.json');
    const update = () => render(applyFilters(data));
    ['q','year','genre','sort'].forEach(id => $('#'+id).addEventListener('input', update));
    update();
  } catch (e) {
    console.error(e);
  }
})();


