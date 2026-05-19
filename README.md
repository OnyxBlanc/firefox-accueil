# 🌸 Firefox Accueil

Page d'accueil personnalisée pour Firefox avec thème rosé et dégradé sombre, calendrier dynamique, météo en temps réel et gestion d'événements locale.

---

## ✨ Fonctionnalités

- **Horloge en temps réel** avec date en français
- **Barre de recherche animée** avec switcher de moteurs (DuckDuckGo par défaut, YouTube, GitHub)
- **Menu FMHY** — bouton dédié avec popup de catégories (Wiki & Tools) qui s'ouvre au clic
- **Météo en temps réel** via [Open-Meteo](https://open-meteo.com/) (sans clé API) avec changement de ville
- **Calendrier dynamique** — navigation mois par mois, jours avec événements marqués, support multi-jours
- **Gestionnaire d'événements & tâches** — ajout avec date/heure de début et fin, suppression, marquage comme fait
- **Export CSV** des événements via le bouton ⬇️ CSV

---

## 📁 Structure du projet

```
firefox-accueil/
├── index.html   # Page d'accueil principale (tout-en-un, aucun serveur requis)
└── README.md
```

---

## 🚀 Installation & Utilisation

1. **Clone ou télécharge** le repo sur ton PC :
   ```bash
   git clone https://github.com/OnyxBlanc/firefox-accueil.git
   ```

2. **Ouvre `index.html`** directement dans Firefox (aucun serveur requis)

3. **Configure Firefox** pour utiliser cette page comme accueil :
   - Paramètres → Accueil → URL personnalisée → colle le chemin local du fichier

---

## 📅 Calendrier & Tâches

- Clique sur **+ Ajouter** ou directement sur un jour du calendrier pour créer un événement
- Chaque événement a : un **nom**, une **date/heure de début**, une **date/heure de fin** et un **type** (Tâche / Événement / Rappel)
- La durée est calculée automatiquement et affichée (ex : `2j 3h 30min`)
- Les événements multi-jours sont marqués sur chaque jour du calendrier
- Les événements sont sauvegardés dans le `localStorage` du navigateur
- Coche la case ronde pour marquer un événement comme **fait**
- Les événements passés non faits sont signalés ⏰ *Passé*
- Export CSV disponible via le bouton **⬇️ CSV**

---

## 🔍 Moteurs de recherche

| Moteur | Icône | Description |
|--------|-------|-------------|
| DuckDuckGo | 🦆 | Moteur par défaut, respect de la vie privée |
| YouTube | ▶️ | Recherche de vidéos |
| GitHub | 🐙 | Recherche de dépôts et code |
| FMHY | 📚 | Menu popup avec toutes les catégories du site |

### Menu FMHY

Le bouton FMHY ouvre un panneau popup avec les catégories de [fmhy.net](https://fmhy.net) :
- **Wiki** : Privacy, AI, Films/Séries, Musique, Gaming, Livres, Téléchargement, Torrents, Éducation, Android/iOS, Linux/macOS, Non-English, Misc
- **Tools** : Système, Fichiers, Internet, Réseaux sociaux, Texte, Gaming, Image, Vidéo, Audio, Éducation, Développeur

---

## 💾 Stockage local

Toutes les données sont stockées dans le `localStorage` du navigateur, aucun serveur ni base de données n'est requis :
- Événements et tâches
- Ville météo et coordonnées

---

## 🎨 Thème

Thème **rosé et dégradé foncé** :
- Fond : `#1a0a10 → #2d1020 → #0d0510`
- Accent : `#c94070 → #e06080 → #f4a0b5`
- Style glassmorphism sur les cartes et widgets
