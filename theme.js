/**
 * theme.js — Dark / Light mode toggle for calc-moyenne / GC
 * Drop this file into your GC repo root (same level as gc.css, dptgc.css).
 * Then add ONE line to every HTML file, just before </body>:
 *   <script src="theme.js"></script>
 *
 * For pages in the calc-moyenne repo (index.html there), use:
 *   <script src="https://skrull9557.github.io/GC/theme.js"></script>
 * OR copy theme.js into each repo root.
 *
 * The script:
 *  1. Injects the toggle button into the existing <header>.
 *  2. Injects all necessary CSS variables (dark + light) as a <style> tag.
 *  3. Reads / saves preference in localStorage so it persists across pages.
 */

(function () {
  /* ── 1. CSS INJECTION ─────────────────────────────────────────────── */
  const style = document.createElement("style");
  style.textContent = `
    /* ── Theme variables ──────────────────────────────── */
    :root {
      --bg:           #ffffff;
      --surface:      #f5f5f5;
      --surface2:     #ebebeb;
      --border:       #d4d4d4;
      --text:         #1a1a1a;
      --text-muted:   #555555;
      --accent:       #2563eb;
      --accent-hover: #1d4ed8;
      --btn-bg:       #1a1a1a;
      --btn-text:     #ffffff;
      --btn-hover:    #333333;
      --result-bg:    #f0fdf4;
      --result-border:#16a34a;
      --result-text:  #14532d;
      --shadow:       rgba(0,0,0,0.08);
      --input-bg:     #ffffff;
      --input-border: #d1d5db;
      --link-bg:      #1a1a1a;
      --link-text:    #ffffff;
      --link-hover:   #374151;
      --header-bg:    rgba(255,255,255,0.92);
    }

    [data-theme="dark"] {
      --bg:           #0f0f0f;
      --surface:      #1a1a1a;
      --surface2:     #242424;
      --border:       #2e2e2e;
      --text:         #f0f0f0;
      --text-muted:   #a0a0a0;
      --accent:       #60a5fa;
      --accent-hover: #93c5fd;
      --btn-bg:       #f0f0f0;
      --btn-text:     #0f0f0f;
      --btn-hover:    #d4d4d4;
      --result-bg:    #052e16;
      --result-border:#16a34a;
      --result-text:  #bbf7d0;
      --shadow:       rgba(0,0,0,0.4);
      --input-bg:     #1a1a1a;
      --input-border: #3f3f3f;
      --link-bg:      #f0f0f0;
      --link-text:    #0f0f0f;
      --link-hover:   #d4d4d4;
      --header-bg:    rgba(15,15,15,0.92);
    }

    /* ── Global resets to consume variables ──────────── */
    body {
      background-color: var(--bg) !important;
      color: var(--text) !important;
      transition: background-color 0.25s ease, color 0.25s ease;
    }

    header {
      background: var(--header-bg) !important;
      backdrop-filter: saturate(180%) blur(12px);
      -webkit-backdrop-filter: saturate(180%) blur(12px);
      border-bottom: 1px solid var(--border) !important;
      transition: background 0.25s ease, border-color 0.25s ease;
    }

    /* Index page: .container card */
    .container {
      background: var(--surface) !important;
      border: 1px solid var(--border) !important;
      box-shadow: 0 4px 24px var(--shadow) !important;
      transition: background 0.25s ease, border-color 0.25s ease;
    }

    /* Section headings on index */
    h1, h2, h3, h4, h5, h6 {
      color: var(--text) !important;
    }

    /* Department / semester link buttons */
    .calculator-link {
      background: var(--link-bg) !important;
      color: var(--link-text) !important;
      border: 1px solid var(--border) !important;
      transition: background 0.2s ease, color 0.2s ease !important;
    }
    .calculator-link:hover {
      background: var(--link-hover) !important;
    }

    /* Back / home button */
    #homeBtn, .home-button {
      color: var(--text) !important;
      border: 1px solid var(--border) !important;
      background: transparent !important;
      transition: background 0.2s ease, color 0.2s ease;
    }
    #homeBtn:hover, .home-button:hover {
      background: var(--surface2) !important;
    }

    /* Language selector dropdown */
    .dropdown-content {
      background: var(--surface) !important;
      border: 1px solid var(--border) !important;
      box-shadow: 0 4px 16px var(--shadow) !important;
    }
    .dropdown-content button {
      color: var(--text) !important;
      background: transparent !important;
    }
    .dropdown-content button:hover {
      background: var(--surface2) !important;
    }

    /* Globe button */
    .globe-button {
      background: transparent !important;
      color: var(--text) !important;
      border: 1px solid var(--border) !important;
    }

    /* Course input rows */
    .course-row, .module-row, .ue-row {
      background: var(--surface) !important;
      border: 1px solid var(--border) !important;
      transition: background 0.25s ease;
    }

    label, .course-label, .module-name, .ue-name {
      color: var(--text) !important;
    }

    input[type="number"], input[type="text"], select {
      background: var(--input-bg) !important;
      color: var(--text) !important;
      border: 1px solid var(--input-border) !important;
      transition: background 0.25s ease, border-color 0.25s ease;
    }

    /* Main calculate button */
    #calculateBtn {
      background: var(--btn-bg) !important;
      color: var(--btn-text) !important;
      border: none !important;
      transition: background 0.2s ease, color 0.2s ease;
    }
    #calculateBtn:hover {
      background: var(--btn-hover) !important;
    }

    /* Result box */
    .result {
      background: var(--result-bg) !important;
      border-left: 4px solid var(--result-border) !important;
      color: var(--result-text) !important;
    }

    /* Footer */
    footer, footer p {
      color: var(--text-muted) !important;
    }

    /* ── Theme toggle button ──────────────────────────── */
    #theme-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text);
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      line-height: 1;
      transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
      white-space: nowrap;
      flex-shrink: 0;
    }
    #theme-toggle:hover {
      background: var(--surface2);
    }
    #theme-toggle .tt-icon {
      font-size: 15px;
      line-height: 1;
    }
    #theme-toggle .tt-label {
      font-size: 12px;
      letter-spacing: 0.02em;
    }
  `;
  document.head.appendChild(style);

  /* ── 2. BUILD TOGGLE BUTTON ───────────────────────────────────────── */
  const btn = document.createElement("button");
  btn.id = "theme-toggle";
  btn.setAttribute("aria-label", "Basculer thème sombre/clair");
  btn.innerHTML = `<span class="tt-icon">☀️</span><span class="tt-label">Clair</span>`;

  /* ── 3. INJECT INTO HEADER ────────────────────────────────────────── */
  const header = document.querySelector("header");
  if (header) {
    /* Make header flex so the button sits at the right edge */
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.justifyContent = "space-between";
    header.style.flexWrap = "wrap";
    header.style.gap = "8px";

    /* Wrap existing header children so they stay together on the left */
    const existingChildren = Array.from(header.childNodes);
    if (existingChildren.length) {
      const leftWrap = document.createElement("div");
      leftWrap.style.cssText =
        "display:flex;align-items:center;gap:12px;flex-wrap:wrap;";
      existingChildren.forEach((n) => leftWrap.appendChild(n));
      header.appendChild(leftWrap);
    }

    header.appendChild(btn);
  } else {
    /* No header found: float button fixed in corner */
    btn.style.cssText =
      "position:fixed;top:14px;right:14px;z-index:9999;box-shadow:0 2px 8px rgba(0,0,0,.2);";
    document.body.appendChild(btn);
  }

  /* ── 4. APPLY + PERSIST THEME ────────────────────────────────────── */
  function applyTheme(dark) {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light"
    );
    btn.innerHTML = dark
      ? `<span class="tt-icon">🌙</span><span class="tt-label">Sombre</span>`
      : `<span class="tt-icon">☀️</span><span class="tt-label">Clair</span>`;
    try {
      localStorage.setItem("gc-theme", dark ? "dark" : "light");
    } catch (_) {}
  }

  /* Read saved preference, fall back to OS preference */
  let saved = null;
  try {
    saved = localStorage.getItem("gc-theme");
  } catch (_) {}

  const prefersDark =
    saved === "dark" ||
    (saved === null &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  applyTheme(prefersDark);

  btn.addEventListener("click", function () {
    applyTheme(
      document.documentElement.getAttribute("data-theme") !== "dark"
    );
  });
})();
