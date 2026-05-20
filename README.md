# 🌸 Firefox Accueil

> Page d'accueil personnalisée pour Firefox (et tout navigateur Chromium), hébergeable gratuitement sur **GitHub Pages**.

![Thème Rose](https://img.shields.io/badge/th%C3%A8me-5%20couleurs-c94070?style=flat-square)
![Vanilla JS](https://img.shields.io/badge/JS-Vanilla%20ES6-f7df1e?style=flat-square&logo=javascript)
![Pas de dépendance](https://img.shields.io/badge/d%C3%A9pendances-aucune-brightgreen?style=flat-square)

---

## ✨ Fonctionnalités

| Bloc | Description |
|---|---|
| 🕐 Horloge | Heure et date en temps réel, format français |
| 🔍 Recherche | DuckDuckGo, YouTube, GitHub + menu FMHY intégré |
| 🌦️ Météo | Via [Open-Meteo](https://open-meteo.com/) — aucune clé API requise |
| 📅 Calendrier | Navigation mensuelle, points sur les jours avec événements |
| ✅ Tâches | Ajout, complétion, suppression, historique, export CSV |
| ⭐ Favoris | 8 slots à gauche + 8 à droite avec favicon automatique |
| 🎨 Thèmes | 5 couleurs : Rose 🩷 Bleu 💙 Vert 💚 Rouge ❤️ Violet 💜 |
| ⚙️ Config | Panel de configuration, export/import JSON, réinitialisation |
| 🌟 Étoiles | Fond animé avec canvas (pause auto quand l'onglet est inactif) |

---

## 🚀 Démarrage rapide

### Utilisation locale

> ⚠️ Les modules ES6 (`type="module"`) nécessitent un serveur HTTP — l'ouverture directe du fichier `index.html` ne fonctionnera pas.

**Option 1 — VS Code Live Server :**
1. Installe l'extension [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Clic droit sur `index.html` → **Open with Live Server**

**Option 2 — Terminal :**
```bash
cd firefox-accueil
npx serve .
```

### Utilisation dans Firefox
1. Va dans **Paramètres → Accueil**
2. Sélectionne **URL personnalisée**
3. Entre l'URL GitHub Pages (voir ci-dessous) ou ton URL locale

---

## 🌐 Déploiement sur GitHub Pages

1. Fork ou clone ce dépôt
2. Push tes modifications sur la branche `main`
3. Va dans **Settings → Pages**
4. Source : `Deploy from a branch`
5. Branche : `main` / dossier : `/ (root)`
6. Ton site sera disponible sur :
   ```
   https://TON-USERNAME.github.io/firefox-accueil/
   ```

> 💡 Si les changements ne semblent pas s'appliquer dans Firefox, vide le cache avec un **clic droit sur le bouton Actualiser → Vider le cache et recharger**.

---

## 🗂️ Structure du projet

```
firefox-accueil/
├── index.html              # Structure HTML principale + modales
├── README.md
└── assets/
    ├── css/
    │   └── style.css       # Thèmes CSS (variables), layout, animations
    └── js/
        ├── app.js          # Point d'entrée — importe et initialise tous les modules
        └── modules/
            ├── clock.js    # Horloge et date
            ├── config.js   # Panel ⚙️ configuration, export/import JSON
            ├── favorites.js# Favoris latéraux avec favicon
            ├── search.js   # Barre de recherche multi-moteurs + FMHY
            ├── stars.js    # Canvas d'étoiles animées
            ├── tasks.js    # Calendrier, tâches, historique, export CSV
            ├── theme.js    # Sélecteur de thème injecté en JS
            └── weather.js  # Widget météo via Open-Meteo
```

---

## 💾 Stockage local (localStorage)

Toutes les données sont stockées **localement dans le navigateur**, sans serveur ni compte.

| Clé | Contenu |
|---|---|
| `nx_theme` | Thème actif (`rose`, `bleu`, `vert`, `rouge`, `violet`) |
| `nx_favs` | Favoris gauche et droite (`{ left: [...], right: [...] }`) |
| `nx_events` | Tableau des événements/tâches |
| `nx_history` | Historique des tâches terminées ou supprimées |
| `nx_weather_city` | Dernière ville météo recherchée |
| `wx_lat` / `wx_lon` / `wx_city` | Coordonnées et nom de la ville météo |

---

## ⚙️ Panel de configuration

Clic sur le bouton **⚙️** en bas à gauche pour :
- Changer de thème
- **Exporter** toute la configuration en fichier `.json`
- **Importer** une sauvegarde précédente
- **Réinitialiser** toutes les données locales

Le fichier d'export contient : thème, favoris, tâches, historique et ville météo.

---

## 🎨 Personnalisation

### Changer les couleurs d'un thème
Modifie les variables CSS dans `assets/css/style.css` :
```css
[data-theme="rose"] {
  --c1: #c94070;   /* couleur principale */
  --c2: #e06080;   /* couleur secondaire */
  --c3: #f4a0b5;   /* couleur claire / accent */
  ...
}
```

### Ajouter un moteur de recherche
Ajoute un bouton dans `index.html` avec les attributs `data-url`, `data-icon`, `data-ph` :
```html
<button class="engine-tab"
  data-engine="brave"
  data-icon="🦁"
  data-url="https://search.brave.com/search?q="
  data-ph="Rechercher sur Brave…">
  Brave
</button>
```

---

## 🛠️ Notes développeur

- **Dates locales vs UTC** : les dates des événements sont stockées en heure locale (`YYYY-MM-DDTHH:MM`). Ne jamais utiliser `.toISOString()` pour extraire la date — cela convertit en UTC et décale les jours (bug documenté, corrigé dans `tasks.js`).
- **Modules ES6** : le projet utilise `type="module"` — les imports relatifs doivent inclure l'extension `.js`.
- **Thème injecté en JS** : le sélecteur de thème (`#theme-switcher`) est créé dynamiquement dans `theme.js` et attaché au `<body>` pour éviter d'être piégé dans un stacking context.
- **Cache Firefox** : les modifications de modules JS peuvent sembler ne pas s'appliquer à cause du cache agressif de Firefox sur les modules. Utilise les DevTools → onglet Réseau → cocher « Désactiver le cache ».
- **API météo** : [Open-Meteo](https://open-meteo.com/) est gratuite et sans clé API. Mise à jour toutes les 10 minutes.

---

## 📄 Licence

Projet personnel — libre de réutilisation et modification.
