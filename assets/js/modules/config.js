/* ═══════════════════════════════════════════
   MODULE CONFIG — Panel de configuration
   + Sauvegarde / Restauration JSON
═══════════════════════════════════════════ */

const KEYS = {
  theme:  'nx_theme',
  bg:     'nx_bg',
  bgType: 'nx_bg_type',   // 'gradient' | 'color' | 'image'
  quote:  'nx_quote',
  city:   'nx_weather_city',
  favs:   'nx_favs',
  tasks:  'nx_tasks',
};

export function initConfig() {
  applyBackground();
  applyQuote();
  injectUI();
}

/* ── Appliquer le fond sauvegardé ── */
function applyBackground() {
  const type = localStorage.getItem(KEYS.bgType) || 'gradient';
  const val  = localStorage.getItem(KEYS.bg) || '';
  if (type === 'color' && val) {
    document.body.style.background = val;
  } else if (type === 'image' && val) {
    document.body.style.background = `url('${val}') center/cover no-repeat fixed`;
  }
  // gradient = CSS variable, rien à faire
}

/* ── Appliquer la citation sauvegardée ── */
function applyQuote() {
  const q = localStorage.getItem(KEYS.quote);
  if (q) {
    const el = document.getElementById('quote');
    if (el) el.textContent = `« ${q} »`;
  }
}

