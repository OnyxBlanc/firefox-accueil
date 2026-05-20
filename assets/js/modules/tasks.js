function store(key, fb) {
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fb; } catch { return fb; }
}
function storeSet(key, v) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
}

const TYPE_ICON = { task: '✅', event: '📅', reminder: '🔔' };
const today = new Date();

// ✅ Extrait YYYY-MM-DD directement depuis la string locale (évite le décalage UTC)
function toYMD(d) {
  if (typeof d === 'string') return d.slice(0, 10);
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}`;
}
function toLocal(d) {
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}
function formatDuration(start, end) {
  const diff = new Date(end) - new Date(start);
  if (diff <= 0) return '—';
  const m = Math.floor(diff / 60000);
  const days = Math.floor(m / 1440), hours = Math.floor((m % 1440) / 60), mins = m % 60;
  return [days && `${days}j`, hours && `${hours}h`, mins && `${mins}min`].filter(Boolean).join(' ');
}
function eventDays(ev) {
  // ✅ On parse les dates en heure locale via les composantes individuelles
  const parseLocal = str => {
    const [date, time='00:00'] = str.split('T');
    const [y, mo, d] = date.split('-').map(Number);
    const [h, mi] = time.split(':').map(Number);
    return new Date(y, mo - 1, d, h, mi);
  };
  const days = [];
  const s = parseLocal(ev.start);
  const e = parseLocal(ev.end);
  s.setHours(0, 0, 0, 0);
  e.setHours(0, 0, 0, 0);
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) days.push(toYMD(new Date(d)));
  return days;
}

export function initTasks() {
  let events      = store('nx_events',  []);
  let taskHistory = store('nx_history', []);
  let calYear  = today.getFullYear();
  let calMonth = today.getMonth();

  // Migration anciens événements
  events = events.map(ev => {
    if (ev.date && !ev.start) {
      const s = ev.date + 'T00:00';
      return { ...ev, start: s, end: new Date(new Date(s).getTime() + (ev.duration||60)*60000).toISOString().slice(0,16) };
    }
    return ev;
  });

  function saveEvents()      { storeSet('nx_events',  events); }
  function saveHistory()     { storeSet('nx_history', taskHistory); }
  function archive(ev, r)    { taskHistory.push({ ...ev, raison: r, archive_le: new Date().toISOString() }); saveHistory(); }

  /* ── Calendrier ── */
  function renderCalendar() {
    const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    document.getElementById('cal-month-label').textContent = `${MONTHS[calMonth]} ${calYear}`;
    const grid = document.getElementById('cal-grid');
    grid.innerHTML = '';
    const first = new Date(calYear, calMonth, 1);
    const last  = new Date(calYear, calMonth + 1, 0);
    const todayStr = toYMD(today);
    const eventDates = new Set(events.flatMap(ev => eventDays(ev)));
    const startDow = (first.getDay() + 6) % 7;
    for (let i = 0; i < startDow; i++) {
      const el = document.createElement('div');
      el.className = 'cal-day other-month';
      el.textContent = new Date(calYear, calMonth, 1 - startDow + i).getDate();
      grid.appendChild(el);
    }
    for (let d = 1; d <= last.getDate(); d++) {
      const ds = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const el = document.createElement('div');
      el.className = 'cal-day';
      if (ds === todayStr) el.classList.add('today');
      if (ds < todayStr)  el.classList.add('past');
      const sp = document.createElement('span'); sp.textContent = d; el.appendChild(sp);
      if (eventDates.has(ds)) {
        const dot = document.createElement('span'); dot.className = 'cal-day-dot'; el.appendChild(dot);
      }
      el.addEventListener('click', () => openEventModal(ds));
      grid.appendChild(el);
    }
  }

  document.getElementById('cal-prev').addEventListener('click', () => {
    if (--calMonth < 0) { calMonth = 11; calYear--; } renderCalendar();
  });
  document.getElementById('cal-next').addEventListener('click', () => {
    if (++calMonth > 11) { calMonth = 0; calYear++; } renderCalendar();
  });

  /* ── Liste tâches ── */
  function renderTasks() {
    const list  = document.getElementById('tasks-list');
    const empty = document.getElementById('tasks-empty');
    list.innerHTML = '';
    const indexed = events.map((ev, i) => ({ ev, i })).sort((a, b) =>
      a.ev.done !== b.ev.done ? (a.ev.done ? 1 : -1) : a.ev.start.localeCompare(b.ev.start)
    );
    if (!indexed.length) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    indexed.forEach(({ ev, i: ri }) => {
      const isOverdue = !ev.done && ev.end < new Date().toISOString().slice(0, 16);
      const item = document.createElement('div');
      item.className = 'task-item' + (ev.done ? ' done' : '') + (isOverdue ? ' overdue' : '');

      const check = document.createElement('div');
      check.className = 'task-check' + (ev.done ? ' checked' : '');
      check.textContent = ev.done ? '✓' : '';
      check.addEventListener('click', () => {
        events[ri].done = !events[ri].done;
        if (events[ri].done) archive(events[ri], 'terminée');
        saveEvents(); renderTasks(); renderCalendar();
      });

      const info = document.createElement('div'); info.className = 'task-info';
      const nameEl = document.createElement('div');
      nameEl.className = 'task-name';
      nameEl.textContent = `${TYPE_ICON[ev.type] ?? '📌'} ${ev.name}`;
      const meta = document.createElement('div'); meta.className = 'task-meta';
      const sd = new Date(ev.start), ed = new Date(ev.end);
      const fmt = (d, o) => d.toLocaleDateString('fr-FR', o);
      const fmtT = d => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      meta.textContent = `${fmt(sd,{day:'numeric',month:'short',year:'numeric'})} ${fmtT(sd)} → ${fmt(ed,{day:'numeric',month:'short'})} ${fmtT(ed)} · ${formatDuration(ev.start,ev.end)}${isOverdue ? ' · ⏰ Passé' : ''}`;
      info.appendChild(nameEl); info.appendChild(meta);

      const del = document.createElement('button');
      del.className = 'task-del'; del.textContent = '×';
      del.addEventListener('click', () => {
        archive(events[ri], 'supprimée');
        events.splice(ri, 1); saveEvents(); renderTasks(); renderCalendar();
      });

      item.appendChild(check); item.appendChild(info); item.appendChild(del);
      list.appendChild(item);
    });
  }

  /* ── Export CSV ── */
  document.getElementById('btn-export-csv').addEventListener('click', () => {
    if (!events.length) { alert('Aucun événement à exporter.'); return; }
    const rows = events.map(e => [`"${e.name.replace(/"/g,'""')}"`, e.start, e.end, formatDuration(e.start,e.end), e.type, e.done?'oui':'non'].join(','));
    const csv  = ['nom,debut,fin,duree,type,fait', ...rows].join('\n');
    const a    = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = `evenements_${toYMD(today)}.csv`; a.click();
  });

  /* ── Historique ── */
  function renderHistory() {
    const list  = document.getElementById('history-list');
    const empty = document.getElementById('history-empty');
    list.innerHTML = '';
    if (!taskHistory.length) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    [...taskHistory].reverse().forEach(ev => {
      const item = document.createElement('div'); item.className = 'history-item';
      const isDone = ev.raison === 'terminée';
      const badge = document.createElement('span');
      badge.className = `history-badge ${isDone ? 'done' : 'deleted'}`;
      badge.textContent = isDone ? '✓ Terminée' : '✕ Supprimée';
      const info = document.createElement('div'); info.className = 'history-info';
      const nameEl = document.createElement('div');
      nameEl.className = 'history-name';
      nameEl.textContent = `${TYPE_ICON[ev.type] ?? '📌'} ${ev.name}`;
      const meta = document.createElement('div'); meta.className = 'history-meta';
      const ad = new Date(ev.archive_le), sd = new Date(ev.start);
      meta.textContent = `${sd.toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})} · Archivé le ${ad.toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'})} à ${ad.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})}`;
      info.appendChild(nameEl); info.appendChild(meta);
      item.appendChild(badge); item.appendChild(info);
      list.appendChild(item);
    });
  }

  document.getElementById('btn-history').addEventListener('click', () => {
    renderHistory(); document.getElementById('history-overlay').classList.add('open');
  });
  document.getElementById('btn-history-close').addEventListener('click', () => {
    document.getElementById('history-overlay').classList.remove('open');
  });
  document.getElementById('history-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) document.getElementById('history-overlay').classList.remove('open');
  });
  document.getElementById('btn-history-clear').addEventListener('click', () => {
    if (!taskHistory.length) { alert("L'historique est déjà vide."); return; }
    if (confirm("Vider tout l'historique ?")) { taskHistory = []; saveHistory(); renderHistory(); }
  });
  document.getElementById('btn-history-export').addEventListener('click', () => {
    if (!taskHistory.length) { alert("Aucune entrée dans l'historique."); return; }
    const rows = taskHistory.map(e => [`"${e.name.replace(/"/g,'""')}"`,e.start,e.end,formatDuration(e.start,e.end),e.type,e.raison,e.archive_le].join(','));
    const csv  = ['nom,debut,fin,duree,type,raison,archive_le',...rows].join('\n');
    const a    = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
    a.download = `historique_${toYMD(today)}.csv`; a.click();
  });

  /* ── Modale ajout ── */
  function openEventModal(preDate = '') {
    document.getElementById('ev-name').value = '';
    const base = preDate ? new Date(preDate + 'T08:00') : new Date();
    document.getElementById('ev-start').value = toLocal(base);
    document.getElementById('ev-end').value   = toLocal(new Date(base.getTime() + 3600000));
    document.getElementById('ev-type').value  = 'task';
    document.getElementById('modal-overlay').classList.add('open');
    document.getElementById('ev-name').focus();
  }
  function closeEventModal() { document.getElementById('modal-overlay').classList.remove('open'); }

  document.getElementById('btn-add-event').addEventListener('click', () => openEventModal());
  document.getElementById('btn-cancel').addEventListener('click', closeEventModal);
  document.getElementById('modal-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeEventModal(); });
  document.getElementById('btn-save').addEventListener('click', () => {
    const name  = document.getElementById('ev-name').value.trim();
    const start = document.getElementById('ev-start').value;
    const end   = document.getElementById('ev-end').value;
    const type  = document.getElementById('ev-type').value;
    if (!name || !start || !end) { alert('Merci de renseigner le nom, la date de début et de fin.'); return; }
    if (end <= start) { alert('La date de fin doit être après la date de début.'); return; }
    events.push({ name, start, end, type, done: false, created: new Date().toISOString() });
    saveEvents(); renderTasks(); renderCalendar(); closeEventModal();
  });

  renderCalendar();
  renderTasks();
}
