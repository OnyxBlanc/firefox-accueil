const FAV_COUNT = 8;

function store(key, fb) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fb; } catch { return fb; }
}
function storeSet(key, v) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
}

export function initFavs() {
  let favs = store('nx_favs', null);
  if (!favs || !favs.left) favs = { left: Array(FAV_COUNT).fill(null), right: Array(FAV_COUNT).fill(null) };

  let editSide = null, editIdx = null;

  function save() { storeSet('nx_favs', favs); }

  function faviconUrl(url) {
    try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64`; } catch { return null; }
  }

  function render(side) {
    const col = document.getElementById(`col-${side}`);
    col.innerHTML = '';
    favs[side].forEach((fav, i) => {
      const isLink = fav && fav.url;
      const slot   = document.createElement(isLink ? 'a' : 'div');
      slot.className = 'fav-slot' + (fav ? '' : ' empty');
      if (isLink) { slot.href = fav.url; slot.target = '_blank'; slot.rel = 'noopener noreferrer'; }

      if (isLink) {
        const img = document.createElement('img');
        img.className = 'fav-favicon'; img.src = faviconUrl(fav.url); img.alt = fav.name || '';
        img.onerror = () => { img.style.display = 'none'; slot.insertAdjacentText('beforeend', fav.name ? fav.name.slice(0, 2) : '?'); };
        slot.appendChild(img);
      } else {
        const plus = document.createElement('span');
        plus.className = 'fav-plus'; plus.textContent = '＋'; slot.appendChild(plus);
      }

      if (fav?.name) {
        const label = document.createElement('span');
        label.className = 'fav-label'; label.textContent = fav.name; slot.appendChild(label);
      }

      const editBtn = document.createElement('button');
      editBtn.className = 'fav-edit-btn'; editBtn.textContent = '✏';
      editBtn.addEventListener('click', ev => { ev.preventDefault(); ev.stopPropagation(); openModal(side, i); });
      slot.appendChild(editBtn);

      if (!fav) slot.addEventListener('click', ev => { ev.preventDefault(); openModal(side, i); });
      col.appendChild(slot);
    });
  }

  function openModal(side, idx) {
    editSide = side; editIdx = idx;
    const fav = favs[side][idx];
    document.getElementById('fav-modal-title').textContent = `★ Favori — ${side === 'left' ? 'Gauche' : 'Droite'} #${idx + 1}`;
    document.getElementById('fav-name-input').value = fav ? fav.name : '';
    document.getElementById('fav-url-input').value  = fav ? fav.url  : '';
    document.getElementById('btn-fav-delete').style.display = fav ? 'block' : 'none';
    document.getElementById('fav-overlay').classList.add('open');
    document.getElementById('fav-name-input').focus();
  }

  function closeModal() { document.getElementById('fav-overlay').classList.remove('open'); }

  document.getElementById('btn-fav-close').addEventListener('click', closeModal);
  document.getElementById('btn-fav-cancel').addEventListener('click', closeModal);
  document.getElementById('fav-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });

  document.getElementById('btn-fav-save').addEventListener('click', () => {
    const name = document.getElementById('fav-name-input').value.trim();
    let   url  = document.getElementById('fav-url-input').value.trim();
    if (!url) { alert('Merci de saisir une URL.'); return; }
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    favs[editSide][editIdx] = { name, url };
    save(); render(editSide); closeModal();
  });

  document.getElementById('btn-fav-delete').addEventListener('click', () => {
    favs[editSide][editIdx] = null;
    save(); render(editSide); closeModal();
  });

  render('left');
  render('right');
}
