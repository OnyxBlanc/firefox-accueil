/* ═══════════════════════════════════════════════════════════════
   SEARCH.JS — Barre de recherche multi-moteurs + menu FMHY
═══════════════════════════════════════════════════════════════ */

const DDG_SVG = `<svg id="icon-ddg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="20" height="20">
  <circle cx="50" cy="50" r="50" fill="#de5833"/>
  <ellipse cx="50" cy="38" rx="18" ry="22" fill="#fff"/>
  <circle cx="43" cy="35" r="4" fill="#1a1a1a"/>
  <circle cx="57" cy="35" r="4" fill="#1a1a1a"/>
  <circle cx="44.5" cy="33.5" r="1.5" fill="#fff"/>
  <circle cx="58.5" cy="33.5" r="1.5" fill="#fff"/>
  <path d="M43 42 Q50 48 57 42" stroke="#1a1a1a" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="50" cy="72" rx="22" ry="16" fill="#f5c518"/>
  <path d="M35 68 Q50 80 65 68" fill="#de5833"/>
</svg>`;

// SVGs inline pour YouTube et GitHub (fiables, pas de dépendance Lucide)
const ENGINE_SVGS = {
  youtube: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="#ff0000">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8z"/>
    <path d="M9.6 15.6V8.4l6.3 3.6-6.3 3.6z" fill="#fff"/>
  </svg>`,
  github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" style="color:var(--c3)">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/>
  </svg>`
};

export function initSearch() {
  let currentUrl = 'https://duckduckgo.com/?q=';

  function setEngine(tab) {
    document.querySelectorAll('.engine-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentUrl = tab.dataset.url;
    document.getElementById('search-input').placeholder = tab.dataset.ph;

    const iconEl   = document.getElementById('engine-icon');
    const iconName = tab.dataset.icon;

    iconEl.classList.remove('spin');
    void iconEl.offsetWidth;

    if (iconName === 'ddg') {
      iconEl.innerHTML = DDG_SVG;
    } else if (ENGINE_SVGS[iconName]) {
      iconEl.innerHTML = ENGINE_SVGS[iconName];
    } else {
      iconEl.textContent = iconName;
    }

    iconEl.classList.add('spin');
  }

  document.querySelectorAll('.engine-tab').forEach(tab => {
    tab.addEventListener('click', () => setEngine(tab));
  });

  setEngine(document.querySelector('.engine-tab.active'));

  document.getElementById('search-form').addEventListener('submit', e => {
    e.preventDefault();
    const q = document.getElementById('search-input').value.trim();
    if (q) window.open(currentUrl + encodeURIComponent(q), '_blank');
  });

  /* ── Menu FMHY ── */
  const fmhyBtn     = document.getElementById('fmhy-btn');
  const fmhyOverlay = document.getElementById('fmhy-overlay');

  fmhyBtn.addEventListener('click', () => {
    fmhyOverlay.classList.add('open');
    fmhyBtn.classList.add('open');
  });

  document.getElementById('btn-fmhy-close').addEventListener('click', () => {
    fmhyOverlay.classList.remove('open');
    fmhyBtn.classList.remove('open');
  });
  fmhyOverlay.addEventListener('click', e => {
    if (e.target === fmhyOverlay) {
      fmhyOverlay.classList.remove('open');
      fmhyBtn.classList.remove('open');
    }
  });
}
