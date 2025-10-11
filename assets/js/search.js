(async function() {
  const { $, fetchJSON, html, createElementFromHTML } = window.$u;

  function score(item, q) {
    if (!q) return 0;
    const hay = `${item.title} ${item.desc}`.toLowerCase();
    if (hay.startsWith(q)) return 3;
    if (hay.includes(q)) return 1;
    return 0;
  }

  function card(m) {
    return html`
      <article class="movie-card">
        <a href="movie.html?id=${encodeURIComponent(m.id)}">
          <img class="poster" src="${m.poster}" alt="Poster ${m.title}" loading="lazy" />
        </a>
        <div class="movie-body">
          <h3 class="movie-title">${m.title}</h3>
          <div class="movie-meta"><span>${m.year||''}</span><span>• ${m.duration||''}</span><span>• ⭐ ${m.rating||''}</span></div>
          <div class="tags">${(m.genre||[]).slice(0,3).map(g=>`<span class="tag">${g}</span>`).join('')}</div>
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
    const q = $('#q').value.trim().toLowerCase();
    const year = Number($('#year').value || 0);
    const genre = $('#genre').value.trim().toLowerCase();
    const sort = $('#sort').value;

    let list = data.filter(m => {
      const okQ = !q || `${m.title} ${m.desc}`.toLowerCase().includes(q);
      const okYear = !year || Number(m.year) === year;
      const okGenre = !genre || (m.genre||[]).join(' ').toLowerCase().includes(genre);
      return okQ && okYear && okGenre;
    });

    if (sort === 'title') list.sort((a,b) => String(a.title).localeCompare(String(b.title)));
    if (sort === 'year') list.sort((a,b) => Number(b.year||0) - Number(a.year||0));
    if (sort === 'rating') list.sort((a,b) => Number(b.rating||0) - Number(a.rating||0));
    if (sort === 'relevance' && q) list.sort((a,b) => score(b,q) - score(a,q));
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


