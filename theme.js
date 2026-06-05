/**
 * theme.js — GC Shared Theme Toggle
 * Drop <script src="theme.js"></script> anywhere in <body>.
 * Injects the toggle button into .header-right if present,
 * or falls back to appending it to <header>.
 */
(function () {
  const HTML   = document.documentElement;
  const STORE  = 'gc-theme';

  /* ── 1. Apply saved / system theme immediately ── */
  function getInitial() {
    return localStorage.getItem(STORE) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function applyTheme(t) {
    HTML.setAttribute('data-theme', t);
    localStorage.setItem(STORE, t);
    // update all toggle thumbs on the page (in case of multiple)
    document.querySelectorAll('.theme-toggle-thumb').forEach(el => {
      el.setAttribute('aria-label', t === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
    });
  }

  applyTheme(getInitial());

  /* ── 2. Build toggle button HTML ── */
  function createToggle() {
    const btn = document.createElement('button');
    btn.className   = 'theme-toggle';
    btn.type        = 'button';
    btn.setAttribute('aria-label', 'Basculer le thème');
    btn.title       = 'Clair / Sombre';
    btn.innerHTML   = '<div class="theme-toggle-thumb"></div>';
    btn.addEventListener('click', () => {
      applyTheme(HTML.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
    return btn;
  }

  /* ── 3. Inject once DOM is ready ── */
  function inject() {
    // Avoid double-injection
    if (document.querySelector('.theme-toggle')) return;

    const slot   = document.querySelector('.header-right');
    const header = document.querySelector('header');

    if (slot) {
      slot.appendChild(createToggle());
    } else if (header) {
      // Wrap existing last child or just append
      const wrap = document.createElement('div');
      wrap.className = 'header-right';
      wrap.style.cssText = 'display:flex;align-items:center;gap:8px;';
      // Move globe/lang selector into wrap if present
      const globe = header.querySelector('.language-selector, #globeBtn, .globe-button');
      if (globe) wrap.appendChild(globe);
      wrap.appendChild(createToggle());
      header.appendChild(wrap);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  /* ── 4. Sync with OS if user hasn't picked manually ── */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(STORE)) applyTheme(e.matches ? 'dark' : 'light');
  });
})();
