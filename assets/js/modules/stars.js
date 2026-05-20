export function initStars() {
  const canvas = document.getElementById('stars-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, stars = [], rafId = null, paused = false;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  function randBetween(a, b) { return a + Math.random() * (b - a); }

  function createStar() {
    const colored = Math.random() < 0.15;
    const hue     = randBetween(300, 340);
    return {
      x: Math.random() * W, y: Math.random() * H,
      r: randBetween(0.4, 1.6), alpha: randBetween(0.2, 1),
      dalpha: randBetween(0.003, 0.012) * (Math.random() < 0.5 ? 1 : -1),
      vx: randBetween(-0.06, 0.06), vy: randBetween(-0.04, 0.04),
      colored,
      fillStyle:   colored ? `hsl(${hue.toFixed(0)}, 80%, 85%)` : '#ffffff',
      shadowColor: colored ? `hsl(${hue.toFixed(0)}, 80%, 70%)` : 'rgba(255,220,235,0.8)',
      shadowBlur: 0,
    };
  }

  function initStarList() {
    stars = [];
    const count = Math.floor((W * H) / 5000);
    for (let i = 0; i < count; i++) {
      const s = createStar();
      s.shadowBlur = s.r * (s.colored ? 6 : 4);
      stars.push(s);
    }
  }

  function draw() {
    if (paused) { rafId = null; return; }
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      s.x += s.vx; s.y += s.vy; s.alpha += s.dalpha;
      if (s.alpha <= 0.05 || s.alpha >= 1) s.dalpha *= -1;
      s.alpha = Math.max(0.05, Math.min(1, s.alpha));
      if (s.x < -2)    s.x = W + 2;
      if (s.x > W + 2) s.x = -2;
      if (s.y < -2)    s.y = H + 2;
      if (s.y > H + 2) s.y = -2;
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

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { paused = true; }
    else { paused = false; if (!rafId) rafId = requestAnimationFrame(draw); }
  });

  window.addEventListener('resize', () => { resize(); initStarList(); });
  resize();
  initStarList();
  rafId = requestAnimationFrame(draw);
}
