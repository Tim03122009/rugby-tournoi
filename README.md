# 🏉 Rugby Tournoi

Application web de gestion de tournois de rugby. Permet de configurer un tournoi, générer un planning de matchs et suivre les rencontres en temps réel.

## Fonctionnalités

- **Configuration** : Nombre de terrains, liste des équipes, arbitres, durée des matchs (persistance)
- **Planning automatique** : Génération du planning (Berger) avec créneaux si plus de matchs que terrains
- **Organisation uniquement** : Aucune saisie de scores, chaque page est autonome (pas de navigation entre pages)

## Booster features

- **Admin** : Templates rapides (4/6/8 équipes), prévisualisation avant génération, URLs à copier pour partager
- **Gérant** : Barre de progression (matchs terminés / total), impression
- **Coach** : Bloc « Prochain match » mis en avant, bouton impression
- **Arbitre** : Chronomètre par match, vue synthèse des terrains (occupé/libre), filtre par terrain
- **Global** : Indicateur de chargement, favicon, styles d’impression

## Rôles et pages (URLs distinctes)

| Page | Fichier | Rôle |
|------|---------|------|
| **Admin** | `index.html` | Configure et génère le planning, partage les URLs |
| **Gérant** | `gerant.html` | Vue globale + progression, impression |
| **Coach** | `coach.html` | Prochain match en évidence, impression |
| **Arbitre** | `arbitre.html` | Chrono, synthèse terrains, validation « match terminé » |

## Technologies

- **Frontend** : HTML5, CSS3, JavaScript (modules ES6)
- **Base de données** : Firebase Realtime Database (données partagées en temps réel)

## Démarrage

1. Ouvrir `index.html` dans un navigateur (ou via un serveur local)
2. Configurer le tournoi et cliquer sur **GÉNÉRER LE PLANNING**
3. Ouvrir les autres pages (`gerant.html`, `coach.html`, `arbitre.html`) selon les rôles

## Logique de rotation

- Utilisation de l’**algorithme de Berger** pour répartir les confrontations
- Nombre impair d’équipes : une équipe « bye » assure une rotation équitable
- Rotation des arbitres : attribution circulaire selon le nombre d’arbitres
- Les matchs sont répartis sur les terrains disponibles sans doublon

## Structure du projet

```
rugby-tournoi/
├── index.html      # Admin - configuration
├── gerant.html     # Vue globale
├── coach.html      # Espace coach
├── arbitre.html    # Interface arbitre
├── style.css       # Styles communs
├── js/
│   ├── algo.js     # Algorithme de génération du planning
│   └── database.js # Connexion Firebase
└── DOCS_PROJET.md  # Documentation technique
```
