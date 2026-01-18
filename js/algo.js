import { db, ref, set } from './database.js';

export function genererTournoi() {
    const nbTerrains = parseInt(document.getElementById('terrains').value);
    const duree = document.getElementById('dureeMatch').value;
    let equipes = document.getElementById('equipes').value.split('\n').filter(e => e.trim() !== "");
    const listeArb = document.getElementById('arbitres').value.split('\n').filter(a => a.trim() !== "");

    if (equipes.length < 2) return alert("Besoin d'au moins 2 équipes !");

    // Si le nombre d'équipes est impair, on ajoute une équipe fictive "Repos"
    let avecRepos = false;
    if (equipes.length % 2 !== 0) {
        equipes.push("REPOS");
        avecRepos = true;
    }

    const nbEquipes = equipes.length;
    const nbTours = nbEquipes - 1;
    const matchsParTour = nbEquipes / 2;
    let planning = [];
    let matchGlobalId = 1;
    let indexArb = 0;

    // Algorithme de Berger (Rotation)
    for (let tour = 0; tour < nbTours; tour++) {
        let terrainActuel = 1;
        let reposDuTour = "";

        for (let i = 0; i < matchsParTour; i++) {
            let eq1 = equipes[i];
            let eq2 = equipes[nbEquipes - 1 - i];

            // Si l'une des deux est l'équipe fictive, c'est un repos
            if (eq1 === "REPOS" || eq2 === "REPOS") {
                reposDuTour = (eq1 === "REPOS") ? eq2 : eq1;
            } else {
                // On ne remplit les terrains que si on a assez de place
                if (terrainActuel <= nbTerrains) {
                    planning.push({
                        id: matchGlobalId++,
                        tour: tour + 1,
                        t1: eq1,
                        t2: eq2,
                        terrain: terrainActuel++,
                        duree: duree,
                        arbitre: listeArb[indexArb % listeArb.length] || "Libre",
                        termine: false,
                        equipeRepos: "" // Sera rempli après
                    });
                    indexArb++;
                }
            }
        }

        // On marque l'équipe au repos pour tous les matchs de ce tour
        planning.filter(m => m.tour === tour + 1).forEach(m => {
            m.equipeRepos = reposDuTour;
        });

        // Rotation des équipes (on garde la première fixe)
        equipes.splice(1, 0, equipes.pop());
    }

    set(ref(db, 'tournoi/'), {
        config: { nbTerrains, dureeDefault: duree },
        listeMatchs: planning
    }).then(() => alert("✅ Planning parfait généré !"));
}
