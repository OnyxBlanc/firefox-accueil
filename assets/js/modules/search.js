export function initSearch() {
  let currentUrl = 'https://duckduckgo.com/?q=';

  function setEngine(tab) {
    document.querySelectorAll('.engine-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentUrl = tab.dataset.url;
    document.getElementById('search-input').placeholder = tab.dataset.ph;
    const icon = document.getElementById('engine-icon');
    icon.classList.remove('spin');
    void icon.offsetWidth;
    icon.textContent = tab.dataset.icon;
    icon.classList.add('spin');
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
