# 🏉 Projet Gestion Rugby

Application de gestion de tournoi round-robin pour le rugby, conçue pour des tournois jeunes (enfants). Optimisation des repos pour éviter que les équipes attendent trop (jamais 2 repos d'affilée).

## Fonctionnement
- **Admin** (`index.html`) : Configure le nombre de terrains, équipes et arbitres. Génère le planning.
- **Gérant** (`gerant.html`) : Vue globale du planning. Validation des matchs terminés (jury).
- **Coach** (`coach.html`) : Chaque coach sélectionne son équipe pour voir ses matchs.
- **Arbitre** (`arbitre.html`) : Vue des matchs en cours par terrain (les matchs disparaissent quand validés par le jury).

## Logique de rotation
- **Espacer les repos** : toutes les équipes ont le même nombre de tours de repos (round-robin), mais on évite au maximum les repos consécutifs pour ne pas « souler » les équipes.
- Rotation automatique des arbitres si Nb_Arbitres > Nb_Terrains.
- Pas de doublons de matchs.
