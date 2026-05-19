# 🌸 Firefox Accueil

Page d'accueil personnalisée pour Firefox avec thème rosé et dégradé sombre, calendrier dynamique, météo en temps réel et log automatique des événements passés.

---

## ✨ Fonctionnalités

- **Horloge en temps réel** avec date en français
- **Barre de recherche animée** avec switcher de moteurs (Google, DuckDuckGo, YouTube, GitHub)
- **Météo de Marseille** via [Open-Meteo](https://open-meteo.com/) (sans clé API)
- **Calendrier dynamique** — navigation mois par mois, jours avec événements marqués
- **Gestionnaire d'événements & tâches** — ajout, suppression, marquage comme fait
- **Log automatique en arrière-plan** — les événements passés sont automatiquement écrits dans `evenements.csv` via un serveur Flask local

---

## 📁 Structure du projet

```
firefox-accueil/
├── index.html                 # Page d'accueil principale
├── server.py                  # Serveur Flask local (port 5000)
├── start_firefox_accueil.bat  # Lanceur Windows (double-clic)
├── evenements.csv             # Généré automatiquement au premier log
├── events_log.jsonl           # Log brut JSON (généré automatiquement)
└── README.md
```

---

## 🚀 Installation & Utilisation

### Prérequis

- [Python 3.x](https://www.python.org/downloads/) installé sur Windows
- Flask (installé automatiquement par le `.bat` si absent)

### Lancement

1. **Clone ou télécharge** le repo sur ton PC :
   ```bash
   git clone https://github.com/OnyxBlanc/firefox-accueil.git
   ```

2. **Double-clique** sur `start_firefox_accueil.bat`
   - Vérifie si Flask est installé, l'installe si besoin
   - Démarre le serveur local sur `http://127.0.0.1:5000`
   - Ouvre automatiquement la page dans ton navigateur par défaut

3. **Configure Firefox** pour utiliser cette page comme accueil :
   - Paramètres → Accueil → URL personnalisée : `http://127.0.0.1:5000`

### Lancement manuel (optionnel)

```bash
cd firefox-accueil
pip install flask
python server.py
```

---

## 📅 Calendrier & Tâches

- Clique sur **+ Ajouter** ou directement sur un jour du calendrier pour créer un événement
- Chaque événement a : un **nom**, une **date**, une **durée (min)** et un **type** (Tâche / Événement / Rappel)
- Les événements sont sauvegardés dans le `localStorage` du navigateur
- Coche la case ronde pour marquer un événement comme **fait**
- Les événements passés non faits sont signalés ⏰ *Passé*

---

## 💾 Log automatique CSV

Les événements dont la date est **passée** sont automatiquement envoyés au serveur local en arrière-plan (au chargement de la page, puis toutes les 60 secondes).

Le fichier `evenements.csv` est créé dans le dossier du projet avec les colonnes :

| nom | date | duree_min | type | fait | logged_at |
|-----|------|-----------|------|------|-----------|
| Cours réseaux | 2026-05-18 | 90 | task | non | 2026-05-19T12:00:00 |

Un fichier `events_log.jsonl` est également généré pour un log brut plus complet.

> ⚠️ Le log automatique nécessite que le serveur `server.py` soit lancé. Si ce n'est pas le cas, un message d'avertissement s'affiche brièvement sur la page.

---

## 🎨 Thème

Thème **rosé et dégradé foncé** :
- Fond : `#1a0a10 → #2d1020 → #0d0510`
- Accent : `#c94070 → #e06080 → #f4a0b5`
- Style glassmorphism sur les cartes et widgets
