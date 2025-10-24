// gallery-loader.js
// Pequeño loader para cargar gallery.json por páginas y renderizar imágenes y videos.
// Fácil de usar: llamar galleryLoader.init({containerId, listUrl, pageSize, typeFilter});
window.galleryLoader = (function(){
  let cfg = {}, items = [], page = 0;
  function init(options){
    cfg = Object.assign({ containerId: 'galeria-js', listUrl: '/gallery.json', pageSize: 8, typeFilter: null }, options || {});
    fetchList();
    document.getElementById('cargar-mas')?.addEventListener('click', renderPage);
  }
  async function fetchList(){
    try {
      const res = await fetch(cfg.listUrl);
      if(!res.ok) throw new Error('No se pudo cargar ' + cfg.listUrl);
      items = await res.json();
      page = 0;
      document.getElementById(cfg.containerId).innerHTML = '';
      renderPage();
    } catch(e){
      console.error(e);
      const c = document.getElementById(cfg.containerId);
      if(c) c.innerHTML = '<p style="color:#f66">Error cargando la galería.</p>';
    }
  }
  function createImageCard(obj){
    const card = document.createElement('div'); card.className='item';
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = obj.thumb || obj.src;
    img.alt = obj.alt || '';
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', ()=> window.open(obj.src, '_blank'));
    card.appendChild(img);
    const p = document.createElement('p'); p.textContent = obj.alt || ''; card.appendChild(p);
    return card;
  }
  function createVideoCard(obj){
    const card = document.createElement('div'); card.className='item';
    if(obj.embed){ // iframe embed (YouTube/Vimeo)
      const iframe = document.createElement('iframe');
      iframe.src = obj.embed;
      iframe.setAttribute('loading','lazy');
      iframe.setAttribute('frameborder','0');
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.style.width = '100%';
      iframe.style.height = '200px';
      card.appendChild(iframe);
    } else {
      const video = document.createElement('video');
      video.controls = true; video.preload = 'none'; video.muted = true; video.playsInline = true;
      if(obj.poster) video.poster = obj.poster;
      const source = document.createElement('source'); source.src = obj.src; source.type = 'video/mp4';
      video.appendChild(source);
      video.style.width = '100%';
      video.style.height = '200px';
      card.appendChild(video);
    }
    const p = document.createElement('p'); p.textContent = obj.alt || ''; card.appendChild(p);
    return card;
  }
  function renderPage(){
    const c = document.getElementById(cfg.containerId);
    if(!c) return;
    const filtered = items.filter(i => !cfg.typeFilter || i.type === cfg.typeFilter);
    const start = page * cfg.pageSize;
    const slice = filtered.slice(start, start + cfg.pageSize);
    slice.forEach(i => {
      if(i.type === 'image') c.appendChild(createImageCard(i));
      else if(i.type === 'video' || i.type === 'embed') c.appendChild(createVideoCard(i));
    });
    page++;
    const moreBtn = document.getElementById('cargar-mas');
    if(moreBtn) moreBtn.style.display = (page * cfg.pageSize < filtered.length) ? 'inline-block' : 'none';
  }
  return { init };
})();
