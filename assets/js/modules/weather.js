const ICONS = {
  0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',
  51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',
  71:'❄️',73:'❄️',75:'❄️',80:'🌦️',81:'🌧️',82:'⛈️',
  95:'⛈️',96:'⛈️',99:'⛈️',
};

const DESCS = {
  0:'Ciel dégagé',1:'Peu nuageux',2:'Partiellement nuageux',3:'Couvert',
  45:'Brouillard',48:'Brouillard givrant',
  51:'Bruine légère',53:'Bruine',55:'Bruine forte',
  61:'Pluie légère',63:'Pluie',65:'Pluie forte',
  71:'Neige légère',73:'Neige',75:'Neige forte',
  80:'Averses légères',81:'Averses',82:'Averses violentes',
  95:'Orage',96:'Orage avec grêle',99:'Orage violent',
};

export function initWeather() {
  let lat  = parseFloat(localStorage.getItem('wx_lat')  || '43.2965');
  let lon  = parseFloat(localStorage.getItem('wx_lon')  || '5.3698');
  let city = localStorage.getItem('wx_city') || 'Marseille, FR';

  async function load() {
    document.getElementById('weather-error').style.display = 'none';
    try {
      const res  = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh&timezone=auto`);
      const data = await res.json();
      const c    = data.current;
      document.getElementById('weather-icon').textContent     = ICONS[c.weather_code] ?? '🌡️';
      document.getElementById('weather-temp').textContent     = `${Math.round(c.temperature_2m)}°C`;
      document.getElementById('weather-desc').textContent     = DESCS[c.weather_code] ?? 'Inconnu';
      document.getElementById('weather-city-label').textContent = `📍 ${city}`;
      document.getElementById('weather-humidity').textContent = `💧 ${c.relative_humidity_2m}%`;
      document.getElementById('weather-wind').textContent     = `💨 ${Math.round(c.wind_speed_10m)} km/h`;
      document.getElementById('weather-feels').textContent    = `🌡️ Ressenti ${Math.round(c.apparent_temperature)}°C`;
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
    status.textContent = '🔍 Recherche…';
    try {
      const res  = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(input)}&count=1&language=fr&format=json`);
      const data = await res.json();
      if (!data.results?.length) { status.textContent = '❌ Ville introuvable'; return; }
      const r = data.results[0];
      lat  = r.latitude;
      lon  = r.longitude;
      city = `${r.name}${r.country_code ? ', ' + r.country_code : ''}`;
      localStorage.setItem('wx_lat', lat);
      localStorage.setItem('wx_lon', lon);
      localStorage.setItem('wx_city', city);
      status.textContent = `✓ ${city}`;
      document.getElementById('weather-city-input').value = '';
      setTimeout(() => { status.textContent = ''; }, 3000);
      load();
    } catch {
      status.textContent = '❌ Erreur de connexion';
    }
  }

  document.getElementById('weather-city-btn').addEventListener('click', searchCity);
  document.getElementById('weather-city-input').addEventListener('keydown', e => { if (e.key === 'Enter') searchCity(); });
  load();
  setInterval(load, 600_000);
}
