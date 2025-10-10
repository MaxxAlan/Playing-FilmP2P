(async function() {
  const { $, $$, fetchJSON, html, createElementFromHTML } = window.$u;
  
  // Danh sách categories có sẵn
  const ALL_CATEGORIES = ['phim-le', 'phim-bo', 'hoat-hinh', 'tv-show', 'tai-lieu'];
  
  function item(movie) {
    // Hiển thị các tags của phim
    const tags = Array.isArray(movie.category) 
      ? movie.category.map(cat => `<span class="tag">${cat}</span>`).join('')
      : `<span class="tag">${movie.category || ''}</span>`;
    
    return html`
      <article class="movie-card">
        <a href="movie.html?id=${encodeURIComponent(movie.id)}">
          <img class="poster" src="${movie.poster}" alt="Poster ${movie.title}" loading="lazy" />
        </a>
        <div class="movie-body">
          <h3 class="movie-title">${movie.title}</h3>
          <div class="movie-tags">${tags}</div>
          <div class="movie-meta">
            <span>${movie.year||''}</span>
            <span>• ${movie.duration||''}</span>
            <span>• ⭐ ${movie.rating||''}</span>
          </div>
        </div>
      </article>
    `;
  }
  
  function render(movies) {
    const host = $('#list');
    host.innerHTML = '';
    
    if (movies.length === 0) {
      host.innerHTML = '<p class="no-results">Không tìm thấy phim nào phù hợp</p>';
      return;
    }
    
    const frag = document.createDocumentFragment();
    movies.forEach(m => frag.appendChild(createElementFromHTML(item(m))));
    host.appendChild(frag);
  }
  
  // Render checkbox categories
  function renderCategoryFilters() {
    const container = $('#categoryFilters');
    if (!container) return;
    
    container.innerHTML = '';
    ALL_CATEGORIES.forEach(cat => {
      const id = `cat-${cat}`;
      const div = document.createElement('div');
      div.classList.add('filter-item');
      div.innerHTML = `
        <label>
          <input type="checkbox" value="${cat}" id="${id}" />
          <span>${cat}</span>
        </label>
      `;
      container.appendChild(div);
    });
  }
  
  // Lấy danh sách categories đã chọn
  function getSelectedCategories() {
    const checked = Array.from($('#categoryFilters input[type="checkbox"]:checked'))
      .map(i => i.value);
    return checked;
  }
  
  // Chuẩn hóa category của movie thành mảng
  function normalizeCategories(movie) {
    if (!movie.category) return [];
    if (Array.isArray(movie.category)) return movie.category;
    return [movie.category];
  }
  
  // Logic lọc đã được cải tiến
  function applyFilters(movies, selectedCategories, genreTerm) {
    return movies.filter(m => {
      // Chuẩn hóa categories của phim thành mảng
      const movieCategories = normalizeCategories(m);
      
      // Nếu không chọn category nào → hiển thị tất cả
      // Nếu có chọn → phim phải có ít nhất 1 category trùng với filter
      const okCategory = selectedCategories.length === 0 || 
        selectedCategories.some(selectedCat => movieCategories.includes(selectedCat));
      
      // Lọc theo genre
      const okGenre = !genreTerm || 
        (Array.isArray(m.genre) && m.genre.join(' ').toLowerCase().includes(genreTerm));
      
      return okCategory && okGenre;
    });
  }
  
  try {
    const data = await fetchJSON('https://raw.githubusercontent.com/crytals-sc/json-link/refs/heads/main/movies.json');
    
    renderCategoryFilters();
    
    let current = applyFilters(data, [], '');
    render(current);
    
    // Thêm counter cho kết quả
    const updateResultCount = (count) => {
      const counter = $('#resultCount');
      if (counter) {
        counter.textContent = `Tìm thấy ${count} phim`;
      }
    };
    
    updateResultCount(current.length);
    
    // Lắng nghe thay đổi checkbox categories
    $('#categoryFilters').addEventListener('change', () => {
      const selected = getSelectedCategories();
      const g = $('#genreInput').value.trim().toLowerCase();
      current = applyFilters(data, selected, g);
      render(current);
      updateResultCount(current.length);
    });
    
    // Lắng nghe input genre
    $('#genreInput').addEventListener('input', (e) => {
      const selected = getSelectedCategories();
      current = applyFilters(data, selected, e.target.value.trim().toLowerCase());
      render(current);
      updateResultCount(current.length);
    });
    
    // Nút clear filters (optional)
    const clearBtn = $('#clearFilters');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        // Bỏ chọn tất cả checkboxes
        $$('#categoryFilters input[type="checkbox"]').forEach(cb => cb.checked = false);
        // Xóa genre input
        $('#genreInput').value = '';
        // Reset về danh sách đầy đủ
        current = data;
        render(current);
        updateResultCount(current.length);
      });
    }
    
  } catch (e) {
    console.error('Lỗi khi tải dữ liệu:', e);
    $('#list').innerHTML = '<p class="error">Không thể tải danh sách phim</p>';
  }
})();