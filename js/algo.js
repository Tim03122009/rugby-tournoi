import { db, ref, set } from './database.js';

export function genererTournoi() {
    const nbTerrains = parseInt(document.getElementById('terrains').value);
    const listeEq = document.getElementById('equipes').value.split('\n').filter(e => e.trim() !== "");
    const listeArb = document.getElementById('arbitres').value.split('\n').filter(a => a.trim() !== "");

    if (listeEq.length < 2) return alert("Besoin d'au moins 2 équipes !");

    let matchs = [];
    // Algorithme simple : tout le monde rencontre tout le monde
    for (let i = 0; i < listeEq.length; i++) {
        for (let j = i + 1; j < listeEq.length; j++) {
            matchs.push({
                id: Math.random().toString(36).substr(2, 9),
                t1: listeEq[i],
                t2: listeEq[j],
                score1: 0,
                score2: 0,
                termine: false,
                terrain: (matchs.length % nbTerrains) + 1,
                arbitre: listeArb[matchs.length % listeArb.length] || "À définir"
            });
        }
    }

    set(ref(db, 'tournoi/'), {
        config: { nbTerrains, lastUpdate: Date.now() },
        listeMatchs: matchs,
        arbitres: listeArb
    }).then(() => alert("✅ Tournoi généré et synchronisé !"));
}
