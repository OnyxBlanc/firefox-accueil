/* ═══════════════════════════════════════════════════════════════
   STARS.JS — Fond animé avec canvas d'étoiles
   - Génère un nombre d'étoiles proportionnel à la surface de l'écran
   - Chaque étoile : position, vitesse, rayon, opacité qui pulse
   - 15% des étoiles sont colorées (teinte rose/violette)
   - Pause automatique quand l'onglet est en arrière-plan (visibilitychange)
   - Se redimensionne proprement au resize de la fenêtre
═══════════════════════════════════════════════════════════════ */

export function initStars() {
  const canvas = document.getElementById('stars-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, stars = [], rafId = null, paused = false;

  /** Adapte le canvas à la taille de la fenêtre */
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  /** Retourne un nombre aléatoire entre a et b */
  function randBetween(a, b) { return a + Math.random() * (b - a); }

  /**
   * Crée une étoile avec des propriétés aléatoires.
   * colored : 15% de chance d'être rose/violette (hsl 300-340)
   * dalpha  : variation d'opacité (positif = s'éclaircit, négatif = s'assombrit)
   */
  function createStar() {
    const colored = Math.random() < 0.15;
    const hue     = randBetween(300, 340);
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: randBetween(0.4, 1.6),                           // rayon
      alpha: randBetween(0.2, 1),                         // opacité initiale
      dalpha: randBetween(0.003, 0.012) * (Math.random() < 0.5 ? 1 : -1), // variation d'opacité
      vx: randBetween(-0.06, 0.06),                       // vitesse horizontale
      vy: randBetween(-0.04, 0.04),                       // vitesse verticale
      colored,
      fillStyle:   colored ? `hsl(${hue.toFixed(0)}, 80%, 85%)` : '#ffffff',
      shadowColor: colored ? `hsl(${hue.toFixed(0)}, 80%, 70%)` : 'rgba(255,220,235,0.8)',
      shadowBlur: 0,
    };
  }

  /**
   * Génère le tableau d'étoiles.
   * Densité : 1 étoile pour 5000px² (ajustée automatiquement au resize)
   */
  function initStarList() {
    stars = [];
    const count = Math.floor((W * H) / 5000);
    for (let i = 0; i < count; i++) {
      const s = createStar();
      s.shadowBlur = s.r * (s.colored ? 6 : 4); // glow plus fort sur les étoiles colorées
      stars.push(s);
    }
  }

  /**
   * Boucle de rendu principale (requestAnimationFrame).
   * - Déplace chaque étoile selon sa vitesse
   * - Fait pulser l'opacité
   * - Gère le rebouclement sur les bords
   */
  function draw() {
    if (paused) { rafId = null; return; } // Stop la RAF si l'onglet est caché
    ctx.clearRect(0, 0, W, H);

    for (const s of stars) {
      // Déplacement
      s.x += s.vx; s.y += s.vy;
      // Pulsation d'opacité — inverse la direction quand on atteint les bornes
      s.alpha += s.dalpha;
      if (s.alpha <= 0.05 || s.alpha >= 1) s.dalpha *= -1;
      s.alpha = Math.max(0.05, Math.min(1, s.alpha));
      // Rebouclement sur les bords (wrap-around)
      if (s.x < -2)    s.x = W + 2;
      if (s.x > W + 2) s.x = -2;
      if (s.y < -2)    s.y = H + 2;
      if (s.y > H + 2) s.y = -2;
      // Dessin
      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle   = s.fillStyle;
      ctx.shadowColor = s.shadowColor;
      ctx.shadowBlur  = s.shadowBlur;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    rafId = requestAnimationFrame(draw);
  }

  // Pause/reprise selon la visibilité de l'onglet (économie CPU)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { paused = true; }
    else { paused = false; if (!rafId) rafId = requestAnimationFrame(draw); }
  });

  // Recalcul complet au resize
  window.addEventListener('resize', () => { resize(); initStarList(); });

  resize();
  initStarList();
  rafId = requestAnimationFrame(draw);
}
