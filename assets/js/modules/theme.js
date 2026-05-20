export function initTheme() {
  const saved = localStorage.getItem('nx_theme') || 'rose';
  document.body.setAttribute('data-theme', saved);

  // Injection du switcher directement dans <body> (évite le stacking context)
  const switcher = document.createElement('div');
  switcher.id = 'theme-switcher';

  const themes = ['rose', 'bleu', 'vert', 'rouge', 'violet'];
  themes.forEach(t => {
    const dot = document.createElement('div');
    dot.className = 'theme-dot' + (t === saved ? ' active' : '');
    dot.dataset.theme = t;
    dot.title = t.charAt(0).toUpperCase() + t.slice(1);
    dot.addEventListener('click', () => {
      document.body.setAttribute('data-theme', t);
      localStorage.setItem('nx_theme', t);
      switcher.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
    switcher.appendChild(dot);
  });

  document.body.appendChild(switcher);
}
