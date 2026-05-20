/* ═══════════════════════════════════════════════════════════════
   FAVORITES.JS — Favoris latéraux avec favicon automatique
   - Affiche 8 slots à gauche (#col-left) et 8 à droite (#col-right)
   - Chaque slot peut contenir un favori { name, url } ou être vide
   - Favicon récupéré via l'API Google S2 (sz=64)
   - Données stockées dans localStorage (clé : nx_favs)
   - Modale d'édition : #fav-overlay (définie dans index.html)
═══════════════════════════════════════════════════════════════ */

const FAV_COUNT = 8; // Nombre de slots par colonne

/** Lit une valeur JSON depuis localStorage (retourne fb si absent/invalide) */
function store(key, fb) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fb; } catch { return fb; }
}

/** Écrit une valeur JSON dans localStorage */
function storeSet(key, v) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
}

export function initFavs() {
  // Charge les favoris ou initialise une structure vide
  let favs = store('nx_favs', null);
  if (!favs || !favs.left) favs = { left: Array(FAV_COUNT).fill(null), right: Array(FAV_COUNT).fill(null) };

  let editSide = null, editIdx = null; // Côté et index en cours d'édition

  function save() { storeSet('nx_favs', favs); }

  /**
   * Retourne l'URL du favicon via Google S2.
   * @param {string} url - URL complète du site
   * @returns {string|null} URL du favicon ou null si URL invalide
   */
  function faviconUrl(url) {
    try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`; } catch { return null; }
  }

  /**
   * Affiche tous les slots d'une colonne.
   * @param {'left'|'right'} side - Colonne à re-rendre
   */
  function render(side) {
    const col = document.getElementById(`col-${side}`);
    col.innerHTML = '';

    favs[side].forEach((fav, i) => {
      const isLink = fav && fav.url;
      // Slot cliquable → <a> si favori rempli, <div> si vide
      const slot   = document.createElement(isLink ? 'a' : 'div');
      slot.className = 'fav-slot' + (fav ? '' : ' empty');
      if (isLink) { slot.href = fav.url; slot.target = '_blank'; slot.rel = 'noopener noreferrer'; }

      if (isLink) {
        // Favicon avec fallback texte si l'image échoue
        const img = document.createElement('img');
        img.className = 'fav-favicon'; img.src = faviconUrl(fav.url); img.alt = fav.name || '';
        img.onerror = () => { img.style.display = 'none'; slot.insertAdjacentText('beforeend', fav.name ? fav.name.slice(0, 2) : '?'); };
        slot.appendChild(img);
      } else {
        // Slot vide → affiche un ＋
        const plus = document.createElement('span');
        plus.className = 'fav-plus'; plus.textContent = '＋'; slot.appendChild(plus);
      }

      // Label (tooltip au survol)
      if (fav?.name) {
        const label = document.createElement('span');
        label.className = 'fav-label'; label.textContent = fav.name; slot.appendChild(label);
      }

      // Bouton d'édition ✏ (visible au survol)
      const editBtn = document.createElement('button');
      editBtn.className = 'fav-edit-btn'; editBtn.textContent = '✏';
      editBtn.addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); openModal(side, i); });
      slot.appendChild(editBtn);

      // Clic sur slot vide → ouvre la modale directement
      if (!fav) slot.addEventListener('click', ev => { ev.preventDefault(); openModal(side, i); });
      col.appendChild(slot);
    });
  }

  /**
   * Ouvre la modale d'édition pour un slot donné.
   * @param {'left'|'right'} side - Colonne concernée
   * @param {number} idx - Index du slot dans la colonne
   */
  function openModal(side, idx) {
    editSide = side; editIdx = idx;
    const fav = favs[side][idx];
    document.getElementById('fav-modal-title').textContent = `★ Favori — ${side === 'left' ? 'Gauche' : 'Droite'} #${idx + 1}`;
    document.getElementById('fav-name-input').value = fav ? fav.name : '';
    document.getElementById('fav-url-input').value  = fav ? fav.url  : '';
    document.getElementById('btn-fav-delete').style.display = fav ? 'block' : 'none'; // Masque "Supprimer" si slot vide
    document.getElementById('fav-overlay').classList.add('open');
    document.getElementById('fav-name-input').focus();
  }

  function closeModal() { document.getElementById('fav-overlay').classList.remove('open'); }

  // Fermeture modale
  document.getElementById('btn-fav-close').addEventListener('click', closeModal);
  document.getElementById('btn-fav-cancel').addEventListener('click', closeModal);
  document.getElementById('fav-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });

  // Sauvegarde d'un favori
  document.getElementById('btn-fav-save').addEventListener('click', () => {
    const name = document.getElementById('fav-name-input').value.trim();
    let   url  = document.getElementById('fav-url-input').value.trim();
    if (!url) { alert('Merci de saisir une URL.'); return; }
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url; // Ajoute https:// si absent
    favs[editSide][editIdx] = { name, url };
    save(); render(editSide); closeModal();
  });

  // Suppression d'un favori
  document.getElementById('btn-fav-delete').addEventListener('click', () => {
    favs[editSide][editIdx] = null;
    save(); render(editSide); closeModal();
  });

  // Premier rendu
  render('left');
  render('right');
}
