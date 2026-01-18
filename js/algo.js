import { db, ref, set } from './database.js';

export function genererTournoi() {
    const nbTerrains = parseInt(document.getElementById('terrains').value);
    const duree = document.getElementById('dureeMatch').value;
    const listeEq = document.getElementById('equipes').value.split('\n').filter(e => e.trim() !== "");
    const listeArb = document.getElementById('arbitres').value.split('\n').filter(a => a.trim() !== "");

    if (listeEq.length < 2) return alert("Besoin d'au moins 2 équipes !");

    // Liste de toutes les rencontres possibles
    let toutesRencontres = [];
    for (let i = 0; i < listeEq.length; i++) {
        for (let j = i + 1; j < listeEq.length; j++) {
            toutesRencontres.push([listeEq[i], listeEq[j]]);
        }
    }

    let planning = [];
    let matchNum = 1;
    let indexArbitre = 0;

    // Tant qu'il reste des matchs à organiser
    while (toutesRencontres.length > 0) {
        let equipesOccupeesCeTour = new Set();
        
        for (let t = 1; t <= nbTerrains; t++) {
            if (toutesRencontres.length === 0) break;

            // On cherche un match où les deux équipes sont libres ce tour-ci
            let matchIndex = toutesRencontres.findIndex(m => 
                !equipesOccupeesCeTour.has(m[0]) && !equipesOccupeesCeTour.has(m[1])
            );

            // Si on trouve un match possible
            if (matchIndex !== -1) {
                let match = toutesRencontres.splice(matchIndex, 1)[0];
                equipesOccupeesCeTour.add(match[0]);
                equipesOccupeesCeTour.add(match[1]);

                planning.push({
                    id: matchNum++,
                    t1: match[0],
                    t2: match[1],
                    terrain: t,
                    duree: duree,
                    arbitre: listeArb[indexArbitre % listeArb.length] || "Libre",
                    termine: false
                });
                indexArbitre++;
            }
        }
        // Si aucun match n'a pu être placé sur les terrains libres (conflit d'équipes), 
        // on passe au "tour" suivant automatiquement par la boucle
    }

    set(ref(db, 'tournoi/'), {
        config: { nbTerrains, dureeDefault: duree },
        listeMatchs: planning
    }).then(() => alert("✅ Planning optimisé généré !"));
}
