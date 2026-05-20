export function initClock() {
  function update() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    document.getElementById('time').textContent =
      [now.getHours(), now.getMinutes(), now.getSeconds()].map(pad).join(':');
    document.getElementById('date').textContent =
      now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  update();
  setInterval(update, 1000);
}
