import { db, ref, set } from './database.js';

export function genererTournoi() {
    const nbTerrains = parseInt(document.getElementById('terrains').value);
    const duree = document.getElementById('dureeMatch').value;
    let equipes = document.getElementById('equipes').value.split('\n').filter(e => e.trim() !== "");
    const listeArb = document.getElementById('arbitres').value.split('\n').filter(a => a.trim() !== "");

    if (equipes.length < 2) return alert("Besoin d'au moins 2 équipes !");

    // Gestion du nombre impair
    if (equipes.length % 2 !== 0) {
        equipes.push("REPOS_FICTIF");
    }

    const n = equipes.length;
    let planning = [];
    let matchGlobalId = 1;
    let indexArb = 0;

    // Algorithme de rotation (Berger)
    for (let tour = 0; tour < n - 1; tour++) {
        let terrainActuel = 1;
        let equipeExempte = "";

        for (let i = 0; i < n / 2; i++) {
            let e1 = equipes[i];
            let e2 = equipes[n - 1 - i];

            if (e1 === "REPOS_FICTIF" || e2 === "REPOS_FICTIF") {
                equipeExempte = (e1 === "REPOS_FICTIF") ? e2 : e1;
            } else {
                if (terrainActuel <= nbTerrains) {
                    planning.push({
                        id: matchGlobalId++,
                        tour: tour + 1,
                        t1: e1,
                        t2: e2,
                        terrain: terrainActuel++,
                        duree: duree,
                        arbitre: listeArb[indexArb % listeArb.length] || "Libre",
                        termine: false,
                        exempte: "" // Sera mis à jour juste après
                    });
                    indexArb++;
                }
            }
        }
        // Assigner l'équipe au repos à tous les matchs de ce tour pour affichage
        planning.filter(m => m.tour === tour + 1).forEach(m => m.exempte = equipeExempte);

        // Rotation des équipes sauf la première
        equipes.splice(1, 0, equipes.pop());
    }

    set(ref(db, 'tournoi/'), {
        listeMatchs: planning,
        lastUpdate: Date.now()
    }).then(() => alert("✅ Planning généré avec succès !"));
}
