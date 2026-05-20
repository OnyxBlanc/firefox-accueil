# 🌸 Firefox Accueil

Une page d'accueil personnalisée pour Firefox — minimaliste, élégante et entièrement configurable sans aucune dépendance externe.

![Aperçu](https://raw.githubusercontent.com/OnyxBlanc/firefox-accueil/main/preview.png)

> **Un seul fichier. Zéro framework. Zéro installation.**  
> Tout se passe dans `index.html`.

---

## ✨ Fonctionnalités

| Bloc | Description |
|---|---|
| 🌟 **Canvas étoiles** | Fond animé avec des étoiles qui scintillent et se déplacent doucement |
| 🕐 **Horloge** | Heure en temps réel + date en français |
| 🔍 **Recherche** | Barre de recherche multi-moteurs (DuckDuckGo, YouTube, GitHub) |
| 📚 **FMHY** | Menu rapide vers les catégories du wiki Free Media Heck Yeah |
| 🌦️ **Météo** | Météo en direct via [Open-Meteo](https://open-meteo.com) (sans clé API) |
| 📅 **Calendrier** | Calendrier mensuel avec points sur les jours ayant des événements |
| ✅ **Tâches & Événements** | Ajout, suppression, complétion, export CSV |
| 🕘 **Historique** | Archive des tâches terminées ou supprimées, exportable en CSV |
| ⭐ **Favoris** | 8 favoris à gauche + 8 à droite, avec favicon automatique |

---

## 🚀 Installation

### Méthode 1 — Téléchargement direct

1. Télécharge [`index.html`](https://raw.githubusercontent.com/OnyxBlanc/firefox-accueil/main/index.html)
2. Place-le où tu veux sur ton ordinateur (ex. `C:\Users\Toi\accueil\index.html`)
3. Dans Firefox, va dans **Paramètres → Accueil**
4. Mets **Pages personnalisées** et entre le chemin local :
   ```
   file:///C:/Users/Toi/accueil/index.html
   ```

### Méthode 2 — Cloner le dépôt

```bash
git clone https://github.com/OnyxBlanc/firefox-accueil.git
cd firefox-accueil
```

Puis pointe Firefox sur `file:///chemin/vers/firefox-accueil/index.html`.

> 💡 **Conseil** : pour que Firefox charge correctement les polices Google Fonts, active l'accès réseau ou utilise une connexion internet.

---

## 📁 Structure du projet

```
firefox-accueil/
├── index.html   ← tout le projet (HTML + CSS + JS)
└── README.md
```

Le projet est intentionnellement **mono-fichier** pour être simple à utiliser, modifier et partager.

---

## 🎨 Personnaliser l'apparence

### Changer les couleurs

Toutes les couleurs du thème sont définies directement dans le CSS. Les teintes roses/bordeaux utilisent ces valeurs clés — modifie-les pour changer l'ambiance générale :

```css
/* Couleur principale (rose vif) */
#c94070

/* Couleur secondaire (rose clair) */
#e06080

/* Fond dégradé du body */
background: linear-gradient(135deg, #1a0a10 0%, #2d1020 30%, #1e0a1a 60%, #0d0510 100%);

/* Texte principal */
color: #f0d6e0;
```

### Changer la police

Remplace l'import Google Fonts dans le `<head>` :

```html
<!-- Avant -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" />

<!-- Après (ex : JetBrains Mono) -->
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600&display=swap" />
```

Puis change `font-family: 'Inter', sans-serif;` dans le CSS.

### Modifier la citation

Cherche ce bloc HTML près de la fin du `<body>` :

```html
<p id="quote">« Le seul moyen de faire du bon travail, c'est d'aimer ce qu'on fait. »</p>
```

Remplace le texte par la citation de ton choix.

---

## 🔍 Ajouter un moteur de recherche

Dans le HTML, repère le bloc `#engine-tabs` et ajoute un bouton :

```html
<button class="engine-tab"
  data-engine="google"
  data-icon="🔵"
  data-url="https://www.google.com/search?q="
  data-ph="Rechercher sur Google…">
  Google
</button>
```

| Attribut | Rôle |
|---|---|
| `data-engine` | Identifiant unique (peu importe la valeur) |
| `data-icon` | Emoji affiché dans la barre de recherche |
| `data-url` | URL de recherche — la requête sera ajoutée à la fin |
| `data-ph` | Texte placeholder dans le champ |

---

## 🌦️ Changer la ville météo par défaut

Cherche ces lignes dans le JavaScript (section **MÉTÉO**) :

```js
let weatherLat      = parseFloat(store.raw('wx_lat',  '43.2965'));
let weatherLon      = parseFloat(store.raw('wx_lon',  '5.3698'));
let weatherCityName = store.raw('wx_city', 'Marseille, FR');
```

Remplace les coordonnées et le nom par ta ville. Tu peux trouver les coordonnées sur [latlong.net](https://www.latlong.net/).

> Tu peux aussi changer la ville directement depuis l'interface : utilise le champ de recherche dans le widget météo.

---

## ⭐ Favoris

Les favoris sont sauvegardés automatiquement dans le `localStorage` du navigateur. Pour les configurer :

- **Clic sur un slot vide** → ouvre la modale d'ajout
- **Hover sur un favori existant** → apparition du bouton ✏️ pour éditer ou supprimer
- Le favicon est chargé automatiquement via l'API Google Favicons

---

## 💾 Données & localStorage

Toutes les données utilisateur sont stockées **localement** dans le navigateur via `localStorage`. Aucune donnée n'est envoyée à un serveur.

| Clé | Contenu |
|---|---|
| `nx_events` | Liste des événements/tâches |
| `nx_history` | Historique des tâches archivées |
| `nx_favs` | Configuration des favoris |
| `wx_lat` / `wx_lon` / `wx_city` | Ville météo sauvegardée |

> ⚠️ Vider le cache du navigateur efface ces données. Utilise le bouton **⬇️ CSV** pour exporter avant de nettoyer.

---

## 🛠️ Architecture du code

Le fichier `index.html` est découpé en sections clairement délimitées :

### CSS
```
══ RESET & BASE ══
══ CANVAS ÉTOILES ══
══ COLONNES FAVORIS ══
══ HORLOGE ══
══ BARRE DE RECHERCHE ══
══ WIDGET MÉTÉO ══
══ PANEL PRINCIPAL : CALENDRIER + TÂCHES ══
══ MODALES ══
══ PIED DE PAGE ══
```

### JavaScript
```
══ STORAGE HELPER ══       ← wrapper localStorage sécurisé
══ CANVAS ÉTOILES ══       ← IIFE isolée, RAF pausé en arrière-plan
══ HORLOGE ══
══ MOTEUR DE RECHERCHE ══
══ MODALE FMHY ══
══ MÉTÉO ══
══ FAVORIS ══
══ ÉVÉNEMENTS & TÂCHES ══  ← calendrier, liste, historique, modales
══ INIT ══                 ← renderCalendar() + renderTasks()
```

---

## 🤝 Contribuer

Les PR sont les bienvenues ! Pour proposer une amélioration :

1. Fork le dépôt
2. Crée une branche : `git checkout -b feat/ma-fonctionnalite`
3. Commit tes changements : `git commit -m "feat: description"`
4. Push : `git push origin feat/ma-fonctionnalite`
5. Ouvre une Pull Request

---

## 📄 Licence

Ce projet est sous licence **MIT** — libre d'utilisation, modification et distribution.

---

<p align="center">
  Fait avec ❤️ par <a href="https://github.com/OnyxBlanc">OnyxBlanc</a>
</p>
