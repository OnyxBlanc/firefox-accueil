/* ═══════════════════════════════════════════════════════════════
   SEARCH.JS — Barre de recherche multi-moteurs + menu FMHY
   - Gère les onglets moteurs (.engine-tab) définis dans index.html
   - Chaque onglet porte : data-url, data-icon, data-ph (placeholder)
   - Soumet la recherche dans un nouvel onglet (_blank)
   - Gère l'ouverture/fermeture de la modale FMHY
═══════════════════════════════════════════════════════════════ */

// SVG inline DuckDuckGo (pas disponible dans Lucide)
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

// Icônes Lucide disponibles pour les moteurs (data-icon dans le HTML)
const LUCIDE_ICONS = { youtube: 'youtube', github: 'github' };

export function initSearch() {
  let currentUrl = 'https://duckduckgo.com/?q=';

  /**
   * Active un onglet moteur et met à jour l'icône SVG + placeholder.
   * Gère trois cas : DDG (SVG custom), Lucide (SVG standard), emoji (fallback).
   */
  function setEngine(tab) {
    document.querySelectorAll('.engine-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentUrl = tab.dataset.url;
    document.getElementById('search-input').placeholder = tab.dataset.ph;

    const iconEl   = document.getElementById('engine-icon');
    const iconName = tab.dataset.icon;

    // Animation : retire la classe, force reflow, remet la classe
    iconEl.classList.remove('spin');
    void iconEl.offsetWidth;

    if (iconName === 'ddg') {
      // Cas DDG : SVG custom inline
      iconEl.innerHTML = DDG_SVG;
    } else if (LUCIDE_ICONS[iconName]) {
      // Cas Lucide : créer un <svg> via lucide.createIcons sur un noeud temporaire
      iconEl.innerHTML = `<i data-lucide="${LUCIDE_ICONS[iconName]}" class="engine-svg"></i>`;
      lucide.createIcons({ nodes: [iconEl] });
    } else {
      // Fallback emoji (ne devrait pas arriver)
      iconEl.textContent = iconName;
    }

    iconEl.classList.add('spin');
  }

  document.querySelectorAll('.engine-tab').forEach(tab => {
    tab.addEventListener('click', () => setEngine(tab));
  });

  // Initialise avec l'onglet déjà marqué .active dans le HTML
  setEngine(document.querySelector('.engine-tab.active'));

  // Soumission du formulaire
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
