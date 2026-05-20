/* ═══════════════════════════════════════════════════════════════
   APP.JS — Point d'entrée principal
   Importe et initialise tous les modules dans l'ordre correct :
   1. initTheme()    → applique le thème sauvegardé + injecte le sélecteur
   2. initStars()    → démarre le canvas d'étoiles animées
   3. initClock()    → démarre l'horloge temps réel
   4. initSearch()   → active la barre de recherche multi-moteurs
   5. initWeather()  → charge la météo et active le changement de ville
   6. initFavs()     → affiche les favoris latéraux
   7. initTasks()    → affiche calendrier + tâches
   8. initConfig()   → injecte le bouton ⚙️ et la modale de configuration
═══════════════════════════════════════════════════════════════ */

import { initStars }   from './modules/stars.js';
import { initClock }   from './modules/clock.js';
import { initSearch }  from './modules/search.js';
import { initWeather } from './modules/weather.js';
import { initFavs }    from './modules/favorites.js';
import { initTasks }   from './modules/tasks.js';
import { initTheme }   from './modules/theme.js';
import { initConfig }  from './modules/config.js';

initTheme();
initStars();
initClock();
initSearch();
initWeather();
initFavs();
initTasks();
initConfig();
