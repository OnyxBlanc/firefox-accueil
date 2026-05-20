/* ═══════════════════════════════════════════
   CONFIG — Panel de configuration
   Clés localStorage : nx_theme, nx_favs, nx_events, nx_history, nx_weather_city
═══════════════════════════════════════════ */

const KEYS = ['nx_theme', 'nx_favs', 'nx_events', 'nx_history', 'nx_weather_city'];

function getAllData() {
  const obj = { _version: 1, _date: new Date().toISOString() };
  KEYS.forEach(k => {
    try { const v = localStorage.getItem(k); obj[k] = v !== null ? JSON.parse(v) : null; } catch { obj[k] = null; }
  });
  return obj;
}

function setAllData(obj) {
  KEYS.forEach(k => {
    if (obj[k] !== undefined && obj[k] !== null) {
      try { localStorage.setItem(k, JSON.stringify(obj[k])); } catch {}
    }
  });
}

function exportJSON() {
  const data = getAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `accueil-config-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function importJSON() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const obj  = JSON.parse(text);
      if (typeof obj !== 'object' || !obj._version) {
        alert('❌ Fichier invalide — ce n\'est pas une sauvegarde Accueil.');
        return;
      }
      if (!confirm('⚠️ Importer cette configuration ? Tes données actuelles seront remplacées.')) return;
      setAllData(obj);
      alert('✅ Configuration importée ! La page va se recharger.');
      location.reload();
    } catch {
      alert('❌ Impossible de lire le fichier JSON.');
    }
  });
  input.click();
}

function resetAll() {
  if (!confirm('⚠️ Réinitialiser TOUTE la configuration ? (thème, favoris, tâches…)')) return;
  KEYS.forEach(k => localStorage.removeItem(k));
  alert('✅ Configuration réinitialisée. La page va se recharger.');
  location.reload();
}

export function initConfig() {
  /* ── Bouton ⚙️ dans le DOM ── */
  const btn = document.createElement('button');
  btn.id = 'config-btn';
  btn.title = 'Configuration';
  btn.textContent = '⚙️';
  document.body.appendChild(btn);

  /* ── Overlay + Modale ── */
  const overlay = document.createElement('div');
  overlay.id = 'config-overlay';
  overlay.className = 'overlay';

  overlay.innerHTML = `
    <div class="modal-box" id="config-modal">
      <div class="modal-header">
        <h3>⚙️ Configuration</h3>
        <button class="btn-close-modal" id="btn-config-close">✕</button>
      </div>

      <div class="config-section">
        <div class="config-section-title">🎨 Thème</div>
        <div id="config-theme-row"></div>
      </div>

      <div class="config-section">
        <div class="config-section-title">💾 Sauvegarde & Restauration</div>
        <p class="config-desc">Exporte toute ta configuration (favoris, tâches, thème, ville météo) dans un fichier JSON, ou importe une sauvegarde existante.</p>
        <div class="config-actions">
          <button class="config-action-btn export" id="btn-cfg-export">⬇️ Exporter JSON</button>
          <button class="config-action-btn import" id="btn-cfg-import">⬆️ Importer JSON</button>
        </div>
      </div>

      <div class="config-section danger-zone">
        <div class="config-section-title">⚠️ Zone de danger</div>
        <p class="config-desc">Supprime toutes les données locales : favoris, tâches, historique, thème et ville météo.</p>
        <button class="config-action-btn reset" id="btn-cfg-reset">🗑️ Réinitialiser tout</button>
      </div>

      <div class="config-footer">
        <span id="config-storage-info"></span>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  /* ── Thème inline dans la modale ── */
  const themeRow = overlay.querySelector('#config-theme-row');
  const themes = ['rose', 'bleu', 'vert', 'rouge', 'violet'];
  themes.forEach(t => {
    const dot = document.createElement('div');
    dot.className = 'theme-dot config-theme-dot' + (localStorage.getItem('nx_theme') === t || (!localStorage.getItem('nx_theme') && t === 'rose') ? ' active' : '');
    dot.dataset.theme = t;
    dot.title = t.charAt(0).toUpperCase() + t.slice(1);
    dot.addEventListener('click', () => {
      document.body.setAttribute('data-theme', t);
      localStorage.setItem('nx_theme', t);
      themeRow.querySelectorAll('.theme-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
      /* sync avec le switcher principal */
      document.querySelectorAll('#theme-switcher .theme-dot').forEach(d => {
        d.classList.toggle('active', d.dataset.theme === t);
      });
    });
    themeRow.appendChild(dot);
  });

  /* ── Info stockage ── */
  function updateStorageInfo() {
    try {
      let total = 0;
      KEYS.forEach(k => { const v = localStorage.getItem(k); if (v) total += v.length; });
      const kb = (total / 1024).toFixed(1);
      overlay.querySelector('#config-storage-info').textContent = `💿 Données locales : ${kb} ko utilisés`;
    } catch {}
  }

  /* ── Ouvrir / Fermer ── */
  function open()  { updateStorageInfo(); overlay.classList.add('open'); }
  function close() { overlay.classList.remove('open'); }

  btn.addEventListener('click', open);
  overlay.querySelector('#btn-config-close').addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

  /* ── Actions ── */
  overlay.querySelector('#btn-cfg-export').addEventListener('click', exportJSON);
  overlay.querySelector('#btn-cfg-import').addEventListener('click', importJSON);
  overlay.querySelector('#btn-cfg-reset').addEventListener('click', resetAll);
}
