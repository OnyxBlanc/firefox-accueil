/* ═══════════════════════════════════════════════════════════════
   SEARCH.JS — Barre de recherche multi-moteurs + menu FMHY
   - Gère les onglets moteurs (.engine-tab) définis dans index.html
   - Chaque onglet porte : data-url, data-icon, data-ph (placeholder)
   - Soumet la recherche dans un nouvel onglet (_blank)
   - Gère l'ouverture/fermeture de la modale FMHY
═══════════════════════════════════════════════════════════════ */

export function initSearch() {
  // URL de recherche du moteur actif (DuckDuckGo par défaut)
  let currentUrl = 'https://duckduckgo.com/?q=';

  /**
   * Active un onglet moteur et met à jour l'icône + placeholder.
   * @param {HTMLElement} tab - Le bouton .engine-tab cliqué
   */
  function setEngine(tab) {
    // Retire la classe active sur tous les onglets
    document.querySelectorAll('.engine-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentUrl = tab.dataset.url;
    document.getElementById('search-input').placeholder = tab.dataset.ph;

    // Animation spin sur l'icône lors du changement de moteur
    const icon = document.getElementById('engine-icon');
    icon.classList.remove('spin');
    void icon.offsetWidth; // Force le reflow pour relancer l'animation CSS
    icon.textContent = tab.dataset.icon;
    icon.classList.add('spin');
  }

  // Branche chaque onglet moteur
  document.querySelectorAll('.engine-tab').forEach(tab => {
    tab.addEventListener('click', () => setEngine(tab));
  });

  // Initialise avec l'onglet déjà marqué .active dans le HTML
  setEngine(document.querySelector('.engine-tab.active'));

  // Soumission du formulaire → ouvre la recherche dans un nouvel onglet
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

  // Fermeture via bouton ✕ ou clic sur l'overlay
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
