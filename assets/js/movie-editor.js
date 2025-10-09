// Movie editor script - parse form fields into movie JSON object and manage list
(function(){
  const form = document.getElementById('movieForm');
  const out = document.getElementById('output');
  const btnGenerate = document.getElementById('btnGenerate');
  const btnAdd = document.getElementById('btnAdd');
  const btnDownload = document.getElementById('btnDownload');
  const btnCopy = document.getElementById('btnCopy');
  const btnReset = document.getElementById('btnReset');
  const btnConvertDrive = document.getElementById('btnConvertDrive');
  const driveLinkInput = document.getElementById('driveLinkInput');
  const driveOutputs = document.getElementById('driveOutputs');
  const importFile = document.getElementById('importFile');
  const importMode = document.getElementById('importMode');
  const btnImport = document.getElementById('btnImport');
  const previewPosterOriginal = document.getElementById('preview_poster_original');
  const previewThumbOriginal = document.getElementById('preview_thumb_original');
  const previewBackdrop = document.getElementById('preview_backdrop');

  let movies = [];

  function text(id){ return document.getElementById(id).value.trim(); }

  function toNumberOrNull(v){ if(!v) return null; const n = Number(v); return Number.isNaN(n)? null : n; }

  function parseCommaList(v){ if(!v) return []; return v.split(',').map(s=>s.trim()).filter(Boolean); }

  // Extract file id from many possible Google Drive URL formats
  function extractDriveId(url){
    if(!url) return null;
    // patterns: /d/FILEID/, id=FILEID, open?id=FILEID, file/d/FILEID/view
    const patterns = [ /\/d\/([a-zA-Z0-9_-]{10,})/, /[?&]id=([a-zA-Z0-9_-]{10,})/, /open\?id=([a-zA-Z0-9_-]{10,})/ ];
    for(const p of patterns){ const m = url.match(p); if(m) return m[1]; }
    // fallback: if url is just an id
    if(/^[a-zA-Z0-9_-]{10,}$/.test(url)) return url;
    return null;
  }

  function buildDriveUrls(fileId){
    if(!fileId) return null;
    return {
      fileId,
      view: `https://drive.google.com/file/d/${fileId}/view`,
      directDownload: `https://drive.google.com/uc?export=download&id=${fileId}`,
      embed: `https://drive.google.com/file/d/${fileId}/preview`
    };
  }

  // helper: set preview element with an image URL or clear
  function setImagePreview(containerEl, url){
    if(!containerEl) return;
    containerEl.innerHTML = '';
    if(!url) return;
    // create image element and set src; handle error
    const img = document.createElement('img');
    img.src = url;
    img.onload = ()=>{};
    img.onerror = ()=>{ containerEl.textContent = 'Không thể load ảnh'; };
    containerEl.appendChild(img);
  }

  function buildMovieObject(){
    const id = text('id');
    const title = text('title');
    if(!id) throw new Error('Trường "id" là bắt buộc');
    if(!title) throw new Error('Trường "title" là bắt buộc');
    const yearText = text('year');
    const year = yearText? toNumberOrNull(yearText) : undefined;
    const category = text('category') || 'phim-le';
    const duration = text('duration');
    const ratingText = text('rating');
    const rating = ratingText? toNumberOrNull(ratingText) : undefined;
    const desc = text('desc');
    const driveId = text('driveId');
    const sub = text('sub');
    const genre = parseCommaList(text('genre'));

    const poster = {
      original: text('poster_original') || '',
      large: text('poster_large') || '',
      medium: text('poster_medium') || '',
      small: text('poster_small') || ''
    };

    const thumbnail = {
      original: text('thumb_original') || '',
      large: text('thumb_large') || '',
      medium: text('thumb_medium') || '',
      small: text('thumb_small') || ''
    };

    const images = {
      backdrop: text('backdrop') || '',
      gallery: parseCommaList(text('gallery'))
    };

    const obj = {
      id: String(id),
      title: String(title),
      year: year === null ? undefined : year,
      poster,
      thumbnail,
      desc,
      driveId: driveId || '',
      sub: sub || '',
      duration: duration || '',
      genre,
      rating: rating === null ? undefined : rating,
      category: category || '',
      images
    };

    // Remove undefined fields to keep output clean
    Object.keys(obj).forEach(k=>{ if(obj[k]===undefined) delete obj[k]; });
    // Basic type checks
    if(obj.year!==undefined && typeof obj.year !== 'number') throw new Error('Trường "year" phải là số');
    if(obj.rating!==undefined && typeof obj.rating !== 'number') throw new Error('Trường "rating" phải là số');
    return obj;
  }

  function render(){
    out.textContent = JSON.stringify(movies, null, 2);
  }

  btnGenerate.addEventListener('click', ()=>{
    try{
      const obj = buildMovieObject();
      // show single object in preview temporarily
      out.textContent = JSON.stringify(obj, null, 2);
    }catch(err){ alert(err.message); }
  });

  // Drive convert button
  if(btnConvertDrive){
    btnConvertDrive.addEventListener('click', ()=>{
      const url = driveLinkInput.value.trim();
      const id = extractDriveId(url);
      if(!id){ driveOutputs.textContent = 'Không tìm thấy Drive file id trong link.'; return; }
      // fill driveId field
      const driveField = document.getElementById('driveId');
      if(driveField) driveField.value = id;
      const urls = buildDriveUrls(id);
      driveOutputs.innerHTML = `ID: <strong>${urls.fileId}</strong><br>View: <a href="${urls.view}" target="_blank">${urls.view}</a><br>Embed (preview): <a href="${urls.embed}" target="_blank">${urls.embed}</a><br>Direct download: <a href="${urls.directDownload}" target="_blank">${urls.directDownload}</a>`;
    });
  }

  // Image preview bindings
  function bindPreview(inputId, previewEl){
    const input = document.getElementById(inputId);
    if(!input) return;
    const update = ()=> setImagePreview(previewEl, input.value.trim() || null);
    input.addEventListener('input', update);
    input.addEventListener('paste', ()=> setTimeout(update,50));
    // initial
    update();
  }

  bindPreview('poster_original', previewPosterOriginal);
  bindPreview('thumb_original', previewThumbOriginal);
  bindPreview('backdrop', previewBackdrop);

  // gallery preview: uses first URL
  const galleryInput = document.getElementById('gallery');
  if(galleryInput){
    const galleryPreview = previewPosterOriginal; // reuse a preview box (or we could create separate)
    const updateGallery = ()=>{
      const urls = parseCommaList(galleryInput.value);
      setImagePreview(galleryPreview, urls.length? urls[0]: null);
    };
    galleryInput.addEventListener('input', updateGallery);
    galleryInput.addEventListener('paste', ()=> setTimeout(updateGallery,50));
    updateGallery();
  }

  // Import handler
  if(btnImport && importFile){
    btnImport.addEventListener('click', ()=>{
      const file = importFile.files && importFile.files[0];
      if(!file){ alert('Chọn file JSON để import'); return; }
      const reader = new FileReader();
      reader.onload = (e)=>{
        try{
          const parsed = JSON.parse(e.target.result);
          if(!Array.isArray(parsed)){ alert('File import phải là mảng JSON'); return; }
          if(importMode.value === 'replace'){
            movies = parsed.map(x=>x);
          }else{
            // merge: add entries with unique id; overwrite if id same?
            parsed.forEach(item=>{
              if(!item.id) return;
              const idx = movies.findIndex(m=>m.id===item.id);
              if(idx>=0) movies[idx] = item; else movies.push(item);
            });
          }
          render();
          alert('Import thành công: ' + parsed.length + ' record(s)');
        }catch(err){ alert('Lỗi khi parse JSON: '+err.message); }
      };
      reader.readAsText(file);
    });
  }

  btnAdd.addEventListener('click', ()=>{
    try{
      const obj = buildMovieObject();
      // if id already exists, ask to overwrite
      const idx = movies.findIndex(m=>m.id===obj.id);
      if(idx>=0){ if(!confirm('id đã tồn tại. Ghi đè?')) return; movies[idx]=obj; }
      else movies.push(obj);
      render();
    }catch(err){ alert(err.message); }
  });

  btnDownload.addEventListener('click', ()=>{
    const blob = new Blob([JSON.stringify(movies, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'movies.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  btnCopy.addEventListener('click', async ()=>{
    try{
      await navigator.clipboard.writeText(JSON.stringify(movies, null, 2));
      alert('Copied to clipboard');
    }catch(e){ alert('Copy failed: '+e.message); }
  });

  btnReset.addEventListener('click', ()=>{ form.reset(); out.textContent = JSON.stringify(movies, null, 2); });

  // initial render
  render();
})();
