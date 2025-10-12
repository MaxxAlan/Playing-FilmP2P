// Minimal utilities for fetching, templating, storage and toasts
(function() {
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => Array.from(parent.querySelectorAll(selector));

  async function fetchJSON(path) {
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return await res.json();
  }

  function html(strings, ...values) {
    return strings.reduce((acc, s, i) => acc + s + (values[i] ?? ''), '');
  }

  function createElementFromHTML(markup) {
    const tpl = document.createElement('template');
    tpl.innerHTML = markup.trim();
    return tpl.content.firstElementChild;
  }

  function saveToStorage(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch(_) {}
  }
  function readFromStorage(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch(_) { return fallback; }
  }

  function toast(message, type = 'info', timeout = 2500) {
    let host = $('#toast-host');
    if (!host) {
      host = document.createElement('div');
      host.id = 'toast-host';
      host.style.position = 'fixed';
      host.style.bottom = '16px';
      host.style.right = '16px';
      host.style.display = 'grid';
      host.style.gap = '8px';
      host.style.zIndex = '9999';
      document.body.appendChild(host);
    }
    const el = document.createElement('div');
    el.textContent = message;
    el.style.padding = '10px 12px';
    el.style.borderRadius = '10px';
    el.style.border = '1px solid #1f2937';
    el.style.background = type === 'error' ? '#7f1d1d' : (type === 'success' ? '#052e2b' : '#111318');
    el.style.color = '#e5e7eb';
    host.appendChild(el);
    setTimeout(() => { el.remove(); }, timeout);
  }

  function formatDuration(raw) {
    return raw;
  }

  window.$u = { $, $$, fetchJSON, html, createElementFromHTML, saveToStorage, readFromStorage, toast, formatDuration };
})();


