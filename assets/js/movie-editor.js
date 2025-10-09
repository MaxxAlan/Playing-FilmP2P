(function(){
  const { $, createElementFromHTML, html, toast, fetchJSON } = window.$u;
  const listEl = $('#list');
  const state = [];
  let maxId = 0;

  // GitHub API helper functions
  const GitHubAPI = {
    async getFileContent(token, repo, path, branch = 'main') {
      const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${branch}`, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch file content');
      return response.json();
    },

    async updateFile(token, repo, path, content, sha, branch = 'main') {
      const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update ${path} via Movie Editor`,
          content: btoa(unescape(encodeURIComponent(content))), // Handle UTF-8
          sha: sha,
          branch: branch
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update file');
      }
      return response.json();
    }
  };

  // Load existing movies to determine the next available ID
  async function loadExistingMovies() {
    try {
      // Try loading from GitHub first if config exists
      const token = $('#githubToken').value.trim();
      const repo = $('#githubRepo').value.trim();
      const branch = $('#githubBranch').value.trim() || 'main';
      
      if (token && repo) {
        try {
          const fileInfo = await GitHubAPI.getFileContent(token, repo, 'data/movies.json', branch);
          const content = JSON.parse(atob(fileInfo.content));
          maxId = content.reduce((max, movie) => {
            const id = parseInt(movie.id);
            return isNaN(id) ? max : Math.max(max, id);
          }, 0);
          state.push(...content);
          render();
          toast('Đã tải danh sách phim từ GitHub', 'success');
          return;
        } catch (e) {
          console.warn('Could not load from GitHub:', e);
        }
      }

      // Fallback to local file
      const movies = await fetchJSON('../../data/movies.json');
      maxId = movies.reduce((max, movie) => {
        const id = parseInt(movie.id);
        return isNaN(id) ? max : Math.max(max, id);
      }, 0);
      state.push(...movies);
      render();
      toast('Đã tải danh sách phim từ local', 'success');
    } catch (err) {
      console.error('Error loading movies:', err);
      maxId = 0; // Start from 1 if can't load existing movies
    }
  }

  function readForm() {
    const title = $('#title').value.trim();
    const year = Number($('#year').value || 0);
    const poster = $('#poster').value.trim();
    const driveId = $('#driveId').value.trim();
    const duration = $('#duration').value.trim();
    const rating = Number($('#rating').value || 0);
    const category = $('#category').value.trim();
    const desc = $('#desc').value.trim();
    const genre = $('#genre').value.split(',').map(s => s.trim()).filter(Boolean);
    
    // Auto-generate next ID
    const id = String(maxId + 1);
    maxId++; // Increment for next use
    
    return { id, title, year, poster, driveId, sub: "", duration, genre, rating, category, desc };
  }

  function render() {
    listEl.innerHTML = '';
    state.forEach((m, idx) => {
      const row = createElementFromHTML(html`
        <div class="row">
          <img class="poster-mini" src="${m.poster}" alt="${m.title}" />
          <div>
            <div><strong>#${m.id}</strong> - ${m.title}</div>
            <div style="color:#9aa0a6; font-size:12px;">${m.year} • ${m.duration || 'N/A'} • ${m.genre.join(', ')}</div>
          </div>
          <div style="text-align:right;">
            <button class="btn" data-action="up" data-idx="${idx}">▲</button>
            <button class="btn" data-action="down" data-idx="${idx}">▼</button>
            <button class="btn" data-action="remove" data-idx="${idx}">Xóa</button>
          </div>
        </div>
      `);
      listEl.appendChild(row);
    });
  }

  function download(filename, text) {
    const el = document.createElement('a');
    el.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
    el.setAttribute('download', filename);
    el.style.display = 'none';
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  }

  document.getElementById('add').addEventListener('click', () => {
    const m = readForm();
    if (!m.title || !m.driveId) { 
      toast('Cần title và driveId', 'error'); 
      return; 
    }
    state.push(m);
    render();
    // Clear form after adding
    ['title', 'year', 'poster', 'driveId', 'duration', 'rating', 'category', 'desc', 'genre'].forEach(id => {
      const el = $('#' + id);
      if (el) el.value = '';
    });
    toast('Đã thêm phim mới với ID: ' + m.id, 'success');
  });

  listEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const idx = Number(btn.dataset.idx);
    const action = btn.dataset.action;
    if (action === 'remove') { 
      state.splice(idx, 1); 
      render(); 
      return; 
    }
    if (action === 'up' && idx > 0) {
      [state[idx-1], state[idx]] = [state[idx], state[idx-1]]; 
      render(); 
      return;
    }
    if (action === 'down' && idx < state.length - 1) {
      [state[idx+1], state[idx]] = [state[idx], state[idx+1]]; 
      render(); 
      return;
    }
  });

  document.getElementById('download').addEventListener('click', () => {
    if (!state.length) { 
      toast('Danh sách trống', 'error'); 
      return; 
    }
    download('movies.json', JSON.stringify(state, null, 2));
    toast('Đã tải xuống file movies.json', 'success');
  });

  // GitHub commit functionality
  document.getElementById('commitToGithub').addEventListener('click', async () => {
    try {
      const token = $('#githubToken').value.trim();
      const repo = $('#githubRepo').value.trim();
      const branch = $('#githubBranch').value.trim() || 'main';
      const statusEl = $('#githubStatus');

      if (!token || !repo) {
        toast('Vui lòng nhập GitHub Token và Repository', 'error');
        return;
      }

      if (!state.length) {
        toast('Danh sách phim trống', 'error');
        return;
      }

      statusEl.textContent = 'Đang kiểm tra file...';
      
      // First get the current file to get its SHA
      const fileInfo = await GitHubAPI.getFileContent(token, repo, 'data/movies.json', branch);
      
      statusEl.textContent = 'Đang cập nhật file...';
      
      // Update the file with new content
      await GitHubAPI.updateFile(
        token,
        repo,
        'data/movies.json',
        JSON.stringify(state, null, 2),
        fileInfo.sha,
        branch
      );

      statusEl.textContent = 'Cập nhật thành công! ' + new Date().toLocaleString();
      toast('Đã cập nhật file trên GitHub', 'success');

      // Save GitHub config to localStorage (except token for security)
      localStorage.setItem('github_repo', repo);
      localStorage.setItem('github_branch', branch);

    } catch (error) {
      console.error('GitHub commit error:', error);
      toast('Lỗi khi cập nhật: ' + error.message, 'error');
      $('#githubStatus').textContent = 'Lỗi: ' + error.message;
    }
  });

  // Load saved GitHub config
  window.addEventListener('DOMContentLoaded', () => {
    const savedRepo = localStorage.getItem('github_repo');
    const savedBranch = localStorage.getItem('github_branch');
    if (savedRepo) $('#githubRepo').value = savedRepo;
    if (savedBranch) $('#githubBranch').value = savedBranch;
  });

  // Load existing movies when page loads
  loadExistingMovies();
})();