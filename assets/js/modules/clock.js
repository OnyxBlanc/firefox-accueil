/* ═══════════════════════════════════════════════════════════════
   CLOCK.JS — Horloge et date en temps réel
   - Met à jour #time (HH:MM:SS) et #date (ex: mercredi 20 mai)
   - Tourne toutes les secondes via setInterval
   - Format date : français (toLocaleDateString 'fr-FR')
═══════════════════════════════════════════════════════════════ */

export function initClock() {
  /**
   * Met à jour l'affichage de l'heure et de la date.
   * Appelée immédiatement au chargement puis toutes les secondes.
   */
  function update() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0'); // ex: 9 → "09"

    // Affiche HH:MM:SS dans #time
    document.getElementById('time').textContent =
      [now.getHours(), now.getMinutes(), now.getSeconds()].map(pad).join(':');

    // Affiche "mercredi 20 mai" dans #date
    document.getElementById('date').textContent =
      now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  update();                    // Premier affichage immédiat
  setInterval(update, 1000);   // Mise à jour chaque seconde
}
