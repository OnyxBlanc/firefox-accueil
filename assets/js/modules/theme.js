/* ═══════════════════════════════════════════════════════════════
   THEME.JS — Sélecteur de thème de couleur
   - Lit le thème sauvegardé dans localStorage (clé : nx_theme)
   - Applique data-theme sur <body> pour activer les variables CSS
   - Crée dynamiquement #theme-switcher et l'injecte dans <body>

   ⚠️ IMPORTANT : Le switcher est injecté via JS (et non en HTML statique)
   pour éviter d'être piégé dans un stacking context créé par un parent
   avec backdrop-filter. Cela garantit que les pastilles restent
   toujours visibles au-dessus de tous les autres éléments.

   Thèmes disponibles : rose | bleu | vert | rouge | violet
═══════════════════════════════════════════════════════════════ */

export function initTheme() {
  // Thème par défaut : rose
  const saved = localStorage.getItem('nx_theme') || 'rose';
  document.body.setAttribute('data-theme', saved);

  // Création du conteneur #theme-switcher
  const switcher = document.createElement('div');
  switcher.id = 'theme-switcher';

  const themes = ['rose', 'bleu', 'vert', 'rouge', 'violet'];

  themes.forEach(t => {
    // Création de chaque pastille de couleur
    const dot = document.createElement('div');
    dot.className = 'theme-dot' + (t === saved ? ' active' : '');
    dot.dataset.theme = t;
    dot.title = t.charAt(0).toUpperCase() + t.slice(1); // Tooltip : "Rose", "Bleu"…

    dot.addEventListener('click', () => {
      // Applique le thème sur le body et le sauvegarde
      document.body.setAttribute('data-theme', t);
      localStorage.setItem('nx_theme', t);
      // Met à jour la pastille active
      switcher.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });

    switcher.appendChild(dot);
  });

  // Injection directement dans <body> (niveau racine, hors de tout stacking context)
  document.body.appendChild(switcher);
}
