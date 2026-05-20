export function initTheme() {
  const saved = localStorage.getItem('nx_theme') || 'rose';
  document.body.setAttribute('data-theme', saved);

  document.querySelectorAll('.theme-dot').forEach(dot => {
    if (dot.dataset.theme === saved) dot.classList.add('active');
    dot.addEventListener('click', () => {
      const t = dot.dataset.theme;
      document.body.setAttribute('data-theme', t);
      localStorage.setItem('nx_theme', t);
      document.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });
}