/* ── Injecter le bouton ⚙️ et la modale ── */
function injectUI() {
  // --- Bouton engrenage ---
  const btn = document.createElement('button');
  btn.id = 'config-btn';
  btn.title = 'Paramètres';
  btn.textContent = '⚙️';
  btn.addEventListener('click', () => openPanel());
  document.body.appendChild(btn);

  // --- Overlay + modale ---
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.id = 'config-overlay';
  overlay.innerHTML = `
    <div class="modal-box" id="config-modal">
      <div class="modal-header">
        <h3>⚙️ Paramètres</h3>
        <button class="btn-close-modal" id="btn-config-close">✕</button>
      </div>

      <div class="config-section">
        <div class="config-section-title">🖼️ Arrière-plan</div>
        <div class="config-row">
          <label>Type</label>
          <select id="cfg-bg-type">
            <option value="gradient">Gradient (défaut)</option>
            <option value="color">Couleur unie</option>
            <option value="image">Image (URL)</option>
          </select>
        </div>
        <div class="config-row" id="cfg-bg-color-row" style="display:none">
          <label>Couleur</label>
          <input type="color" id="cfg-bg-color" value="#0d0510" />
        </div>
        <div class="config-row" id="cfg-bg-image-row" style="display:none">
          <label>URL image</label>
          <input type="url" id="cfg-bg-image" placeholder="https://…/image.jpg" />
        </div>
      </div>

      <div class="config-section">
        <div class="config-section-title">💬 Citation du bas</div>
        <div class="config-row">
          <label>Texte</label>
          <input type="text" id="cfg-quote" placeholder="Ta citation personnalisée…" />
        </div>
      </div>

      <div class="config-section">
        <div class="config-section-title">🌤️ Météo</div>
        <div class="config-row">
          <label>Ville par défaut</label>
          <input type="text" id="cfg-city" placeholder="ex : Marseille, Paris…" />
        </div>
      </div>

      <div class="config-section">
        <div class="config-section-title">💾 Sauvegarde & Restauration</div>
        <div class="config-backup-row">
          <button id="cfg-export" class="cfg-btn-secondary">⬇️ Exporter la config (JSON)</button>
          <label class="cfg-btn-secondary cfg-import-label">
            ⬆️ Importer une config
            <input type="file" id="cfg-import" accept=".json" style="display:none" />
          </label>
        </div>
        <p id="cfg-import-status"></p>
      </div>

      <div class="modal-actions">
        <button class="btn-cancel" id="cfg-reset">🗑️ Réinitialiser tout</button>
        <button class="btn-save"   id="cfg-save">✅ Enregistrer</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // fermeture
  document.getElementById('btn-config-close').addEventListener('click', closePanel);
  overlay.addEventListener('click', e => { if (e.target === overlay) closePanel(); });

  // type de fond → afficher/masquer les champs
  const bgType = document.getElementById('cfg-bg-type');
  bgType.addEventListener('change', toggleBgFields);

  // export
  document.getElementById('cfg-export').addEventListener('click', exportConfig);

  // import
  document.getElementById('cfg-import').addEventListener('change', importConfig);

  // reset
  document.getElementById('cfg-reset').addEventListener('click', resetAll);

  // save
  document.getElementById('cfg-save').addEventListener('click', saveConfig);
}

function openPanel() {
  const overlay = document.getElementById('config-overlay');
  // Pré-remplir les champs avec les valeurs actuelles
  const bgType = localStorage.getItem(KEYS.bgType) || 'gradient';
  document.getElementById('cfg-bg-type').value = bgType;
  toggleBgFields();
  const bgVal = localStorage.getItem(KEYS.bg) || '';
  if (bgType === 'color')  document.getElementById('cfg-bg-color').value = bgVal || '#0d0510';
  if (bgType === 'image')  document.getElementById('cfg-bg-image').value = bgVal;
  const quote = localStorage.getItem(KEYS.quote) || '';
  document.getElementById('cfg-quote').value = quote;
  const city = localStorage.getItem(KEYS.city) || '';
  document.getElementById('cfg-city').value = city;
  document.getElementById('cfg-import-status').textContent = '';
  overlay.classList.add('open');
}

function closePanel() {
  document.getElementById('config-overlay').classList.remove('open');
}

function toggleBgFields() {
  const val = document.getElementById('cfg-bg-type').value;
  document.getElementById('cfg-bg-color-row').style.display = val === 'color' ? 'flex' : 'none';
  document.getElementById('cfg-bg-image-row').style.display = val === 'image' ? 'flex' : 'none';
}

function saveConfig() {
  const bgType = document.getElementById('cfg-bg-type').value;
  let bgVal = '';
  if (bgType === 'color') bgVal = document.getElementById('cfg-bg-color').value;
  if (bgType === 'image') bgVal = document.getElementById('cfg-bg-image').value.trim();

  localStorage.setItem(KEYS.bgType, bgType);
  localStorage.setItem(KEYS.bg, bgVal);

  const quote = document.getElementById('cfg-quote').value.trim();
  if (quote) localStorage.setItem(KEYS.quote, quote);
  else localStorage.removeItem(KEYS.quote);

  const city = document.getElementById('cfg-city').value.trim();
  if (city) localStorage.setItem(KEYS.city, city);

  closePanel();
  location.reload(); // applique fond + citation immédiatement
}

/* ── Export JSON ── */
function exportConfig() {
  const data = {};
  Object.entries(KEYS).forEach(([k, v]) => {
    const val = localStorage.getItem(v);
    if (val !== null) data[k] = val;
  });
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = 'nx-accueil-config.json';
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Import JSON ── */
function importConfig(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      Object.entries(KEYS).forEach(([k, v]) => {
        if (data[k] !== undefined) localStorage.setItem(v, data[k]);
      });
      document.getElementById('cfg-import-status').textContent = '✅ Config importée ! Rechargement…';
      document.getElementById('cfg-import-status').style.color = '#80d890';
      setTimeout(() => location.reload(), 1200);
    } catch {
      document.getElementById('cfg-import-status').textContent = '❌ Fichier JSON invalide.';
      document.getElementById('cfg-import-status').style.color = '#e07080';
    }
  };
  reader.readAsText(file);
}

/* ── Reset complet ── */
function resetAll() {
  if (!confirm('Réinitialiser toute la configuration, les favoris et les tâches ?')) return;
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  location.reload();
}
