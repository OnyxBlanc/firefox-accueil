/* ═══════════════════════════════════════════════════════════════
   WEATHER.JS — Widget météo via Open-Meteo (sans clé API)
   - Charge les données météo actuelles pour les coordonnées stockées
   - Permet de rechercher une ville via l'API de géocodage Open-Meteo
   - Met à jour automatiquement toutes les 10 minutes
═══════════════════════════════════════════════════════════════ */

/**
 * Correspondance code WMO → icône Lucide
 * On regroupe les conditions proches sur la même icône pour garder
 * un rendu cohérent avec le style line de Lucide.
 */
const ICONS = {
  0:  'sun',          // Ciel dégagé
  1:  'sun',          // Peu nuageux
  2:  'cloud-sun',    // Partiellement nuageux
  3:  'cloud',        // Couvert
  45: 'wind',         // Brouillard
  48: 'wind',         // Brouillard givrant
  51: 'cloud-drizzle',// Bruine légère
  53: 'cloud-drizzle',// Bruine
  55: 'cloud-rain',   // Bruine forte
  61: 'cloud-rain',   // Pluie légère
  63: 'cloud-rain',   // Pluie
  65: 'cloud-rain',   // Pluie forte
  71: 'snowflake',    // Neige légère
  73: 'snowflake',    // Neige
  75: 'snowflake',    // Neige forte
  80: 'cloud-drizzle',// Averses légères
  81: 'cloud-rain',   // Averses
  82: 'cloud-rain',   // Averses violentes
  95: 'cloud-lightning',// Orage
  96: 'cloud-lightning',// Orage avec grêle
  99: 'cloud-lightning', // Orage violent
};

/** Correspondance code WMO → description française */
const DESCS = {
  0:'Ciel dégagé',1:'Peu nuageux',2:'Partiellement nuageux',3:'Couvert',
  45:'Brouillard',48:'Brouillard givrant',
  51:'Bruine légère',53:'Bruine',55:'Bruine forte',
  61:'Pluie légère',63:'Pluie',65:'Pluie forte',
  71:'Neige légère',73:'Neige',75:'Neige forte',
  80:'Averses légères',81:'Averses',82:'Averses violentes',
  95:'Orage',96:'Orage avec grêle',99:'Orage violent',
};

/** Injecte une icône Lucide dans un élément et l'initialise */
function setLucideIcon(el, iconName, className = 'wx-icon') {
  el.innerHTML = `<i data-lucide="${iconName}" class="${className}"></i>`;
  lucide.createIcons({ nodes: [el] });
}

export function initWeather() {
  let lat  = parseFloat(localStorage.getItem('wx_lat')  || '43.2965');
  let lon  = parseFloat(localStorage.getItem('wx_lon')  || '5.3698');
  let city = localStorage.getItem('wx_city') || 'Marseille, FR';

  async function load() {
    document.getElementById('weather-error').style.display = 'none';
    try {
      const res  = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
        `&wind_speed_unit=kmh&timezone=auto`
      );
      const data = await res.json();
      const c    = data.current;
      const code = c.weather_code;

      // Icône météo principale — SVG Lucide
      const iconEl = document.getElementById('weather-icon');
      setLucideIcon(iconEl, ICONS[code] ?? 'thermometer', 'wx-icon');

      // Température & description
      document.getElementById('weather-temp').textContent = `${Math.round(c.temperature_2m)}°C`;
      document.getElementById('weather-desc').textContent = DESCS[code] ?? 'Inconnu';

      // Ville — on garde l'icône map-pin et on met à jour uniquement le texte
      document.getElementById('weather-city-label').innerHTML =
        `<i data-lucide="map-pin" class="inline-icon"></i> ${city}`;
      lucide.createIcons({ nodes: [document.getElementById('weather-city-label')] });

      // Humidité, vent, ressenti — on ne touche qu'aux spans de valeur
      document.getElementById('wx-humidity-val').textContent = `${c.relative_humidity_2m}%`;
      document.getElementById('wx-wind-val').textContent     = `${Math.round(c.wind_speed_10m)} km/h`;
      document.getElementById('wx-feels-val').textContent    = `Ressenti ${Math.round(c.apparent_temperature)}°C`;

    } catch {
      document.getElementById('weather-error').style.display = 'block';
    }
  }

  let debounce = null;
  async function searchCity() {
    if (debounce) return;
    debounce = setTimeout(() => { debounce = null; }, 1500);

    const input  = document.getElementById('weather-city-input').value.trim();
    const status = document.getElementById('weather-city-status');
    if (!input) return;

    status.textContent = 'Recherche…';
    try {
      const res  = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(input)}&count=1&language=fr&format=json`
      );
      const data = await res.json();

      if (!data.results?.length) { status.textContent = 'Ville introuvable'; return; }

      const r = data.results[0];
      lat  = r.latitude;
      lon  = r.longitude;
      city = `${r.name}${r.country_code ? ', ' + r.country_code : ''}`;

      localStorage.setItem('wx_lat',  lat);
      localStorage.setItem('wx_lon',  lon);
      localStorage.setItem('wx_city', city);

      status.textContent = `✓ ${city}`;
      document.getElementById('weather-city-input').value = '';
      setTimeout(() => { status.textContent = ''; }, 3000);
      load();
    } catch {
      status.textContent = 'Erreur de connexion';
    }
  }

  document.getElementById('weather-city-btn').addEventListener('click', searchCity);
  document.getElementById('weather-city-input').addEventListener('keydown', e => { if (e.key === 'Enter') searchCity(); });

  load();
  setInterval(load, 600_000);
}
