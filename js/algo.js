import { db, ref, set } from './database.js';

export function genererTournoi() {
    const nbTerrains = parseInt(document.getElementById('terrains').value);
    const duree = document.getElementById('dureeMatch').value;
    const listeEq = document.getElementById('equipes').value.split('\n').filter(e => e.trim() !== "");
    const listeArb = document.getElementById('arbitres').value.split('\n').filter(a => a.trim() !== "");

    if (listeEq.length < 2) return alert("Besoin d'au moins 2 équipes !");

    let toutesRencontres = [];
    for (let i = 0; i < listeEq.length; i++) {
        for (let j = i + 1; j < listeEq.length; j++) {
            toutesRencontres.push([listeEq[i], listeEq[j]]);
        }
    }

    let planning = [];
    let matchNum = 1;
    let indexArbitre = 0;

    while (toutesRencontres.length > 0) {
        let equipesOccupeesCeTour = new Set();
        let matchsTrouvesCeTour = false;
        
        for (let t = 1; t <= nbTerrains; t++) {
            let matchIndex = toutesRencontres.findIndex(m => 
                !equipesOccupeesCeTour.has(m[0]) && !equipesOccupeesCeTour.has(m[1])
            );

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
                    arbitre: listeArb[indexArbitre % listeArb.length] || "Non assigné",
                    termine: false
                });
                indexArbitre++;
                matchsTrouvesCeTour = true;
            }
        }
        if (!matchsTrouvesCeTour) {
            // Si on ne peut plus placer de match sans faire rejouer une équipe, 
            // on libère les équipes pour le "tour" suivant
            equipesOccupeesCeTour.clear();
            // On force la sortie pour passer au tour suivant de la boucle while
            matchsTrouvesCeTour = true; 
            if (toutesRencontres.length > 0 && planning.length > 0 && planning[planning.length-1].terrain === nbTerrains) {
                // simple sécurité pour éviter boucle infinie
            }
        }
    }

    set(ref(db, 'tournoi/'), {
        config: { nbTerrains, dureeDefault: duree },
        listeMatchs: planning
    }).then(() => alert("✅ Planning généré !"));
}
