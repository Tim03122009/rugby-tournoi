# 🏉 Projet Gestion Rugby

## Fonctionnement
- **Admin** (`index.html`) : Configure le nombre de terrains, équipes et arbitres. Génère le planning.
- **Gérant** (`gerant.html`) : Vue globale des scores.
- **Coach** (`coach.html`) : Chaque coach sélectionne son équipe pour voir ses matchs.
- **Arbitre** (`arbitre.html`) : Chrono et validation du score par terrain.

## Logique de rotation
- Priorité aux équipes qui ont le plus gros temps de repos.
- Rotation automatique des arbitres si Nb_Arbitres > Nb_Terrains.
- Pas de doublons de matchs.
