# 🌸 Firefox Accueil

Page d'accueil personnalisée pour Firefox (et tout navigateur), hébergeable sur **GitHub Pages**.

## Structure

```
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       └── modules/
│           ├── theme.js
│           ├── stars.js
│           ├── clock.js
│           ├── search.js
│           ├── weather.js
│           ├── favorites.js
│           └── tasks.js
```

## Fonctionnalités

- 🕐 Horloge & date en temps réel
- 🔍 Recherche multi-moteurs (DuckDuckGo, YouTube, GitHub) + FMHY
- 🌦️ Météo via Open-Meteo (sans clé API)
- 📅 Calendrier avec événements
- ✅ Tâches & rappels avec export CSV
- ⭐ Favoris sur colonnes latérales (favicon auto)
- 🎨 5 thèmes de couleur (Rose, Bleu, Vert, Rouge, Violet)
- 🌟 Canvas d'étoiles animées

## Hébergement sur GitHub Pages

1. Fork ou clone ce dépôt
2. Va dans **Settings > Pages**
3. Source : `Deploy from a branch`
4. Branche : `main` / dossier : `/ (root)`
5. Ton site sera disponible sur `https://ton-user.github.io/firefox-accueil/`

## Utilisation locale

Ouvre simplement `index.html` dans ton navigateur.

> ⚠️ Les modules JavaScript (`type="module"`) nécessitent un serveur HTTP pour fonctionner en local.
> Utilise [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) sur VS Code, ou :
> ```bash
> npx serve .
> ```

## Personnalisation

- **Thème** : clic sur les pastilles en bas à droite
- **Favoris** : clic sur les slots `＋` dans les colonnes
- **Météo** : entre ta ville dans le champ météo
- **Couleurs** : modifie les variables CSS dans `style.css`
